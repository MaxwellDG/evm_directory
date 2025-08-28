import { Center } from "@chakra-ui/react"
import Tabs from "../ui/tabs"
import { useEffect, useMemo, useState } from "react"
import ContractInfoOverview from "./overview"
import ContractInfoMethods from "./methods"
import { type ContractData } from "./types"
import ContractOwner from "./owner"

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
            },
        ]
    }, [])

    return (
        <Center w="full" h="full">
            <ContractOwner hashId={hashId} data={data} />
            <Tabs items={tabs} defaultValue="Overview" />
        </Center>
    )
}
