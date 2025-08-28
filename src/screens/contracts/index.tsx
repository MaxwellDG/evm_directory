import { Box, Flex } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { type Contract } from "../../components/contracts/contractInfo/types"
import ContractInfoContainer from "../../components/contracts/contractInfo"
import ContractFilters, { type ContractFiltersPayload } from "../../components/contracts/contractFilters"
import ContractList from "../../components/contracts/contractList"

export default function Contracts() {
    const [focusedContract, setFocusedContract] = useState<Contract>()
    const [data, setData] = useState<Contract[]>([])
    const [totalPages, setTotalPages] = useState<number>(1)
    const [filters, setFilters] = useState<ContractFiltersPayload>({
        page: 1,
        sort: "created_at_desc",
        type: undefined,
        isKnown: true,
        search: "",
    })

    useEffect(() => {
        // todo retrieve paginated and filtered data from api
    }, [filters])

    function handleChangeFilters(name: keyof ContractFiltersPayload, val: any) {
        setFilters((prev) => ({
            ...prev,
            [name]: val,
        }))
    }

    return (
        <Box h="100vh" display="flex" flexDir="column">
            <ContractFilters filters={filters} handleChangeFilters={handleChangeFilters} />

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
