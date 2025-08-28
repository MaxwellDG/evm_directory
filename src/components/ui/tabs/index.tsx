import { Box, Flex, Tabs as ChakraTabs } from "@chakra-ui/react"

type Props = {
    items: {
        title: string
        content: React.ReactNode
    }[]
    defaultValue: string
}

export default function Tabs({ items, defaultValue }: Props) {
    return (
        <Flex minH="dvh">
            <ChakraTabs.Root defaultValue={defaultValue} width="full">
                <ChakraTabs.List>
                    {items.map((item, index) => (
                        <ChakraTabs.Trigger key={index} value={item.title}>
                            Tab {item.title}
                        </ChakraTabs.Trigger>
                    ))}
                </ChakraTabs.List>
                <Box pos="relative" minH="200px" width="full">
                    {items.map((item, index) => (
                        <ChakraTabs.Content
                            key={index}
                            value={item.title}
                            position="absolute"
                            inset="0"
                            _open={{
                                animationName: "fade-in, scale-in",
                                animationDuration: "300ms",
                            }}
                            _closed={{
                                animationName: "fade-out, scale-out",
                                animationDuration: "120ms",
                            }}
                        >
                            {item.content}
                        </ChakraTabs.Content>
                    ))}
                </Box>
            </ChakraTabs.Root>
        </Flex>
    )
}
