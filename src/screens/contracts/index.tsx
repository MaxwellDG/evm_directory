import { Box, Flex } from "@chakra-ui/react"
import { useState } from "react"
import { Category } from "../../components/ui/summaryBox"
import { type Contract } from "../../components/contracts/contractInfo/types"
import ContractInfoContainer from "../../components/contracts/contractInfo"
import ContractList from "../../components/contractList"
import Select from "../../components/ui/select"
import ContractFilters, { ContractFiltersPayload } from "../../components/contracts/contractFilters"

export default function Contracts() {
    const [category, setCategory] = useState<keyof typeof Category>("CONTRACTS")
    const [focusedContract, setFocusedContract] = useState<Contract>()
    const [filters, setFilters] = useState<ContractFiltersPayload>({
        page: 1,
        sortByCreatedAt: true,
        type: undefined,
        isKnown: true,
        search: "",
    })

    function handleChangeFilters(name: keyof ContractFiltersPayload, val: any) {
        setFilters((prev) => ({
            ...prev,
            [name]: val,
        }))
    }

    return (
        <Box h="100vh" display="flex" flexDir="column">
            <ContractFilters filters={filters} handleChangeFilters={handleChangeFilters} />

            <Flex>
                <ContractList />
                {focusedContract && <ContractInfoContainer contract={focusedContract} />}
            </Flex>
        </Box>
    )
}
