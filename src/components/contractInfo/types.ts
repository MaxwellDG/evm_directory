export interface Owner extends Contract {
    twitter: string
    github: string
    website: string
    bio: string
    email: string
}

export type Contract = {
    hashId: string
    name?: string
    desc?: string
    company?: string
    avatar?: string
}

export interface ContractData extends Contract {
    
}

export type ContractMethod = {
    name: string
    desc?: string
    code: string
}

