import { Box, Flex, Link, Text } from "@chakra-ui/react"
import type { EscrowOfferEvent, EscrowOfferEventType } from "../../api/types"
import { ETHERSCAN, formatEth, formatTimestamp, shortAddress } from "../../utils/format"

const EVENT_COLOR: Record<EscrowOfferEventType, string> = {
    CREATED: "blue.500",
    ACCEPTED: "purple.500",
    SALE_EXECUTED: "green.500",
    CANCELLED: "gray.500",
    REFUNDED: "orange.500",
    EXPIRED: "red.500",
}

const EVENT_LABEL: Record<EscrowOfferEventType, string> = {
    CREATED: "Offer created",
    ACCEPTED: "Offer accepted",
    SALE_EXECUTED: "Sale executed",
    CANCELLED: "Offer cancelled",
    REFUNDED: "Buyer refunded",
    EXPIRED: "Offer expired",
}

export default function OfferTimeline({ events }: { events: EscrowOfferEvent[] }) {
    if (events.length === 0) return <Text opacity={0.6}>No events indexed yet.</Text>
    const sorted = [...events].sort((a, b) => Number(a.blockNumber) - Number(b.blockNumber))

    return (
        <Flex direction="column" as="ol">
            {sorted.map((e, i) => (
                <Flex as="li" key={e.id} gap={3} listStyleType="none">
                    <Flex direction="column" align="center">
                        <Box w="12px" h="12px" mt="5px" borderRadius="full" bg={EVENT_COLOR[e.type]} />
                        {i < sorted.length - 1 && <Box flex="1" w="2px" bg="gray.200" />}
                    </Flex>
                    <Box pb={5}>
                        <Text fontWeight="semibold">{EVENT_LABEL[e.type] ?? e.type}</Text>
                        <Text fontSize="xs" opacity={0.7}>
                            {formatTimestamp(e.blockTimestamp)} · block {e.blockNumber}
                        </Text>
                        <Text fontSize="sm" mt={1}>
                            {e.actor && (
                                <>
                                    by <code title={e.actor}>{shortAddress(e.actor)}</code>
                                </>
                            )}
                            {e.amount && ` · ${formatEth(e.amount)}`}
                        </Text>
                        <Link
                            href={`${ETHERSCAN}/tx/${e.transactionHash}`}
                            target="_blank"
                            rel="noreferrer"
                            fontSize="xs"
                            color="blue.600"
                        >
                            {shortAddress(e.transactionHash)} ↗
                        </Link>
                    </Box>
                </Flex>
            ))}
        </Flex>
    )
}
