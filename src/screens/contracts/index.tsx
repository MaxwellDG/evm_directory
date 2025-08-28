import { Box, Flex } from "@chakra-ui/react"
import { useState } from "react"
import { Category } from "../../components/ui/summaryBox"
import { type Contract } from "../../components/contractInfo/types"
import ContractInfoContainer from "../../components/contractInfo"
import ContractList from "../../components/contractList"
import Select from "../../components/ui/select"

export default function Contracts() {
    const [category, setCategory] = useState<keyof typeof Category>("CONTRACTS")
    const [focusedContract, setFocusedContract] = useState<Contract>()

    return (
        <Box h="100vh" display="flex" flexDir="column">
            <Select<keyof typeof Category>
                options={Object.entries(Category).map(([key, value]) => ({
                    value: key as keyof typeof Category,
                    label: value,
                }))}
                selectedOption={category}
                onOptionChange={setCategory}
                width="150px"
            />

            <Flex>
                <ContractList />
                {focusedContract && <ContractInfoContainer contract={focusedContract} />}
            </Flex>
        </Box>
    )
}
