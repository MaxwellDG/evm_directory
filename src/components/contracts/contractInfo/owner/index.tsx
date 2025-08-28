import { Box, Flex, Image, Skeleton, SkeletonText } from "@chakra-ui/react"
import type { ContractData } from "../types"

type Props = {
    data: ContractData
    hashId: string
    name?: string
    desc?: string
}

export default function ContractOwner({ data, hashId, name, desc }: Partial<Props>) {
    return (
        <Flex gap="0.25rem">
            <Skeleton loading={!data}>
                <Box w="100px" h="100px" borderRadius="full">
                    <Image h="full" w="full" />
                    // todo if no image associated, make a circle with your logo inside of it. Or the cardano logo.
                    Something better than just a letter // an image of a greyed out user would be meh. Maybe a greyed
                    out husky?
                    {/* <Box h="full" w="full"></Box> */}
                </Box>
            </Skeleton>
            <Flex flexDir="column" rowGap="0.25rem">
                <SkeletonText loading={!data} textStyle="ManropeRegularLarge">
                    Name
                </SkeletonText>
                <SkeletonText loading={!data} textStyle="ManropeRegularBodySmall" color="grey.light.80">
                    {hashId}
                </SkeletonText>
            </Flex>
        </Flex>
    )
}
