import { Box, Flex, Image, List, Text } from "@chakra-ui/react"
import type { Category } from "../ui/summaryBox"
import type { Contract } from "../contractInfo/types"
import { useEffect, useState } from "react"
import TablePaginator from "../ui/paginator"

type Props = {
    category: keyof typeof Category
}

export default function ContractList({ category }: Props) {
    const [data, setData] = useState<Contract[]>([])
    const [page, setPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)

    useEffect(() => {
        // todo retrieve paginated and filtered data from api
    }, [category])

    return (
        <Flex flexDir="column">
            <List.Root rowGap={"0.5rem"}>
                {data.map((contract: Contract) => {
                    return (
                        <List.Item>
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
                currentPage={page}
                totalPages={totalPages}
                name={"contracts"}
                onNextPage={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                onPrevPage={() => setPage((prev) => Math.max(prev - 1, 1))}
            />
        </Flex>
    )
}
