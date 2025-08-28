// Centralized route segments for easier lookup and debugging
export const ROUTE_SEGMENTS = {
    ROOT: "/",
    CONTRACTS: "contracts",
    DIRECTORY: "directory"
}

const ROOT = ROUTE_SEGMENTS.ROOT
const DIRECTORY = `/${ROUTE_SEGMENTS.DIRECTORY}`
const CONTRACTS = `${DIRECTORY}/${ROUTE_SEGMENTS.CONTRACTS}`

export const ROUTES = {
    ROOT,
    DIRECTORY,
    CONTRACTS,
}
