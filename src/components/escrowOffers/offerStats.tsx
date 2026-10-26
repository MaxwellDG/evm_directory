import { Box, Flex, Grid, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { fetchEscrowOfferStats } from "../../api/client"
import type { EscrowOfferStats } from "../../api/types"
import { formatEth, formatTimestamp, formatUsd } from "../../utils/format"

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <Box bg="white" borderRadius="xl" boxShadow="sm" px={4} py={3}>
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="wider" opacity={0.6}>
                {label}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" lineHeight="short">
                {value}
            </Text>
            {hint && (
                <Text fontSize="xs" opacity={0.6}>
                    {hint}
                </Text>
            )}
        </Box>
    )
}

const BREAKDOWN: { key: keyof EscrowOfferStats; label: string; color: string }[] = [
    { key: "completed", label: "Completed", color: "green.500" },
    { key: "refunded", label: "Refunded", color: "orange.400" },
    { key: "expired", label: "Expired", color: "red.500" },
    { key: "cancelled", label: "Cancelled", color: "gray.400" },
    { key: "accepted", label: "Accepted", color: "purple.400" },
    { key: "open", label: "Open", color: "blue.400" },
]

/** Lifecycle breakdown as a single stacked bar with a legend. */
function Breakdown({ stats }: { stats: EscrowOfferStats }) {
    const values = BREAKDOWN.map((b) => ({ ...b, n: Number(stats[b.key] ?? 0) }))
    const total = values.reduce((acc, v) => acc + v.n, 0)
    return (
        <Box bg="white" borderRadius="xl" boxShadow="sm" px={4} py={3} gridColumn={{ md: "span 4" }}>
            <Flex h="10px" borderRadius="full" overflow="hidden" bg="gray.100" mb={2}>
                {total > 0 &&
                    values.map((v) =>
                        v.n > 0 ? <Box key={v.key} bg={v.color} w={`${(v.n / total) * 100}%`} title={`${v.label}: ${v.n}`} /> : null
                    )}
            </Flex>
            <Flex gap={4} wrap="wrap" fontSize="xs">
                {values.map((v) => (
                    <Flex key={v.key} align="center" gap={1.5}>
                        <Box w="8px" h="8px" borderRadius="full" bg={v.color} />
                        <Text>
                            {v.label} <strong>{v.n}</strong>
                        </Text>
                    </Flex>
                ))}
            </Flex>
        </Box>
    )
}

export default function OfferStats() {
    const [stats, setStats] = useState<EscrowOfferStats>()
    const [error, setError] = useState<string>()

    useEffect(() => {
        let cancelled = false
        fetchEscrowOfferStats()
            .then((s) => !cancelled && setStats(s))
            .catch((e: unknown) => !cancelled && setError(e instanceof Error ? e.message : String(e)))
        return () => {
            cancelled = true
        }
    }, [])

    if (error) {
        return (
            <Text fontSize="sm" color="red.700">
                Stats unavailable: {error}
            </Text>
        )
    }
    if (!stats) return <Box h="96px" />

    const rate = stats.successRate
    const closed = Number(stats.succeeded) + Number(stats.failed)

    return (
        <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={3}>
            <Stat
                label="Success rate"
                value={rate == null ? "—" : `${(rate * 100).toFixed(1)}%`}
                hint={`${stats.succeeded} of ${closed} settled`}
            />
            <Stat label="Volume" value={formatEth(stats.volume, 3)} hint="completed sales" />
            <Stat label="Volume (USD)" value={formatUsd(stats.volumeUsd)} hint="at offer creation" />
            <Stat
                label="Offers"
                value={Number(stats.created).toLocaleString("en-US")}
                hint={stats.updatedAt ? `updated ${formatTimestamp(stats.updatedAt)}` : undefined}
            />
            <Breakdown stats={stats} />
        </Grid>
    )
}
