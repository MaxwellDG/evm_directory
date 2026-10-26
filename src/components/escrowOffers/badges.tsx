import { Badge } from "@chakra-ui/react"
import type { EscrowOfferStatus, EscrowOfferSide } from "../../api/types"
import { STATUS_COLOR } from "./constants"

export function StatusBadge({ status }: { status: EscrowOfferStatus }) {
    return (
        <Badge colorPalette={STATUS_COLOR[status]} variant="solid" size="sm">
            {status}
        </Badge>
    )
}

export function SideBadge({ side }: { side: EscrowOfferSide }) {
    return (
        <Badge colorPalette={side === "SELL" ? "teal" : "cyan"} variant="outline" size="sm">
            {side}
        </Badge>
    )
}

export function ExpirableBadge() {
    return (
        <Badge colorPalette="red" variant="subtle" size="sm" title="Settlement period has passed — anyone can call expireOffer()">
            EXPIRABLE
        </Badge>
    )
}
