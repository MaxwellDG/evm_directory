import { Center, Text } from "@chakra-ui/react"
import Tabs from "../../ui/tabs"
import { useEffect, useMemo, useState } from "react"
import ContractInfoOverview from "./overview"
import ContractInfoMethods from "./methods"
import { type Contract, type ContractData } from "./types"
import ContractOwner from "./owner"
import { fetchEscrow } from "../../../api/client"
import { escrowToContractData } from "../../../api/mapEscrow"

type Props = {
    contract: Contract
}

export default function ContractInfoContainer({ contract }: Props) {
    const [data, setData] = useState<ContractData>()
    const [error, setError] = useState<string>()

    useEffect(() => {
        let cancelled = false
        async function load() {
            setError(undefined)
            setData(undefined)
            if (!contract.escrowId) {
                setData(contract)
                return
            }
            try {
                const escrow = await fetchEscrow(contract.escrowId)
                if (cancelled) return
                if (!escrow) {
                    setError("Escrow not found")
                    setData(contract)
                    return
                }
                setData(escrowToContractData(escrow))
            } catch (e) {
                if (cancelled) return
                setError(e instanceof Error ? e.message : String(e))
                setData(contract)
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [contract])

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
    }, [data])

    return (
        <Center w="full" h="full" flexDir="column" gap={2}>
            {error && (
                <Text color="red.400" fontSize="sm">
                    {error}
                </Text>
            )}
            <ContractOwner {...contract} data={data} />
            <Tabs items={tabs} defaultValue="Overview" />
        </Center>
    )
}
