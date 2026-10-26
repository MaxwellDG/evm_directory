import { Box, Progress, Text } from "@chakra-ui/react"
import type { EscrowOffer } from "../../api/types"
import { formatTimestamp, relativeTime } from "../../utils/format"

/** Settlement deadline card: only meaningful once an offer has been accepted. */
export default function OfferDeadline({ offer, nowMs = Date.now() }: { offer: EscrowOffer; nowMs?: number }) {
    if (!offer.acceptedAt || !offer.expiresAt) {
        return (
            <Text fontSize="sm" opacity={0.7}>
                {offer.status === "OPEN"
                    ? "The settlement clock starts when a counterparty accepts this offer."
                    : "No settlement deadline for this offer."}
            </Text>
        )
    }

    const start = Number(offer.acceptedAt)
    const end = Number(offer.expiresAt)
    const now = Math.floor(nowMs / 1000)
    const pct = end > start ? Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100)) : 100
    const settled = offer.status !== "ACCEPTED"

    let headline: string
    let color: string
    if (settled) {
        headline = offer.status === "EXPIRED" ? "Expired" : `Settled (${offer.status.toLowerCase()})`
        color = offer.status === "EXPIRED" ? "red" : "green"
    } else if (offer.expirable) {
        headline = `Deadline passed ${relativeTime(offer.expiresAt, nowMs)} — can be expired now`
        color = "red"
    } else {
        headline = `Expires ${relativeTime(offer.expiresAt, nowMs)}`
        color = pct > 75 ? "orange" : "blue"
    }

    return (
        <Box>
            <Text fontWeight="semibold" color={`${color}.700`}>
                {headline}
            </Text>
            {!settled && (
                <Progress.Root value={pct} colorPalette={color} size="sm" mt={2} borderRadius="full">
                    <Progress.Track>
                        <Progress.Range />
                    </Progress.Track>
                </Progress.Root>
            )}
            <Text fontSize="xs" opacity={0.7} mt={2}>
                Accepted {formatTimestamp(offer.acceptedAt)} · deadline {formatTimestamp(offer.expiresAt)}
            </Text>
        </Box>
    )
}
