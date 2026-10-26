import { Box, Flex, Text } from "@chakra-ui/react"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import type { EscrowOfferEventType } from "../../api/types"
import EventRecords from "../../components/escrowEvents/eventRecords"
import { EVENT_TYPES } from "../../components/escrowEvents/eventTypes"
import { dailySeries, SERIES_DAYS } from "../../components/escrowEvents/series"
import EscrowCanvas from "../../components/escrowEvents/three/EscrowCanvas"
import { useEscrowEvents } from "../../components/escrowEvents/useEscrowEvents"
import { ROUTES } from "../../routing/routes"
import { formatEth } from "../../utils/format"

const DISPLAY_FONT = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const EASE = [0.22, 1, 0.36, 1] as const

/** Mirrors EscrowScene's rail width so DOM panels line up with the 3D layout. */
function useContentLeftPct() {
    const [pct, setPct] = useState(30)
    useEffect(() => {
        const calc = () => {
            const halfH = Math.tan((21 * Math.PI) / 180) * 15
            const halfW = halfH * (window.innerWidth / window.innerHeight)
            const rail = Math.min(4.6, halfW * 0.55)
            setPct(((rail + 0.6) / (halfW * 2)) * 100)
        }
        calc()
        window.addEventListener("resize", calc)
        return () => window.removeEventListener("resize", calc)
    }, [])
    return pct
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <Box>
            <Text fontSize="10px" letterSpacing="0.25em" color="whiteAlpha.500">
                {label}
            </Text>
            <Text fontFamily={DISPLAY_FONT} fontSize="xl" fontWeight="semibold" color="white">
                {value}
            </Text>
        </Box>
    )
}

const visuallyHidden = {
    position: "absolute",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
} as const

export default function EscrowEvents() {
    const { data, error } = useEscrowEvents()
    const [selected, setSelected] = useState<EscrowOfferEventType>()
    const [hovered, setHovered] = useState<EscrowOfferEventType>()
    const leftPct = useContentLeftPct()

    const counts = useMemo(
        () => (data ? Object.fromEntries(EVENT_TYPES.map((m) => [m.type, data[m.type].length])) : {}),
        [data]
    )
    const series = useMemo(() => (data ? dailySeries(data) : {}), [data])
    const meta = EVENT_TYPES.find((m) => m.type === selected)
    const hoverMeta = EVENT_TYPES.find((m) => m.type === hovered)
    const records = useMemo(() => (selected && data ? data[selected] : []), [data, selected])
    const volume = records.reduce((acc, r) => acc + BigInt(r.amount ?? r.offer.amount ?? "0"), 0n)
    const actors = new Set(records.map((r) => r.actor).filter(Boolean)).size
    const peak = selected ? Math.max(0, ...(series[selected] ?? [0])) : 0

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(undefined)
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    const onHover = useCallback((t?: EscrowOfferEventType) => setHovered(t), [])

    return (
        <MotionConfig reducedMotion="user">
            <Box
                position="fixed"
                inset={0}
                zIndex={10}
                color="white"
                overflow="hidden"
                fontFamily="'Manrope', system-ui, sans-serif"
                bg="radial-gradient(ellipse at 30% 20%, #161433 0%, #07070d 55%, #040408 100%)"
            >
                <EscrowCanvas
                    selected={selected}
                    counts={counts}
                    series={series}
                    onSelect={setSelected}
                    onHover={onHover}
                />

                {/* Keyboard / screen-reader access to the 3D choices. */}
                <Box as="nav" aria-label="Escrow event types" style={visuallyHidden}>
                    {EVENT_TYPES.map((m) => (
                        <button key={m.type} type="button" aria-label={`Show ${m.name} events`} onClick={() => setSelected(m.type)}>
                            Show {m.name} events
                        </button>
                    ))}
                </Box>

                <Flex position="absolute" top={0} left={0} right={0} justify="space-between" px={{ base: 6, md: 10 }} pt={7} pointerEvents="none">
                    <RouterLink to={ROUTES.CONTRACTS} style={{ pointerEvents: "auto" }}>
                        <Text fontSize="xs" letterSpacing="0.3em" color="whiteAlpha.600" _hover={{ color: "white" }}>
                            ← EVM DIRECTORY
                        </Text>
                    </RouterLink>
                    <Text fontSize="xs" letterSpacing="0.3em" color="whiteAlpha.500">
                        DIRECTORYESCROW · SEPOLIA
                    </Text>
                </Flex>

                {error && (
                    <Text position="absolute" top={14} left={10} color="red.300" fontSize="sm">
                        {error}
                    </Text>
                )}

                <AnimatePresence>
                    {!selected && (
                        <motion.div
                            key="landing-caption"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            style={{ position: "absolute", left: 0, right: 0, bottom: 36, textAlign: "center", pointerEvents: "none" }}
                        >
                            <Text fontSize="xs" letterSpacing="0.35em" color="whiteAlpha.500">
                                {hoverMeta ? hoverMeta.name.toUpperCase() : "CHOOSE AN ESCROW EVENT"}
                            </Text>
                            <Text mt={2} color="whiteAlpha.700" minH="1.5em">
                                {hoverMeta?.blurb ?? ""}
                            </Text>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {selected && (
                        <motion.button
                            key="back"
                            type="button"
                            onClick={() => setSelected(undefined)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                position: "absolute",
                                top: 64,
                                left: 40,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "rgba(255,255,255,0.55)",
                                fontSize: 11,
                                letterSpacing: "0.3em",
                            }}
                        >
                            ← ALL EVENTS
                        </motion.button>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {meta && (
                        <motion.div
                            key={meta.type}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
                            style={{
                                position: "absolute",
                                left: `${leftPct}%`,
                                right: "4%",
                                top: "68%",
                                bottom: 0,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Flex gap={10} align="end" wrap="wrap" pb={3} borderBottom="1px solid" borderColor="whiteAlpha.100">
                                <Metric label="EVENTS" value={records.length.toLocaleString("en-US")} />
                                <Metric label="ETH MOVED" value={formatEth(volume.toString(), 3)} />
                                <Metric label="UNIQUE ACTORS" value={actors.toLocaleString("en-US")} />
                                <Text ml="auto" fontSize="10px" letterSpacing="0.25em" color="whiteAlpha.500" pb={1}>
                                    LAST {SERIES_DAYS} DAYS · PEAK {peak}/DAY · {meta.blurb.toUpperCase()}
                                </Text>
                            </Flex>
                            <Box overflowY="auto" flex="1" pr={2} pb={6}>
                                <EventRecords meta={meta} records={records} />
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>
        </MotionConfig>
    )
}
