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

export type Contract = {
    hashId: string
    name?: string
    desc?: string
    company?: string
    avatar?: string
    type: typeof CONTRACT_TYPE
}

export interface ContractData extends Contract {}

export type ContractMethod = {
    name: string
    desc?: string
    code: string
}
