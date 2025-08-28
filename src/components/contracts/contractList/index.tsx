import { Box, Flex, Image, List, Text } from "@chakra-ui/react"
import type { Contract } from "../contractInfo/types"
import type { ContractFiltersPayload } from "../contractFilters"
import TablePaginator from "../../ui/paginator"

type Props = {
    contracts: Contract[]
    setFocusedContract: (contract: Contract) => void
    filters: ContractFiltersPayload
    handleChangeFilters: (name: keyof ContractFiltersPayload, val: any) => void
    totalPages: number
}

export default function ContractList({
    contracts,
    setFocusedContract,
    totalPages,
    filters,
    handleChangeFilters,
}: Props) {

    function handlePageChange(num: 1 | -1) {
        handleChangeFilters("page", Math.min(Math.max(1, filters.page + num), totalPages))
    }

    return (
        <Flex flexDir="column">
            <List.Root rowGap={"0.5rem"}>
                {contracts.map((contract: Contract) => {
                    return (
                        <List.Item cursor="pointer" onClick={() => setFocusedContract(contract)}>
                            <Flex gap="0.25rem">
                                <Box w="100px" h="100px" borderRadius="full">
                                    {contract.avatar && <Image h="full" w="full" src={contract.avatar} />}
                                </Box>
                                <Flex flexDir="column" rowGap="0.25rem">
                                    <Text textStyle="ManropeRegularLarge">Name</Text>
                                    <Text textStyle="ManropeRegularBodySmall" color="grey.light.80">
                                        {contract.hashId}
                                    </Text>
                                </Flex>
                            </Flex>
                        </List.Item>
                    )
                })}
            </List.Root>
            <TablePaginator
                currentPage={filters.page}
                totalPages={totalPages}
                name={"contracts"}
                onNextPage={() => handlePageChange(1)}
                onPrevPage={() => handlePageChange(-1)}
            />
        </Flex>
    )
}
