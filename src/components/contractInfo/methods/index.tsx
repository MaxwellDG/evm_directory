import { Box, Text } from "@chakra-ui/react";
import type { ContractData } from "../types";

type Props = {
    data?: ContractData
}

export default function ContractInfoMethods({}: Props) {
    return (
        <Box>
            <Text>ContractInfoOverview</Text>
        </Box>
    )
}