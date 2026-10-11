import type { RefObject } from "react"
import type { Category } from "../../components/ui/summaryBox"

// Ethereum / EVM brand colour, used with alpha suffixes for the decorative rings
const EVM_COLOR = "#627EEA"
const CENTER = 1250

// Decorative outer rings (hidden on mobile via `hideOuterRing`)
const OUTER_RING = Array.from({ length: 12 }, (_, i) => ({ angle: (i * Math.PI) / 6, distance: 1190, r: 54 }))
const MIDDLE_RING = Array.from({ length: 6 }, (_, i) => ({
    angle: (i * Math.PI) / 3 + Math.PI / 6,
    distance: 800,
    r: 84,
}))

// Clickable category nodes arranged around the Ethereum diamond.
// Order matches the `circleRefs` array in src/screens/index.tsx.
const CATEGORY_NODES: { category: keyof typeof Category; cx: number; cy: number; stroke?: string }[] = [
    { category: "CONTRACTS", cx: 1649, cy: 1240, stroke: "purple" },
    { category: "DEV_TOOLS", cx: 1446, cy: 901, stroke: "yellow" },
    { category: "WALLETS", cx: 1051, cy: 906, stroke: "green" },
    { category: "GAMING", cx: 850, cy: 1256 },
    { category: "DAPPS", cx: 1059, cy: 1591, stroke: "blue" },
    { category: "INFORMATIONAL", cx: 1450, cy: 1592, stroke: "pink" },
]
const NODE_RADIUS = 168

// Ethereum diamond polygons (256 x 417 source grid), scaled and centred in the 2500 x 2500 viewBox
const DIAMOND_SCALE = 1.05
const DIAMOND_TRANSFORM = `translate(${CENTER - 128 * DIAMOND_SCALE} ${CENTER - 208.5 * DIAMOND_SCALE}) scale(${DIAMOND_SCALE})`
const DIAMOND_POLYGONS: { points: string; fill: string }[] = [
    { points: "127.96,0 125.17,9.5 125.17,285.17 127.96,287.96 255.92,212.32", fill: "#343434" },
    { points: "127.96,0 0,212.32 127.96,287.96 127.96,154.16", fill: "#8C8C8C" },
    { points: "127.96,312.19 126.39,314.1 126.39,412.3 127.96,416.9 256,236.59", fill: "#3C3C3B" },
    { points: "127.96,416.9 127.96,312.19 0,236.59", fill: "#8C8C8C" },
    { points: "127.96,287.96 255.92,212.32 127.96,154.16", fill: "#141414" },
    { points: "0,212.32 127.96,287.96 127.96,154.16", fill: "#393939" },
]

function polar(angle: number, distance: number) {
    return { cx: CENTER + distance * Math.cos(angle), cy: CENTER + distance * Math.sin(angle) }
}

export default function EvmLogo(
    size: number,
    hideOuterRing: boolean,
    highlightedCategory: keyof typeof Category | null,
    handleClick: (route: keyof typeof Category, point: { x: number; y: number }) => void,
    circleRefs: RefObject<RefObject<SVGRectElement | null>[]>
) {
    return (
        <svg version="1.1" viewBox="0 0 2500 2500" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
            <g display={hideOuterRing ? "none" : "inline"}>
                {OUTER_RING.map(({ angle, distance, r }, i) => (
                    <circle key={`outer-${i}`} {...polar(angle, distance)} r={r} fill={`${EVM_COLOR}08`} />
                ))}
                {MIDDLE_RING.map(({ angle, distance, r }, i) => (
                    <circle key={`middle-${i}`} {...polar(angle, distance)} r={r} fill={`${EVM_COLOR}15`} />
                ))}
            </g>

            <g transform={DIAMOND_TRANSFORM}>
                {DIAMOND_POLYGONS.map(({ points, fill }, i) => (
                    <polygon key={`diamond-${i}`} points={points} fill={fill} />
                ))}
            </g>

            {CATEGORY_NODES.map(({ category, cx, cy, stroke }, i) => (
                <g key={category}>
                    <circle
                        cx={cx}
                        cy={cy}
                        r={NODE_RADIUS}
                        fill={`${EVM_COLOR}30`}
                        cursor="pointer"
                        stroke={stroke && (highlightedCategory === category ? "black" : stroke)}
                        strokeWidth={stroke ? 2 : undefined}
                        onClick={() => {
                            const { x, y } = circleRefs.current[i].current?.getBoundingClientRect() ?? { x: 0, y: 0 }
                            handleClick(category, { x, y })
                        }}
                    />
                    <rect
                        pointerEvents={"none"}
                        ref={circleRefs.current[i]}
                        x={cx - 50}
                        y={cy - 50}
                        width="100"
                        height="100"
                        fill="#c6d0e8"
                    />
                </g>
            ))}
        </svg>
    )
}
