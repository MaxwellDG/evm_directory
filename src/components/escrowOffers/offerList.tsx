import { Box, Flex, Table, Text } from "@chakra-ui/react"
import type { EscrowOffer } from "../../api/types"
import { formatEth, formatTimestamp, formatUsd, relativeTime, shortAddress } from "../../utils/format"
import { ExpirableBadge, SideBadge, StatusBadge } from "./badges"

type Props = {
    offers: EscrowOffer[]
    selectedId?: string
    onSelect: (offer: EscrowOffer) => void
}

export default function OfferList({ offers, selectedId, onSelect }: Props) {
    if (offers.length === 0) {
        return (
            <Flex py={10} justify="center">
                <Text opacity={0.7}>No offers match these filters.</Text>
            </Flex>
        )
    }

    return (
        <Box bg="white" borderRadius="xl" overflowX="auto" boxShadow="sm">
            <Table.Root size="sm" interactive>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Offer</Table.ColumnHeader>
                        <Table.ColumnHeader>Status</Table.ColumnHeader>
                        <Table.ColumnHeader>Creator</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">Amount</Table.ColumnHeader>
                        <Table.ColumnHeader>Created</Table.ColumnHeader>
                        <Table.ColumnHeader>Deadline</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {offers.map((o) => (
                        <Table.Row
                            key={o.id}
                            cursor="pointer"
                            onClick={() => onSelect(o)}
                            bg={o.id === selectedId ? "blue.50" : undefined}
                            data-testid={`offer-row-${o.offerId}`}
                        >
                            <Table.Cell>
                                <Flex align="center" gap={2}>
                                    <Text fontWeight="semibold">#{o.offerId}</Text>
                                    <SideBadge side={o.side} />
                                </Flex>
                            </Table.Cell>
                            <Table.Cell>
                                <Flex gap={1} wrap="wrap">
                                    <StatusBadge status={o.status} />
                                    {o.expirable && <ExpirableBadge />}
                                </Flex>
                            </Table.Cell>
                            <Table.Cell fontFamily="mono" fontSize="xs">
                                {shortAddress(o.creator)}
                            </Table.Cell>
                            <Table.Cell textAlign="end">
                                <Text>{formatEth(o.amount)}</Text>
                                <Text fontSize="xs" opacity={0.6}>
                                    {formatUsd(o.usdValue)}
                                </Text>
                            </Table.Cell>
                            <Table.Cell fontSize="xs">{formatTimestamp(o.createdAt)}</Table.Cell>
                            <Table.Cell fontSize="xs">
                                {o.status === "ACCEPTED" && o.expiresAt ? (
                                    <Text color={o.expirable ? "red.600" : undefined}>{relativeTime(o.expiresAt)}</Text>
                                ) : (
                                    <Text opacity={0.5}>—</Text>
                                )}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    )
}
