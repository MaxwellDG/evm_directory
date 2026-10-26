import { Box, Flex, Text } from "@chakra-ui/react"
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import type { EscrowOfferEventType } from "../../api/types"
import EventChart from "../../components/escrowEvents/eventChart"
import EventRecords from "../../components/escrowEvents/eventRecords"
import { EVENT_TYPES, gradient, type EventTypeMeta } from "../../components/escrowEvents/eventTypes"
import { useEscrowEvents, type EventRecord } from "../../components/escrowEvents/useEscrowEvents"
import { ROUTES } from "../../routing/routes"
import { formatEth } from "../../utils/format"

const DISPLAY_FONT = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const EASE = [0.22, 1, 0.36, 1] as const
const SPRING = { type: "spring", stiffness: 140, damping: 22, mass: 0.9 } as const

const gradientText = (m: EventTypeMeta) => ({
    backgroundImage: gradient(m),
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
})

/** Soft, slowly drifting colour fields tinted by the active event type. */
function Aurora({ meta }: { meta?: EventTypeMeta }) {
    const a = meta?.from ?? "#6366f1"
    const b = meta?.to ?? "#d946ef"
    return (
        <Box position="absolute" inset={0} overflow="hidden" pointerEvents="none" aria-hidden>
            <motion.div
                style={{ position: "absolute", width: "60vw", height: "60vw", left: "-10vw", top: "-20vw", borderRadius: "50%", filter: "blur(120px)" }}
                animate={{ backgroundColor: a, opacity: 0.18, x: [0, 60, 0], y: [0, 40, 0] }}
                transition={{ backgroundColor: { duration: 1.2 }, x: { duration: 18, repeat: Infinity }, y: { duration: 22, repeat: Infinity } }}
            />
            <motion.div
                style={{ position: "absolute", width: "50vw", height: "50vw", right: "-15vw", bottom: "-20vw", borderRadius: "50%", filter: "blur(120px)" }}
                animate={{ backgroundColor: b, opacity: 0.16, x: [0, -50, 0], y: [0, -30, 0] }}
                transition={{ backgroundColor: { duration: 1.2 }, x: { duration: 20, repeat: Infinity }, y: { duration: 16, repeat: Infinity } }}
            />
            <Box
                position="absolute"
                inset={0}
                backgroundImage="radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)"
                backgroundSize="28px 28px"
                maskImage="radial-gradient(ellipse at center, black 30%, transparent 75%)"
            />
        </Box>
    )
}

type NameProps = {
    meta: EventTypeMeta
    count?: number
    variant: "hero" | "rail" | "title"
    index?: number
    onSelect?: () => void
    onHover?: (m?: EventTypeMeta) => void
}

/** One event-type name; shares a layoutId so it glides between hero, rail and title positions. */
function EventName({ meta, count, variant, index = 0, onSelect, onHover }: NameProps) {
    const size = variant === "hero" ? "clamp(2.4rem, 6.2vw, 5.6rem)" : variant === "title" ? "clamp(2.6rem, 5vw, 4.6rem)" : "1.15rem"
    const content = (
        <motion.span
            layoutId={`event-${meta.type}`}
            transition={SPRING}
            style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: "0.5em",
                fontFamily: DISPLAY_FONT,
                fontWeight: 700,
                fontSize: size,
                lineHeight: 1.02,
                letterSpacing: variant === "rail" ? "0" : "-0.03em",
                whiteSpace: "nowrap",
            }}
        >
            <span style={gradientText(meta)}>{meta.name}</span>
            {count !== undefined && variant !== "title" && (
                <span
                    style={{
                        fontSize: variant === "hero" ? "0.22em" : "0.7em",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.45)",
                        letterSpacing: "0.05em",
                        transform: variant === "hero" ? "translateY(-1.6em)" : undefined,
                    }}
                >
                    {count}
                </span>
            )}
        </motion.span>
    )

    if (variant === "title") return content

    return (
        <motion.button
            type="button"
            onClick={onSelect}
            onMouseEnter={() => onHover?.(meta)}
            onMouseLeave={() => onHover?.(undefined)}
            onFocus={() => onHover?.(meta)}
            onBlur={() => onHover?.(undefined)}
            initial={variant === "hero" ? { opacity: 0, y: 30, filter: "blur(8px)" } : false}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: EASE, delay: variant === "hero" ? 0.08 * index : 0 }}
            whileHover={variant === "hero" ? { x: 18 } : { x: 6 }}
            whileTap={{ scale: 0.98 }}
            style={{
                background: "none",
                border: "none",
                padding: variant === "hero" ? "0.1em 0" : "0.55em 0",
                cursor: "pointer",
                textAlign: "left",
                position: "relative",
                outlineOffset: 6,
            }}
            aria-label={`Show ${meta.name} events`}
        >
            {content}
        </motion.button>
    )
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <Box>
            <Text fontSize="xs" letterSpacing="0.2em" color="whiteAlpha.500">
                {label}
            </Text>
            <Text fontFamily={DISPLAY_FONT} fontSize="2xl" fontWeight="semibold" color="white">
                {value}
            </Text>
        </Box>
    )
}

function Focus({ meta, records }: { meta: EventTypeMeta; records: EventRecord[] }) {
    const volume = records.reduce((acc, r) => acc + BigInt(r.amount ?? r.offer.amount ?? "0"), 0n)
    const actors = new Set(records.map((r) => r.actor).filter(Boolean)).size
    return (
        <motion.div
            key={meta.type}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        >
            <Text color="whiteAlpha.700" fontSize="lg" mt={3} maxW="560px">
                {meta.blurb}.
            </Text>
            <Flex gap={12} mt={8} wrap="wrap">
                <Metric label="EVENTS" value={records.length.toLocaleString("en-US")} />
                <Metric label="ETH MOVED" value={formatEth(volume.toString(), 3)} />
                <Metric label="UNIQUE ACTORS" value={actors.toLocaleString("en-US")} />
            </Flex>
            <Box
                mt={8}
                p={6}
                borderRadius="2xl"
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.100"
                backdropFilter="blur(12px)"
            >
                <EventChart meta={meta} records={records} />
            </Box>
            <Text mt={10} mb={2} fontSize="xs" letterSpacing="0.2em" color="whiteAlpha.500">
                LATEST
            </Text>
            <EventRecords meta={meta} records={records} />
        </motion.div>
    )
}

export default function EscrowEvents() {
    const { data, error } = useEscrowEvents()
    const [selected, setSelected] = useState<EscrowOfferEventType>()
    const [hovered, setHovered] = useState<EventTypeMeta>()

    const selectedMeta = useMemo(() => EVENT_TYPES.find((m) => m.type === selected), [selected])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(undefined)
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    return (
        <MotionConfig reducedMotion="user">
            <Box
                position="fixed"
                inset={0}
                zIndex={10}
                bg="#07070d"
                color="white"
                overflowY="auto"
                fontFamily="'Manrope', system-ui, sans-serif"
            >
                <Aurora meta={selectedMeta ?? hovered} />

                <Flex position="relative" justify="space-between" align="center" px={{ base: 6, md: 12 }} pt={8}>
                    <RouterLink to={ROUTES.CONTRACTS}>
                        <Text fontSize="xs" letterSpacing="0.3em" color="whiteAlpha.600" _hover={{ color: "white" }}>
                            ← EVM DIRECTORY
                        </Text>
                    </RouterLink>
                    <Text fontSize="xs" letterSpacing="0.3em" color="whiteAlpha.500">
                        DIRECTORYESCROW · SEPOLIA
                    </Text>
                </Flex>

                {error && (
                    <Text position="relative" px={{ base: 6, md: 12 }} pt={4} color="red.300" fontSize="sm">
                        {error}
                    </Text>
                )}

                <LayoutGroup>
                    {!selectedMeta ? (
                        <Flex
                            position="relative"
                            direction="column"
                            justify="center"
                            minH="calc(100vh - 80px)"
                            px={{ base: 6, md: "10vw" }}
                            py={10}
                        >
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                style={{ letterSpacing: "0.3em", fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 24 }}
                            >
                                CHOOSE AN ESCROW EVENT
                            </motion.p>
                            {EVENT_TYPES.map((m, i) => (
                                <Box key={m.type} position="relative">
                                    <EventName
                                        meta={m}
                                        variant="hero"
                                        index={i}
                                        count={data?.[m.type].length}
                                        onSelect={() => setSelected(m.type)}
                                        onHover={setHovered}
                                    />
                                    <AnimatePresence>
                                        {hovered?.type === m.type && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                style={{
                                                    position: "absolute",
                                                    right: 0,
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    maxWidth: 260,
                                                    fontSize: 14,
                                                    color: "rgba(255,255,255,0.6)",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                {m.blurb}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Box>
                            ))}
                        </Flex>
                    ) : (
                        <Flex position="relative" minH="calc(100vh - 80px)" px={{ base: 6, md: 12 }} py={10} gap={{ base: 6, md: 16 }}>
                            <Flex
                                as="nav"
                                direction="column"
                                position="sticky"
                                top={10}
                                alignSelf="flex-start"
                                minW={{ base: "140px", md: "220px" }}
                                borderRight="1px solid"
                                borderColor="whiteAlpha.100"
                                pr={6}
                            >
                                <motion.button
                                    type="button"
                                    onClick={() => setSelected(undefined)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    whileHover={{ x: -4 }}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        color: "rgba(255,255,255,0.5)",
                                        fontSize: 11,
                                        letterSpacing: "0.3em",
                                        marginBottom: 16,
                                    }}
                                >
                                    ← ALL EVENTS
                                </motion.button>
                                {EVENT_TYPES.filter((m) => m.type !== selected).map((m) => (
                                    <EventName
                                        key={m.type}
                                        meta={m}
                                        variant="rail"
                                        count={data?.[m.type].length}
                                        onSelect={() => setSelected(m.type)}
                                    />
                                ))}
                            </Flex>

                            <Box flex="1" maxW="900px" mx="auto">
                                <EventName meta={selectedMeta} variant="title" />
                                <AnimatePresence mode="wait">
                                    <Focus key={selectedMeta.type} meta={selectedMeta} records={data?.[selectedMeta.type] ?? []} />
                                </AnimatePresence>
                            </Box>
                        </Flex>
                    )}
                </LayoutGroup>
            </Box>
        </MotionConfig>
    )
}
