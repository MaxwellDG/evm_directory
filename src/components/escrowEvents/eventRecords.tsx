import { Box, Flex, Link, Text } from "@chakra-ui/react"
import { motion } from "framer-motion"
import type { EventRecord } from "./useEscrowEvents"
import type { EventTypeMeta } from "./eventTypes"
import { ETHERSCAN, formatEth, relativeTime, shortAddress } from "../../utils/format"

const MotionFlex = motion.create(Flex)

export default function EventRecords({ meta, records }: { meta: EventTypeMeta; records: EventRecord[] }) {
    if (records.length === 0) {
        return (
            <Text color="blue.200" fontStyle="italic" py={6}>
                No {meta.name} events indexed yet.
            </Text>
        )
    }
    return (
        <Flex direction="column">
            {records.slice(0, 50).map((r, i) => (
                <MotionFlex
                    key={r.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + Math.min(i, 12) * 0.04, duration: 0.4 }}
                    align="center"
                    gap={4}
                    py={3}
                    borderBottom="1px solid"
                    borderColor="blue.900"
                    fontSize="sm"
                    _hover={{ bg: "rgba(59,130,246,0.08)" }}
                    px={2}
                    borderRadius="md"
                >
                    <Box w="8px" h="8px" borderRadius="full" bg={meta.to} boxShadow={`0 0 12px ${meta.to}`} flexShrink={0} />
                    <Text fontWeight="semibold" color="blue.50" minW="80px">
                        Offer #{r.offer.offerId}
                    </Text>
                    <Text color="blue.200" fontSize="xs" minW="44px">
                        {r.offer.side}
                    </Text>
                    <Text fontFamily="mono" fontSize="xs" color="blue.100" flex="1" title={r.actor ?? undefined}>
                        {r.actor ? shortAddress(r.actor) : "—"}
                    </Text>
                    <Text color="blue.50" minW="90px" textAlign="end">
                        {formatEth(r.amount ?? r.offer.amount)}
                    </Text>
                    <Text color="blue.300" fontSize="xs" minW="80px" textAlign="end">
                        {relativeTime(r.blockTimestamp)}
                    </Text>
                    <Link
                        href={`${ETHERSCAN}/tx/${r.transactionHash}`}
                        target="_blank"
                        rel="noreferrer"
                        fontSize="xs"
                        color={meta.from}
                        aria-label="View transaction on Etherscan"
                    >
                        tx ↗
                    </Link>
                </MotionFlex>
            ))}
        </Flex>
    )
}
