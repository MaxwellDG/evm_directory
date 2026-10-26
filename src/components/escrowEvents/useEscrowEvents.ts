import { useEffect, useState } from "react"
import { fetchEscrowOffersWithEvents } from "../../api/client"
import type { EscrowOffer, EscrowOfferEvent, EscrowOfferEventType } from "../../api/types"

export type EventRecord = EscrowOfferEvent & { offer: Omit<EscrowOffer, "events"> }

export type EventsByType = Record<EscrowOfferEventType, EventRecord[]>

const PAGE = 100
const MAX_PAGES = 10

const empty = (): EventsByType => ({
    CREATED: [],
    ACCEPTED: [],
    SALE_EXECUTED: [],
    CANCELLED: [],
    REFUNDED: [],
    EXPIRED: [],
})

/**
 * The API has no per-event-type query, so we page through `escrowOffers`
 * (each carries its event history) and group the events client-side.
 */
export function useEscrowEvents() {
    const [data, setData] = useState<EventsByType>()
    const [error, setError] = useState<string>()

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            const grouped = empty()
            for (let page = 1; page <= MAX_PAGES; page++) {
                const offers = await fetchEscrowOffersWithEvents({ page, pageSize: PAGE })
                for (const { events, ...offer } of offers) {
                    for (const e of events) grouped[e.type]?.push({ ...e, offer })
                }
                if (offers.length < PAGE) break
            }
            for (const list of Object.values(grouped)) {
                list.sort((a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp))
            }
            if (!cancelled) setData(grouped)
        })().catch((e: unknown) => !cancelled && setError(e instanceof Error ? e.message : String(e)))
        return () => {
            cancelled = true
        }
    }, [])

    return { data, error }
}
