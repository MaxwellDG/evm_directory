import { Box } from "@chakra-ui/react"
import { useEffect, useRef } from "react"
import type { EscrowOfferEventType } from "../../../api/types"
import { EVENT_TYPES } from "../eventTypes"
import { EscrowScene } from "./escrowScene"

type Props = {
    selected?: EscrowOfferEventType
    counts: Partial<Record<EscrowOfferEventType, number>>
    series: Partial<Record<EscrowOfferEventType, number[]>>
    onSelect: (type: EscrowOfferEventType) => void
    onHover: (type?: EscrowOfferEventType) => void
}

/** React host for the imperative three.js scene. */
export default function EscrowCanvas({ selected, counts, series, onSelect, onHover }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<EscrowScene | null>(null)
    const cbRef = useRef({ onSelect, onHover })
    cbRef.current = { onSelect, onHover }

    useEffect(() => {
        if (!ref.current) return
        const scene = new EscrowScene(ref.current, EVENT_TYPES, {
            onSelect: (t) => cbRef.current.onSelect(t),
            onHover: (t) => cbRef.current.onHover(t),
        })
        sceneRef.current = scene
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        const apply = () => scene.setReducedMotion(mq.matches)
        apply()
        mq.addEventListener("change", apply)
        return () => {
            mq.removeEventListener("change", apply)
            scene.dispose()
            sceneRef.current = null
        }
    }, [])

    useEffect(() => sceneRef.current?.setCounts(counts), [counts])
    useEffect(() => sceneRef.current?.setSeries(series), [series])
    useEffect(() => sceneRef.current?.setSelected(selected), [selected])

    return <Box ref={ref} position="absolute" inset={0} aria-hidden />
}
