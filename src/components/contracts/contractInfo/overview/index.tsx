import { Box, Link, Text, VStack } from "@chakra-ui/react"
import type { ContractData } from "../types"

type Props = {
    data?: ContractData
}

export default function ContractInfoOverview({ data }: Props) {
    const o = data?.overview
    if (!o) {
        return (
            <Box>
                <Text opacity={0.7}>No overview yet. Select an escrow-backed contract.</Text>
            </Box>
        )
    }

    return (
        <VStack align="start" gap={1} fontSize="sm">
            <Text>
                <strong>Status:</strong> {o.status} ({o.outcome})
            </Text>
            <Text>
                <strong>Amount:</strong> {o.amount}
                {o.deposit ? ` · deposit ${o.deposit}` : ""}
            </Text>
            <Text>
                <strong>Seller:</strong> {o.seller}
            </Text>
            <Text>
                <strong>Buyer:</strong> {o.buyer}
            </Text>
            <Text>
                <strong>Token:</strong> {o.token}
            </Text>
            <Text>
                <strong>Created:</strong> {o.createdAt}
            </Text>
            <Link href={`https://sepolia.etherscan.io/tx/${o.createdTx}`} target="_blank" color="blue.400">
                Created tx
            </Link>
            {o.events.length > 0 && (
                <Box pt={2}>
                    <Text fontWeight="bold">Events</Text>
                    {o.events.map((e, i) => (
                        <Text key={`${e.transactionHash}-${i}`}>
                            {e.type} · {e.blockTimestamp}
                        </Text>
                    ))}
                </Box>
            )}
        </VStack>
    )
}
