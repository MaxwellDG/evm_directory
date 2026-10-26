import type { EscrowOfferEventType } from "../../api/types"

export type EventTypeMeta = {
    type: EscrowOfferEventType
    /** Solidity event name emitted by DirectoryEscrow. */
    name: string
    blurb: string
    /** Two-stop gradient, start → end. */
    from: string
    to: string
}

export const EVENT_TYPES: EventTypeMeta[] = [
    { type: "CREATED", name: "OfferCreated", blurb: "A buyer or seller opens an offer", from: "#93c5fd", to: "#1d4ed8" },
    { type: "ACCEPTED", name: "OfferAccepted", blurb: "A counterparty locks in — the settlement clock starts", from: "#7dd3fc", to: "#0284c7" },
    { type: "SALE_EXECUTED", name: "SaleExecuted", blurb: "Funds released to the seller", from: "#a5f3fc", to: "#0e7490" },
    { type: "CANCELLED", name: "OfferCancelled", blurb: "Withdrawn before anyone accepted", from: "#cbd5e1", to: "#475569" },
    { type: "REFUNDED", name: "Refunded", blurb: "Escrowed ETH returned to the buyer", from: "#e0f2fe", to: "#38bdf8" },
    { type: "EXPIRED", name: "OfferExpired", blurb: "Settlement deadline passed — expired by anyone or Chainlink Automation", from: "#60a5fa", to: "#1e3a8a" },
]

export const gradient = (m: EventTypeMeta, angle = 100) => `linear-gradient(${angle}deg, ${m.from}, ${m.to})`
