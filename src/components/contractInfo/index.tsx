import { Box, Center, Flex } from "@chakra-ui/react"
import Tabs from "../ui/tabs"
import { useEffect, useMemo, useState } from "react"
import ContractInfoOverview from "./overview"
import ContractInfoMethods from "./methods"
import { type ContractData, type Owner } from "./types"

type Props = {
    hashId: string
}

export default function ContractInfoContainer({ hashId }: Props) {

    const [data, setData] = useState<ContractData>()

    useEffect(() => {
        // todo retrieve data from api with hashId 
    }, [])

    const tabs = useMemo(() => {
        return [
            {
                title: "Overview",
                content: <ContractInfoOverview data={data} />,
            },
            {
                title: "Methods",
                content: <ContractInfoMethods data={data} />,
            }
        ]
    }, [])

    return (
        <Center w="full" h="full">
            <Flex w="full">
                <Flex flexDir="column" w="200px">
                    <Box h="100px" w="100px" borderRadius="full" bg="gray.200">

                    </Box>
                </Flex>
            </Flex>
            <Tabs items={tabs} defaultValue="Overview" />
        </Center>
    )
}
