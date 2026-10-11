import { Flex, Input, Switch, Text } from "@chakra-ui/react"
import Select, { type Option } from "../../ui/select"
import type { ChangeEvent } from "react"
import { CONTRACT_TYPE } from "../contractInfo/types"

export type ContractTypeKey = keyof typeof CONTRACT_TYPE

export type ContractFiltersPayload = {
    page: number
    sort: string
    isKnown: boolean
    search: string
    type?: ContractTypeKey
}

type Props = {
    filters: ContractFiltersPayload
    handleChangeFilters: (name: keyof ContractFiltersPayload, val: any) => void
}

const CONTRACT_TYPE_OPTIONS: Option<ContractTypeKey>[] = (Object.keys(CONTRACT_TYPE) as ContractTypeKey[]).map((key) => ({
    value: key,
    label: key, // todo capitalize first letter
}))

const SORT_OPTIONS: Option<string>[] = [
    { value: "created_at_desc", label: "Newest" },
    { value: "created_at_asc", label: "Oldest" },
]

export default function ContractFilters({ filters, handleChangeFilters }: Props) {
    return (
        <Flex align={{ base: "column", md: "row" }}>
            <Select
                options={CONTRACT_TYPE_OPTIONS}
                selectedOption={filters.type}
                onOptionChange={(val) => handleChangeFilters("type", val)}
            />
            <Flex align="center">
                <Switch.Root
                    checked={filters.isKnown}
                    onCheckedChange={(e) => handleChangeFilters("isKnown", e.checked)}
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                </Switch.Root>
                <Text>Is Known</Text>
            </Flex>
            <Select
                options={SORT_OPTIONS}
                selectedOption={filters.sort}
                onOptionChange={(val) => handleChangeFilters("sort", val)}
            />
            <Input value={filters.search} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeFilters("search", e.target.value)} />
        </Flex>
    )
}
