import { Flex, Text } from "@chakra-ui/react"

export const Category = {
    CONTRACTS: "contracts",
    GAMING: "gaming",
    DEV_TOOLS: "dev-tools",
    INFORMATIONAL: "informational",
    WALLETS: "wallets",
    DAPPS: "dapps",
} as const

type Props = {
    category: keyof typeof Category
}

const CONTENT_MAP: Record<keyof typeof Category, string> = {
    CONTRACTS:
        "All scripts (smart-contracts) are publicly available on Cardano. Read what they're all about and the methods that are available for interaction.",
    GAMING: "Games with a varying degree of association with the chain. Some use Cardano for only storing valuables on the ledger, while some include all app and character information",
    DEV_TOOLS: "Developers have created tools to aid others in their goals of building Cardano-related tech.",
    INFORMATIONAL:
        "If you understand Cardano, there's tools to explore its data. If you don't understand it yet, here's educational material to help you get there.",
    WALLETS:
        "If you're looking to transfer assets to someone, here is a list of wallets that have been personally approved by our team. All wallets have been posted here with direct permission from their owners and have been rigourlously vetted to ensure their validity.",
    DAPPS: "Decentralized finance (DeFi), Decentralized Exchanges (DEX), Gambling, or anything else of the sort that is directly interacting with the Cardano chain.",
}

export default function SummaryBox({ category }: Props) {
    return (
        <Flex flexDir="column" rowGap="0.5rem">
            <Text textStyle="ManropeSemibold3x">{category}</Text>
            <Text textStyle="ManroperegularLarge">{CONTENT_MAP[category]}</Text>
        </Flex>
    )
}
