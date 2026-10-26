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
    { type: "CREATED", name: "OfferCreated", blurb: "A buyer or seller opens an offer", from: "#7dd3fc", to: "#6366f1" },
    { type: "ACCEPTED", name: "OfferAccepted", blurb: "A counterparty locks in — the settlement clock starts", from: "#c4b5fd", to: "#d946ef" },
    { type: "SALE_EXECUTED", name: "SaleExecuted", blurb: "Funds released to the seller", from: "#6ee7b7", to: "#14b8a6" },
    { type: "CANCELLED", name: "OfferCancelled", blurb: "Withdrawn before anyone accepted", from: "#e2e8f0", to: "#64748b" },
    { type: "REFUNDED", name: "Refunded", blurb: "Escrowed ETH returned to the buyer", from: "#fde68a", to: "#f97316" },
    { type: "EXPIRED", name: "OfferExpired", blurb: "Settlement deadline passed — expired by anyone or Chainlink Automation", from: "#fda4af", to: "#e11d48" },
]

export const gradient = (m: EventTypeMeta, angle = 100) => `linear-gradient(${angle}deg, ${m.from}, ${m.to})`
