import { Box } from "@chakra-ui/react"
import Select from "../../components/ui/Select"
import { useState } from "react"
import { Category } from "../../components/ui/summaryBox"
import { useLocation } from "react-router-dom"

export default function Contracts() {
    const location = useLocation()
    const [category, setCategory] = useState<keyof typeof Category>(location.state?.category ?? "WALLETS")

    return (
        <Box h="100vh" display="flex" flexDir="column" bgColor="#c6d0e8">
            <Select<keyof typeof Category>
                options={Object.entries(Category).map(([key, value]) => ({
                    value: key as keyof typeof Category,
                    label: value,
                }))}
                selectedOption={category}
                onOptionChange={setCategory}
                width="150px"
            />
        </Box>
    )
}
