export type Owner = Partial<{
    name: string
    avatar: string
    twitter: string
    github: string
    website: string
    bio: string
    email: string
}>

export type ContractData = {
    
}

export type ContractMethod = {
    name: string
    desc?: string
    code: string
}