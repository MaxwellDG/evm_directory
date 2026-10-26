import { Box, Flex, Text } from "@chakra-ui/react"
import { NavLink, Outlet } from "react-router-dom"
import { ROUTES } from "../../routing/routes"

const NAV_ITEMS = [
    { to: ROUTES.CONTRACTS, label: "Contracts" },
    { to: ROUTES.ESCROW_OFFERS, label: "Escrow offers" },
] as const

export default function Directory() {
    return (
        <Box minH="100vh" display="flex" flexDir="column" bgColor="#c6d0e8">
            <Flex as="nav" align="center" gap="1.5rem" px={6} py={3} borderBottom="1px solid" borderColor="blackAlpha.200">
                <NavLink to={ROUTES.ROOT}>
                    <Text fontWeight="bold" letterSpacing="wide">
                        EVM Directory
                    </Text>
                </NavLink>
                {NAV_ITEMS.map((item) => (
                    <NavLink key={item.to} to={item.to}>
                        {({ isActive }) => (
                            <Text
                                fontSize="sm"
                                fontWeight={isActive ? "semibold" : "normal"}
                                opacity={isActive ? 1 : 0.7}
                                borderBottom="2px solid"
                                borderColor={isActive ? "gray.800" : "transparent"}
                                pb="2px"
                                _hover={{ opacity: 1 }}
                            >
                                {item.label}
                            </Text>
                        )}
                    </NavLink>
                ))}
            </Flex>
            <Outlet />
        </Box>
    )
}
