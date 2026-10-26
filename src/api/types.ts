/** Shapes returned by MaxwellDG/evm_directory_api escrow queries. */

export type EscrowStatus =
    | "CREATED"
    | "FUNDED"
    | "CLAIMED"
    | "DISPUTED"
    | "RELEASED"
    | "REFUNDED"
    | "CANCELLED"

export type EscrowOutcome = "PENDING" | "SUCCEEDED" | "FAILED"

export type EscrowEvent = {
    id: string
    type: string
    actor?: string | null
    party?: string | null
    amount?: string | null
    blockNumber: string
    blockTimestamp: string
    transactionHash: string
}

export type Escrow = {
    id: string
    escrowId: string
    contract: string
    creator: string
    seller: string
    buyer: string
    broker: string
    token: string
    amount: string
    feeBps: number
    brokerBps: number
    challengeWindow: string
    detailsHash: string
    status: EscrowStatus
    outcome: EscrowOutcome
    sellerAgreed: boolean
    buyerFunded: boolean
    deposit?: string | null
    sellerAmount?: string | null
    brokerAmount?: string | null
    feeAmount?: string | null
    buyerRefundAmount?: string | null
    resolvedSellerBps?: number | null
    createdAt: string
    createdBlock: string
    createdTx: string
    updatedAt: string
    closedAt?: string | null
    events: EscrowEvent[]
}

export type EscrowStats = {
    created: string
    funded: string
    open: string
    succeeded: string
    failed: string
    released: string
    refunded: string
    cancelled: string
    disputed: string
    successRate?: number | null
    updatedAt?: string | null
}

export type EscrowFilter = {
    status?: EscrowStatus
    outcome?: EscrowOutcome
    seller?: string
    buyer?: string
}

/** DirectoryEscrow (our Sepolia escrow) offers — evm_directory_api escrowOffers queries. */

export type EscrowOfferSide = "SELL" | "BUY"

export type EscrowOfferStatus = "OPEN" | "ACCEPTED" | "CANCELLED" | "COMPLETED" | "REFUNDED" | "EXPIRED"

export type EscrowOfferEventType = "CREATED" | "ACCEPTED" | "CANCELLED" | "SALE_EXECUTED" | "REFUNDED" | "EXPIRED"

export type EscrowOfferEvent = {
    id: string
    type: EscrowOfferEventType
    actor?: string | null
    amount?: string | null
    blockNumber: string
    blockTimestamp: string
    transactionHash: string
}

export type EscrowOffer = {
    id: string
    offerId: string
    contract: string
    side: EscrowOfferSide
    creator: string
    seller?: string | null
    buyer?: string | null
    amount: string
    usdValue?: string | null
    status: EscrowOfferStatus
    outcome: EscrowOutcome
    expirable: boolean
    createdAt: string
    createdBlock: string
    createdTx: string
    acceptedAt?: string | null
    expiresAt?: string | null
    closedBy?: string | null
    closedAt?: string | null
    updatedAt: string
    events: EscrowOfferEvent[]
}

export type EscrowOfferFilter = {
    status?: EscrowOfferStatus
    outcome?: EscrowOutcome
    side?: EscrowOfferSide
    seller?: string
    buyer?: string
}
