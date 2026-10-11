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
        "Smart contracts deployed on EVM chains are publicly readable. Read what they're all about and the methods that are available for interaction.",
    GAMING: "Games with a varying degree of association with the chain. Some use EVM chains only for storing valuables like tokens and NFTs on-chain, while some keep all app and character information on-chain.",
    DEV_TOOLS: "Developers have created tools to aid others in their goals of building on Ethereum and other EVM chains.",
    INFORMATIONAL:
        "If you understand Ethereum and the EVM, there's tools to explore on-chain data. If you don't understand it yet, here's educational material to help you get there.",
    WALLETS:
        "If you're looking to transfer assets to someone, here is a list of wallets that have been personally approved by our team. All wallets have been posted here with direct permission from their owners and have been rigourlously vetted to ensure their validity.",
    DAPPS: "Decentralized finance (DeFi), Decentralized Exchanges (DEX), Gambling, or anything else of the sort that is directly interacting with Ethereum or other EVM chains.",
}

export default function SummaryBox({ category }: Props) {
    return (
        <Flex flexDir="column" rowGap="0.5rem">
            <Text textStyle="ManropeSemibold3x">{category}</Text>
            <Text textStyle="ManroperegularLarge">{CONTENT_MAP[category]}</Text>
        </Flex>
    )
}
