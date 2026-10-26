// Centralized route segments for easier lookup and debugging
export const ROUTE_SEGMENTS = {
    ROOT: "/",
    CONTRACTS: "contracts",
    DIRECTORY: "directory",
    GAMING: "gaming",
    INFORMATIONAL: "informational",
    WALLETS: "wallets",
    DAPPS: "dapps",
    DEV_TOOLS: "dev_tools",
    ESCROW_OFFERS: "escrow_offers",
} as const

const ROOT = ROUTE_SEGMENTS.ROOT
const DIRECTORY = `/${ROUTE_SEGMENTS.DIRECTORY}` as const
const CONTRACTS = `${DIRECTORY}/${ROUTE_SEGMENTS.CONTRACTS}` as const
const GAMING = `${DIRECTORY}/${ROUTE_SEGMENTS.GAMING}` as const
const INFORMATIONAL = `${DIRECTORY}/${ROUTE_SEGMENTS.INFORMATIONAL}` as const
const WALLETS = `${DIRECTORY}/${ROUTE_SEGMENTS.WALLETS}` as const
const DAPPS = `${DIRECTORY}/${ROUTE_SEGMENTS.DAPPS}` as const
const DEV_TOOLS = `${DIRECTORY}/${ROUTE_SEGMENTS.DEV_TOOLS}` as const
const ESCROW_OFFERS = `${DIRECTORY}/${ROUTE_SEGMENTS.ESCROW_OFFERS}` as const

export const ROUTES = {
    ROOT,
    DIRECTORY,
    CONTRACTS,
    GAMING,
    INFORMATIONAL,
    WALLETS,
    DAPPS,
    DEV_TOOLS,
    ESCROW_OFFERS,
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
