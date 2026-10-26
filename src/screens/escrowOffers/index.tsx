import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DEFAULT_PAGE_SIZE, fetchEscrowOffers } from "../../api/client"
import type { EscrowOffer } from "../../api/types"
import OfferFilters, { type OfferFiltersPayload } from "../../components/escrowOffers/offerFilters"
import OfferStats from "../../components/escrowOffers/offerStats"
import OfferList from "../../components/escrowOffers/offerList"
import TablePaginator from "../../components/ui/paginator"
import LoadingDots from "../../components/ui/loading-dots"
import { escrowOfferPath } from "../../routing/routes"

export default function EscrowOffers() {
    const navigate = useNavigate()
    const [offers, setOffers] = useState<EscrowOffer[]>([])
    const [hasNextPage, setHasNextPage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>()
    const [filters, setFilters] = useState<OfferFiltersPayload>({ page: 1, expirableOnly: false })

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError(undefined)
        fetchEscrowOffers({
            page: filters.page,
            pageSize: DEFAULT_PAGE_SIZE,
            // `expirable` is computed by the API, so "expirable only" implies ACCEPTED server-side.
            where: {
                status: filters.expirableOnly ? "ACCEPTED" : filters.status,
                side: filters.side,
            },
        })
            .then((rows) => {
                if (cancelled) return
                setOffers(filters.expirableOnly ? rows.filter((o) => o.expirable) : rows)
                setHasNextPage(rows.length === DEFAULT_PAGE_SIZE)
            })
            .catch((e: unknown) => {
                if (cancelled) return
                setOffers([])
                setHasNextPage(false)
                setError(e instanceof Error ? e.message : String(e))
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [filters])

    function handleChange<K extends keyof OfferFiltersPayload>(name: K, val: OfferFiltersPayload[K]) {
        setFilters((prev) => ({ ...prev, [name]: val, ...(name !== "page" ? { page: 1 } : {}) }))
    }

    const totalPages = hasNextPage ? filters.page + 1 : filters.page

    return (
        <Box px={{ base: 4, md: 8 }} py={6} maxW="1200px" w="full" mx="auto">
            <Flex direction="column" gap={1} mb={5}>
                <Heading size="2xl">Escrow offers</Heading>
                <Text opacity={0.75} maxW="720px">
                    Buy and sell offers on the DirectoryEscrow contract (Sepolia). Accepted offers that pass their
                    settlement deadline become <strong>expirable</strong> — anyone (or Chainlink Automation) can expire
                    them and refund the buyer.
                </Text>
            </Flex>

            <Box mb={6}>
                <OfferStats />
            </Box>

            <Box mb={4}>
                <OfferFilters filters={filters} onChange={handleChange} />
            </Box>

            {error && (
                <Box bg="red.50" color="red.700" borderRadius="md" px={4} py={3} mb={4} fontSize="sm">
                    {error}
                </Box>
            )}

            {loading ? (
                <Flex py={10} justify="center">
                    <LoadingDots />
                </Flex>
            ) : (
                !error && (
                    <OfferList offers={offers} onSelect={(o) => navigate(escrowOfferPath(o.id))} />
                )
            )}

            <TablePaginator
                name="escrow-offers"
                currentPage={filters.page}
                totalPages={totalPages}
                onPrevPage={() => handleChange("page", Math.max(1, filters.page - 1))}
                onNextPage={() => handleChange("page", filters.page + 1)}
            />
        </Box>
    )
}
