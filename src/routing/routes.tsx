// Centralized route segments for easier lookup and debugging
export const ROUTE_SEGMENTS = {
    ROOT: "/",
    CONTRACTS: "contracts",
    DIRECTORY: "directory",
    GAMING: "gaming",
    INFORMATIONAL: "informational",
    WALLETS: "wallets",
    DAPPS: "dapps",
    DEV_TOOLS: "dev_tools"
}

const ROOT = ROUTE_SEGMENTS.ROOT
const DIRECTORY = `/${ROUTE_SEGMENTS.DIRECTORY}`
const CONTRACTS = `${DIRECTORY}/${ROUTE_SEGMENTS.CONTRACTS}`
const GAMING = `${DIRECTORY}/${ROUTE_SEGMENTS.GAMING}`
const INFORMATIONAL = `${DIRECTORY}/${ROUTE_SEGMENTS.INFORMATIONAL}`
const WALLETS = `${DIRECTORY}/${ROUTE_SEGMENTS.WALLETS}`
const DAPPS = `${DIRECTORY}/${ROUTE_SEGMENTS.DAPPS}`
const DEV_TOOLS = `${DIRECTORY}/${ROUTE_SEGMENTS.DEV_TOOLS}`

export const ROUTES = {
    ROOT,
    DIRECTORY,
    CONTRACTS,
    GAMING,
    INFORMATIONAL,
    WALLETS,
    DAPPS,
    DEV_TOOLS
}
