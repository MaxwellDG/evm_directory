import { Box, Button, Flex, Text } from "@chakra-ui/react"

export type Props = {
    name: string
    currentPage: number
    totalPages: number
    onPrevPage: () => void
    onNextPage: () => void
}

const BUTTON_WIDTH = "80px"

export default function TablePaginator({ name, currentPage, totalPages, onPrevPage, onNextPage }: Props) {
    return (
        <Flex
            data-test-id={`table-paginator-${name}`}
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            py="1rem"
            pos="relative"
        >
            <Box w={BUTTON_WIDTH}>
                <Button
                    display={currentPage === 1 ? "none" : "block"}
                    onClick={onPrevPage}
                    disabled={currentPage === 1}
                    px={2}
                    py={1}
                    size={"sm"}
                    textStyle={"ManropeSemiboldBodySmall"}
                >
                    Prev
                </Button>
            </Box>
            <Text textStyle={"ManropeSemiboldBodySmall"}>{`Page ${currentPage} of ${totalPages}`}</Text>
            <Flex justify="end" w={BUTTON_WIDTH}>
                <Button
                    display={currentPage >= totalPages || totalPages === 1 ? "none" : "block"}
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                    px={2}
                    py={1}
                    size={"sm"}
                    textStyle={"ManropeSemiboldBodySmall"}
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
