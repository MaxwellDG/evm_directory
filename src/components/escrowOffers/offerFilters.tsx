import { Button, Flex, Switch, Text } from "@chakra-ui/react"
import Select, { type Option } from "../ui/select"
import type { EscrowOfferSide, EscrowOfferStatus } from "../../api/types"
import { OFFER_STATUSES, STATUS_COLOR } from "./constants"

export type OfferFiltersPayload = {
    page: number
    status?: EscrowOfferStatus
    side?: EscrowOfferSide
    expirableOnly: boolean
}

const SIDE_OPTIONS: Option<EscrowOfferSide | "ALL">[] = [
    { value: "ALL", label: "All sides" },
    { value: "SELL", label: "Sell offers" },
    { value: "BUY", label: "Buy offers" },
]

type Props = {
    filters: OfferFiltersPayload
    onChange: <K extends keyof OfferFiltersPayload>(name: K, val: OfferFiltersPayload[K]) => void
}

export default function OfferFilters({ filters, onChange }: Props) {
    return (
        <Flex direction={{ base: "column", md: "row" }} gap={3} align={{ base: "stretch", md: "center" }} wrap="wrap">
            <Flex gap={2} wrap="wrap" role="group" aria-label="Status filter">
                <Button
                    size="xs"
                    variant={filters.status === undefined ? "solid" : "outline"}
                    onClick={() => onChange("status", undefined)}
                >
                    ALL
                </Button>
                {OFFER_STATUSES.map((s) => (
                    <Button
                        key={s}
                        size="xs"
                        colorPalette={STATUS_COLOR[s]}
                        variant={filters.status === s ? "solid" : "outline"}
                        onClick={() => onChange("status", filters.status === s ? undefined : s)}
                    >
                        {s}
                    </Button>
                ))}
            </Flex>
            <Flex gap={3} align="center" ml={{ md: "auto" }}>
                <Flex minW="160px">
                    <Select
                        options={SIDE_OPTIONS}
                        size="sm"
                        width="100%"
                        selectedOption={filters.side ?? "ALL"}
                        onOptionChange={(val) => onChange("side", val === "ALL" ? undefined : val)}
                    />
                </Flex>
                <Switch.Root
                    size="sm"
                    checked={filters.expirableOnly}
                    onCheckedChange={(e) => onChange("expirableOnly", e.checked)}
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>
                        <Text fontSize="sm" whiteSpace="nowrap">
                            Expirable only
                        </Text>
                    </Switch.Label>
                </Switch.Root>
            </Flex>
        </Flex>
    )
}
