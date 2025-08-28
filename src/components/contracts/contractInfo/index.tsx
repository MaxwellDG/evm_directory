import { Center } from "@chakra-ui/react"
import Tabs from "../../ui/tabs"
import { useEffect, useMemo, useState } from "react"
import ContractInfoOverview from "./overview"
import ContractInfoMethods from "./methods"
import { type Contract, type ContractData } from "./types"
import ContractOwner from "./owner"

type Props = {
    contract: Contract
}

export default function ContractInfoContainer({ contract }: Props) {
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
            },
        ]
    }, [])

    return (
        <Center w="full" h="full">
            <ContractOwner {...contract} data={data} />
            <Tabs items={tabs} defaultValue="Overview" />
        </Center>
    )
}
