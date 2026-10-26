import type { EscrowOfferEventType } from "../../api/types"
import type { EventsByType } from "./useEscrowEvents"

export const SERIES_DAYS = 30
const DAY = 86400

/** Daily event counts for the last `days` days (oldest → newest) per event type. */
export function dailySeries(data: EventsByType, nowMs = Date.now(), days = SERIES_DAYS) {
    const end = Math.floor(nowMs / 1000 / DAY) * DAY + DAY
    const start = end - days * DAY
    const out: Partial<Record<EscrowOfferEventType, number[]>> = {}
    for (const [type, records] of Object.entries(data) as [EscrowOfferEventType, EventsByType[EscrowOfferEventType]][]) {
        const buckets = new Array(days).fill(0) as number[]
        for (const r of records) {
            const t = Number(r.blockTimestamp)
            if (t >= start && t < end) buckets[Math.floor((t - start) / DAY)]++
        }
        out[type] = buckets
    }
    return out
}
