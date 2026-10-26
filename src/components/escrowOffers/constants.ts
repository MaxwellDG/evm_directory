import type { EscrowOfferStatus } from "../../api/types"

export const OFFER_STATUSES: EscrowOfferStatus[] = ["OPEN", "ACCEPTED", "COMPLETED", "CANCELLED", "REFUNDED", "EXPIRED"]

export const STATUS_COLOR: Record<EscrowOfferStatus, string> = {
    OPEN: "blue",
    ACCEPTED: "purple",
    COMPLETED: "green",
    CANCELLED: "gray",
    REFUNDED: "orange",
    EXPIRED: "red",
}
