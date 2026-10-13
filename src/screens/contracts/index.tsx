import { Box, Flex, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { type Contract } from "../../components/contracts/contractInfo/types"
import ContractInfoContainer from "../../components/contracts/contractInfo"
import ContractFilters, { type ContractFiltersPayload } from "../../components/contracts/contractFilters"
import ContractList from "../../components/contracts/contractList"
import { DEFAULT_PAGE_SIZE, fetchEscrows } from "../../api/client"
import { escrowToContract } from "../../api/mapEscrow"

export default function Contracts() {
    const [focusedContract, setFocusedContract] = useState<Contract>()
    const [data, setData] = useState<Contract[]>([])
    const [totalPages, setTotalPages] = useState<number>(1)
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState<ContractFiltersPayload>({
        page: 1,
        sort: "created_at_desc",
        type: undefined,
        isKnown: true,
        search: "",
    })

    useEffect(() => {
        let cancelled = false
        async function load() {
            setLoading(true)
            setError(undefined)
            try {
                const escrows = await fetchEscrows({ page: filters.page, pageSize: DEFAULT_PAGE_SIZE })
                let contracts = escrows.map(escrowToContract)
                const q = filters.search.trim().toLowerCase()
                if (q) {
                    contracts = contracts.filter(
                        (c) =>
                            c.hashId.toLowerCase().includes(q) ||
                            c.name?.toLowerCase().includes(q) ||
                            c.company?.toLowerCase().includes(q) ||
                            c.desc?.toLowerCase().includes(q)
                    )
                }
                // Escrow API is DeFi-only today; other type filters yield an empty list.
                if (filters.type && filters.type !== "DEFI") {
                    contracts = []
                }
                if (cancelled) return
                setData(contracts)
                // API has no total count yet; keep paging while a full page returns.
                setTotalPages(escrows.length < DEFAULT_PAGE_SIZE ? filters.page : filters.page + 1)
            } catch (e) {
                if (cancelled) return
                setData([])
                setTotalPages(1)
                setError(e instanceof Error ? e.message : String(e))
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [filters])

    function handleChangeFilters(name: keyof ContractFiltersPayload, val: any) {
        setFilters((prev) => ({
            ...prev,
            [name]: val,
            ...(name !== "page" ? { page: 1 } : {}),
        }))
    }

    return (
        <Box h="100vh" display="flex" flexDir="column">
            <ContractFilters filters={filters} handleChangeFilters={handleChangeFilters} />
            {error && (
                <Text color="red.400" px={4} py={2} fontSize="sm">
                    {error}
                </Text>
            )}
            {loading && !error && (
                <Text px={4} py={2} fontSize="sm" opacity={0.7}>
                    Loading escrows…
                </Text>
            )}

            <Flex justify="space-between">
                <ContractList
                    contracts={data}
                    setFocusedContract={setFocusedContract}
                    filters={filters}
                    handleChangeFilters={handleChangeFilters}
                    totalPages={totalPages}
                />
                {focusedContract && <ContractInfoContainer contract={focusedContract} />}
            </Flex>
        </Box>
    )
}
