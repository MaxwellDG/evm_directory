import type { Escrow, EscrowFilter, EscrowStats } from "./types"

const DEFAULT_PAGE_SIZE = 20

type GraphQLErrorBody = {
    errors?: { message: string }[]
    data?: unknown
}

function apiUrl(): string {
    const url = import.meta.env.VITE_API_URL as string | undefined
    if (!url) {
        throw new Error(
            "VITE_API_URL is not set. Point it at the running evm_directory_api (e.g. http://localhost:4000/)."
        )
    }
    return url.replace(/\/?$/, "/")
}

async function graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const res = await fetch(apiUrl(), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query, variables }),
    })
    if (!res.ok) {
        throw new Error(`API HTTP ${res.status}: ${await res.text()}`)
    }
    const body = (await res.json()) as GraphQLErrorBody & { data?: T }
    if (body.errors?.length) {
        throw new Error(body.errors.map((e) => e.message).join("; "))
    }
    if (!body.data) {
        throw new Error("API returned no data")
    }
    return body.data
}

const ESCROW_FIELDS = `
  id
  escrowId
  contract
  creator
  seller
  buyer
  broker
  token
  amount
  feeBps
  brokerBps
  challengeWindow
  detailsHash
  status
  outcome
  sellerAgreed
  buyerFunded
  deposit
  sellerAmount
  brokerAmount
  feeAmount
  buyerRefundAmount
  resolvedSellerBps
  createdAt
  createdBlock
  createdTx
  updatedAt
  closedAt
  events {
    id
    type
    actor
    party
    amount
    blockNumber
    blockTimestamp
    transactionHash
  }
`

export async function fetchEscrows(opts: {
    page?: number
    pageSize?: number
    where?: EscrowFilter
}): Promise<Escrow[]> {
    const pageSize = opts.pageSize ?? DEFAULT_PAGE_SIZE
    const page = Math.max(1, opts.page ?? 1)
    const skip = (page - 1) * pageSize
    const data = await graphql<{ escrows: Escrow[] }>(
        `query Escrows($first: Int!, $skip: Int!, $where: EscrowFilter) {
          escrows(first: $first, skip: $skip, where: $where) { ${ESCROW_FIELDS} }
        }`,
        { first: pageSize, skip, where: opts.where ?? null }
    )
    return data.escrows
}

export async function fetchEscrow(id: string): Promise<Escrow | null> {
    const data = await graphql<{ escrow: Escrow | null }>(
        `query Escrow($id: ID!) {
          escrow(id: $id) { ${ESCROW_FIELDS} }
        }`,
        { id }
    )
    return data.escrow
}

export async function fetchEscrowStats(): Promise<EscrowStats> {
    const data = await graphql<{ escrowStats: EscrowStats }>(
        `query EscrowStats {
          escrowStats {
            created funded open succeeded failed released refunded cancelled disputed successRate updatedAt
          }
        }`
    )
    return data.escrowStats
}

export { DEFAULT_PAGE_SIZE }
