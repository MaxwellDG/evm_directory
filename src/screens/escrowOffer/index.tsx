import { Box, Flex, Grid, Heading, Link, Text } from "@chakra-ui/react"
import { useEffect, useState, type ReactNode } from "react"
import { Link as RouterLink, useParams } from "react-router-dom"
import { fetchEscrowOffer } from "../../api/client"
import type { EscrowOffer } from "../../api/types"
import { ExpirableBadge, SideBadge, StatusBadge } from "../../components/escrowOffers/badges"
import OfferDeadline from "../../components/escrowOffers/offerDeadline"
import OfferTimeline from "../../components/escrowOffers/offerTimeline"
import LoadingDots from "../../components/ui/loading-dots"
import { ROUTES } from "../../routing/routes"
import { ETHERSCAN, formatEth, formatTimestamp, formatUsd, isZeroAddress } from "../../utils/format"

function Card({ title, children }: { title: string; children: ReactNode }) {
    return (
        <Box bg="white" borderRadius="xl" boxShadow="sm" p={5}>
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="wider" opacity={0.6} mb={3}>
                {title}
            </Text>
            {children}
        </Box>
    )
}

function Field({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
    return (
        <Flex justify="space-between" gap={4} py={1.5} borderBottom="1px solid" borderColor="gray.100" fontSize="sm">
            <Text opacity={0.65}>{label}</Text>
            <Text fontFamily={mono ? "mono" : undefined} fontSize={mono ? "xs" : undefined} textAlign="end" wordBreak="break-all">
                {value}
            </Text>
        </Flex>
    )
}

function Address({ value }: { value?: string | null }) {
    if (isZeroAddress(value)) return <>—</>
    return (
        <Link href={`${ETHERSCAN}/address/${value}`} target="_blank" rel="noreferrer" color="blue.600">
            {value}
        </Link>
    )
}

export default function EscrowOfferDetail() {
    const { id = "" } = useParams()
    const [offer, setOffer] = useState<EscrowOffer | null>()
    const [error, setError] = useState<string>()

    useEffect(() => {
        let cancelled = false
        setOffer(undefined)
        setError(undefined)
        fetchEscrowOffer(id)
            .then((o) => !cancelled && setOffer(o))
            .catch((e: unknown) => !cancelled && setError(e instanceof Error ? e.message : String(e)))
        return () => {
            cancelled = true
        }
    }, [id])

    return (
        <Box px={{ base: 4, md: 8 }} py={6} maxW="1200px" w="full" mx="auto">
            <RouterLink to={ROUTES.ESCROW_OFFERS}>
                <Text fontSize="sm" opacity={0.7} _hover={{ opacity: 1 }} mb={3}>
                    ← All offers
                </Text>
            </RouterLink>

            {error && (
                <Box bg="red.50" color="red.700" borderRadius="md" px={4} py={3} fontSize="sm">
                    {error}
                </Box>
            )}
            {!error && offer === undefined && (
                <Flex py={10} justify="center">
                    <LoadingDots />
                </Flex>
            )}
            {!error && offer === null && <Text>Offer not found.</Text>}

            {offer && (
                <>
                    <Flex align="center" gap={3} wrap="wrap" mb={5}>
                        <Heading size="2xl">Offer #{offer.offerId}</Heading>
                        <SideBadge side={offer.side} />
                        <StatusBadge status={offer.status} />
                        {offer.expirable && <ExpirableBadge />}
                    </Flex>

                    <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={5}>
                        <Flex direction="column" gap={5}>
                            <Card title="Settlement deadline">
                                <OfferDeadline offer={offer} />
                            </Card>
                            <Card title="Details">
                                <Field label="Amount" value={formatEth(offer.amount)} />
                                <Field label="USD value at creation" value={formatUsd(offer.usdValue)} />
                                <Field label="Outcome" value={offer.outcome} />
                                <Field label="Creator" value={<Address value={offer.creator} />} mono />
                                <Field label="Seller" value={<Address value={offer.seller} />} mono />
                                <Field label="Buyer" value={<Address value={offer.buyer} />} mono />
                                <Field label="Closed by" value={<Address value={offer.closedBy} />} mono />
                                <Field label="Created" value={formatTimestamp(offer.createdAt)} />
                                <Field label="Closed" value={formatTimestamp(offer.closedAt)} />
                                <Field label="Contract" value={<Address value={offer.contract} />} mono />
                            </Card>
                        </Flex>
                        <Card title="Event history">
                            <OfferTimeline events={offer.events} />
                        </Card>
                    </Grid>
                </>
            )}
        </Box>
    )
}
