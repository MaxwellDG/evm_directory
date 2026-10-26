export interface Owner extends Contract {
    twitter: string
    github: string
    website: string
    bio: string
    email: string
}

export const CONTRACT_TYPE = {
    LAW: "law",
    MEDICINE: "medicine",
    GAMING: "gaming",
    DEFI: "defi",
    GAMBLING: "gambling",
    CROWDFUNDING: "crowdfunding",
} as const

export type ContractTypeValue = (typeof CONTRACT_TYPE)[keyof typeof CONTRACT_TYPE]

export type EscrowOverview = {
    status: string
    outcome: string
    seller: string
    buyer: string
    broker: string
    token: string
    amount: string
    deposit?: string
    createdAt: string
    createdTx: string
    events: { type: string; blockTimestamp: string; transactionHash: string }[]
}

export type Contract = {
    hashId: string
    name?: string
    desc?: string
    company?: string
    avatar?: string
    type: ContractTypeValue
    /** Subgraph / API escrow entity id when this row came from an escrow deal */
    escrowId?: string
}

export interface ContractData extends Contract {
    overview?: EscrowOverview
}

export type ContractMethod = {
    name: string
    desc?: string
    code: string
}
