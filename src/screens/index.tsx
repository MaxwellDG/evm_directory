import { Box, Flex, useBreakpointValue } from "@chakra-ui/react"
import cardanoLogo from "../assets/svgs/cardano-logo.tsx"
import useWindowDimensions from "../hooks/useWindowDimensions.tsx"
import { useNavigate } from "react-router-dom"
import SummaryBox, { Category } from "../components/ui/summaryBox.tsx"
import { useEffect, useRef, useState, type RefObject } from "react"
import { ROUTES } from "../routing/routes.tsx"

declare global {
    interface Window {
        category: string
    }
}

export default function Root() {
    const navigate = useNavigate()
    const { height } = useWindowDimensions()
    const isMobile = useBreakpointValue({ base: true, lg: false }) ?? false

    const [category, setCategory] = useState<keyof typeof Category>("WALLETS")

    const circleRefs = useRef<RefObject<SVGRectElement | null>[]>([
        useRef<SVGRectElement | null>(null),
        useRef<SVGRectElement | null>(null),
        useRef<SVGRectElement | null>(null),
        useRef<SVGRectElement | null>(null),
        useRef<SVGRectElement | null>(null),
        useRef<SVGRectElement | null>(null),
    ])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        window.addEventListener("scroll", () => {
            const val = window.pageYOffset / (document.body.offsetHeight - window.innerHeight)
            const chunk = 1 / 12

            if ((val < chunk * 1 && category !== "WALLETS") || (val > chunk * 11 && category !== "WALLETS")) {
                setCategory("WALLETS")
            } else if (val > chunk * 1 && val < chunk * 3 && category !== "FINANCE") {
                setCategory("FINANCE")
            } else if (val > chunk * 3 && val < chunk * 5 && category !== "MEDICINE") {
                setCategory("MEDICINE")
            } else if (val > chunk * 5 && val < chunk * 7 && category !== "GAMING") {
                setCategory("GAMING")
            } else if (val > chunk * 7 && val < chunk * 9 && category !== "LAW") {
                setCategory("LAW")
            } else if (val > chunk * 9 && val < chunk * 11 && category !== "TRANSACTIONS") {
                setCategory("TRANSACTIONS")
            }

            // @ts-ignore
            document.body.style.setProperty("--scroll", val)
        })
    }, [])

    function handleClick(_category: keyof typeof Category, point: { x: number; y: number }) {
        if (point) {
            const rect = document.createElement("div")
            rect.style.position = "fixed"
            rect.style.left = `${point.x - 116}px`
            rect.style.top = `${point.y - 116}px`
            rect.style.width = "232px"
            rect.style.height = "232px"
            rect.style.borderRadius = "45%"
            rect.style.backgroundColor = "#c6d0e8"
            rect.style.zIndex = "9999"
            rect.style.transition = "all 1s ease-out"

            document.body.appendChild(rect)

            // Trigger the animation to full viewport size
            requestAnimationFrame(() => {
                rect.style.width = "200vw"
                rect.style.height = "200vh"
                rect.style.left = "-50%"
                rect.style.top = "-50%"
            })
        }

        setTimeout(() => {
            navigate(ROUTES.CONTRACTS, { state: { category: _category } })
        }, 1000)
    }

    return (
        <Flex w="100vw" h="2000vh" pos="relative">
            <Flex top="0" left="0" pos="fixed" w="full" h="100vh">
                <Box transform="translate(-50%, -50%)">
                    <Box className="cardano-logo">
                        {cardanoLogo(height * 2, isMobile, category, handleClick, circleRefs)}
                    </Box>
                </Box>
                {category && (
                    <Flex pos="absolute" top="50%" left={`${height}px`} transform={`translate(50%, -50%)`}>
                        <SummaryBox category={category} />
                    </Flex>
                )}
            </Flex>
        </Flex>
    )
}
