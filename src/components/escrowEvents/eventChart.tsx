import { Box, Flex, Text } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useId, useMemo } from "react"
import type { EventRecord } from "./useEscrowEvents"
import type { EventTypeMeta } from "./eventTypes"

const W = 720
const H = 220
const PAD = 8
const DAY = 86400

type Props = { meta: EventTypeMeta; records: EventRecord[]; days?: number; nowMs?: number }

/** Daily event counts over the last `days` days as a glowing area chart. */
export default function EventChart({ meta, records, days = 30, nowMs = Date.now() }: Props) {
    const gid = useId().replace(/:/g, "")
    const { points, max, buckets } = useMemo(() => {
        const end = Math.floor(nowMs / 1000 / DAY) * DAY + DAY
        const start = end - days * DAY
        const buckets = new Array(days).fill(0) as number[]
        for (const r of records) {
            const t = Number(r.blockTimestamp)
            if (t >= start && t < end) buckets[Math.floor((t - start) / DAY)]++
        }
        const max = Math.max(1, ...buckets)
        const points = buckets.map((c, i) => [
            PAD + (i / (days - 1)) * (W - PAD * 2),
            H - PAD - (c / max) * (H - PAD * 2),
        ])
        return { points, max, buckets }
    }, [records, days, nowMs])

    // Smooth the line with a simple cardinal-ish curve.
    const line = points.reduce((d, [x, y], i, arr) => {
        if (i === 0) return `M${x},${y}`
        const [px, py] = arr[i - 1]
        const cx = (px + x) / 2
        return `${d} C${cx},${py} ${cx},${y} ${x},${y}`
    }, "")
    const area = `${line} L${W - PAD},${H} L${PAD},${H} Z`

    return (
        <Box position="relative">
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible", display: "block" }}>
                <defs>
                    <linearGradient id={`${gid}-stroke`} x1="0" x2="1">
                        <stop offset="0%" stopColor={meta.from} />
                        <stop offset="100%" stopColor={meta.to} />
                    </linearGradient>
                    <linearGradient id={`${gid}-fill`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={meta.to} stopOpacity={0.45} />
                        <stop offset="100%" stopColor={meta.to} stopOpacity={0} />
                    </linearGradient>
                    <filter id={`${gid}-glow`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="b" />
                        <feMerge>
                            <feMergeNode in="b" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {[0.25, 0.5, 0.75].map((f) => (
                    <line key={f} x1={0} x2={W} y1={H * f} y2={H * f} stroke="rgba(255,255,255,0.06)" />
                ))}
                <motion.path
                    key={`${meta.type}-area`}
                    d={area}
                    fill={`url(#${gid}-fill)`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.5 }}
                />
                <motion.path
                    key={`${meta.type}-line`}
                    d={line}
                    fill="none"
                    stroke={`url(#${gid}-stroke)`}
                    strokeWidth={3}
                    strokeLinecap="round"
                    filter={`url(#${gid}-glow)`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                />
                {points.map(([x, y], i) =>
                    buckets[i] > 0 ? (
                        <motion.circle
                            key={`${meta.type}-${i}`}
                            cx={x}
                            cy={y}
                            r={4}
                            fill="#0b0b14"
                            stroke={meta.from}
                            strokeWidth={2}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 + i * 0.02 }}
                        >
                            <title>{`${buckets[i]} event${buckets[i] === 1 ? "" : "s"}`}</title>
                        </motion.circle>
                    ) : null
                )}
            </svg>
            <Flex justify="space-between" mt={2} fontSize="xs" color="whiteAlpha.500" letterSpacing="wider">
                <Text>{days} DAYS AGO</Text>
                <Text>PEAK {max}/DAY</Text>
                <Text>TODAY</Text>
            </Flex>
        </Box>
    )
}
