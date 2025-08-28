import { Box } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"


export default function Directory() {
    return (
        <Box h="100vh" display="flex" flexDir="column" bgColor="#c6d0e8">
            <Outlet />
        </Box>
    )
}
