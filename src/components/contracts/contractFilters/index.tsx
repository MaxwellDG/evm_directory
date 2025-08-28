import { Flex } from "@chakra-ui/react"
import Select, { type Option } from "../../ui/select"
import { Category } from "../../ui/summaryBox"
import { CONTRACT_TYPE, type Contract } from "../contractInfo/types"

export type ContractFiltersPayload = {
    page: number
    sortByCreatedAt: boolean
    isKnown: boolean
    search: string
    type?: typeof CONTRACT_TYPE
}

type Props = {
    filters: ContractFiltersPayload
    handleChangeFilters: (name: keyof ContractFiltersPayload, val: any) => void
}

const CONTRACT_TYPE_OPTIONS: Option<typeof CONTRACT_TYPE>[] = Object.keys(CONTRACT_TYPE).map((key) => ({
    value: key,
    label: key, // todo capitalize first letter
}))

export default function ContractFilters({ filters, handleChangeFilters }: Props) {
    return (
        <Flex>
            <Select
                options={CONTRACT_TYPE_OPTIONS}
                selectedOption={filters.type}
                onOptionChange={(val) => handleChangeFilters("type", val)}
            />
        </Flex>
    )
}
