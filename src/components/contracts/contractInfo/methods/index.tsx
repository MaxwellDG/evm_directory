import { Accordion, Flex, Text } from "@chakra-ui/react"
import type { ContractData, ContractMethod } from "../types"
import { useMemo } from "react"

type Props = {
    data?: ContractData
}

export default function ContractInfoMethods({ data }: Props) {
    const methods: ContractMethod[] = useMemo(() => {
        // todo extract all methods in the contract
        return [] as ContractMethod[]
    }, [data])

    return (
        <Flex flexDir="column" rowGap="0.5rem">
            {methods.map((method: ContractMethod) => {
                return (
                    <Accordion.Root>
                        <Accordion.ItemTrigger>
                            <Flex align="center" h="40px">
                                <Text textStyle="ManropeSemiboldBody">{method.name}</Text>
                                {method.desc && (
                                    <Text mt="0.25rem" textStyle="ManropeRegularBodySmall" color="grey.light.80">
                                        {method.desc}
                                    </Text>
                                )}
                            </Flex>
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                            // todo show the code in an actual code markdown style. Imagine if I have to write a mini
                            compiler for this???
                        </Accordion.ItemContent>
                    </Accordion.Root>
                )
            })}
        </Flex>
    )
}
