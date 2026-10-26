import * as THREE from "three"
import type { EscrowOfferEventType } from "../../../api/types"
import type { EventTypeMeta } from "../eventTypes"

/**
 * Imperative three.js scene for the escrow event explorer.
 *
 * Landing: six glowing 3D objects (one per contract event) float in a grid with their names.
 * Focused: the selected object flies to the top-centre, the others fly into a rail on the left,
 * and a 3D bar chart of the selected event's daily activity rises in the centre.
 * All motion is frame-based damping toward targets, so interrupting a transition is smooth.
 */

const DISPLAY_FONT = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const FOV = 42
const CAM_Z = 15
const LABEL_W = 4
const LABEL_H = 1

type Callbacks = {
    onSelect: (type: EscrowOfferEventType) => void
    onHover: (type?: EscrowOfferEventType) => void
}

type Item = {
    meta: EventTypeMeta
    index: number
    group: THREE.Group
    halo: THREE.Sprite
    label: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    labelCanvas: HTMLCanvasElement
    labelFrac: number
    hit: THREE.Mesh
    count?: number
    // animated state
    pos: THREE.Vector3
    posT: THREE.Vector3
    scale: number
    scaleT: number
    labelOffset: THREE.Vector3
    labelOffsetT: THREE.Vector3
    labelScale: number
    labelScaleT: number
    hover: number
    opacity: number
    opacityT: number
}

type Bar = {
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>
    h: number
    hT: number
    startAt: number
    color: THREE.Color
    colorT: THREE.Color
}

const DAYS = 30


function haloTexture(): THREE.Texture {
    const c = document.createElement("canvas")
    c.width = c.height = 256
    const g = c.getContext("2d")!
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
    grad.addColorStop(0, "rgba(255,255,255,0.9)")
    grad.addColorStop(0.25, "rgba(255,255,255,0.35)")
    grad.addColorStop(1, "rgba(255,255,255,0)")
    g.fillStyle = grad
    g.fillRect(0, 0, 256, 256)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
}

/** Draws the centred label; returns the fraction of the canvas width the text occupies. */
function drawLabel(canvas: HTMLCanvasElement, meta: EventTypeMeta, count?: number): number {
    const g = canvas.getContext("2d")!
    const { width: w, height: h } = canvas
    g.clearRect(0, 0, w, h)
    g.font = `700 150px ${DISPLAY_FONT}`
    g.textBaseline = "middle"
    const nameW = g.measureText(meta.name).width
    const countStr = count === undefined ? "" : String(count)
    g.font = `600 64px ${DISPLAY_FONT}`
    const countW = countStr ? g.measureText(countStr).width + 30 : 0
    const total = nameW + countW
    const fit = Math.min(1, (w - 40) / total)
    g.save()
    g.translate(w / 2 - (total * fit) / 2, h / 2)
    g.scale(fit, fit)
    const grad = g.createLinearGradient(0, 0, nameW, 0)
    grad.addColorStop(0, meta.from)
    grad.addColorStop(1, meta.to)
    g.font = `700 150px ${DISPLAY_FONT}`
    g.shadowColor = meta.to
    g.shadowBlur = 30
    g.fillStyle = grad
    g.fillText(meta.name, 0, 8)
    if (countStr) {
        g.shadowBlur = 0
        g.font = `600 64px ${DISPLAY_FONT}`
        g.fillStyle = "rgba(191,219,254,0.6)"
        g.fillText(countStr, nameW + 30, -34)
    }
    g.restore()
    return (total * fit) / w
}

const damp = (k: number, dt: number) => 1 - Math.exp(-k * dt)

export class EscrowScene {
    private renderer: THREE.WebGLRenderer
    private scene = new THREE.Scene()
    private camera: THREE.PerspectiveCamera
    private items: Item[] = []
    private bars: Bar[] = []
    private barGroup = new THREE.Group()
    private floor: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    private stars: THREE.Points
    private raycaster = new THREE.Raycaster()
    private pointer = new THREE.Vector2(-10, -10)
    private pointerSmooth = new THREE.Vector2()
    private clock = new THREE.Clock()
    private raf = 0
    private hovered?: EscrowOfferEventType
    private selected?: EscrowOfferEventType
    private series: Partial<Record<EscrowOfferEventType, number[]>> = {}
    private reducedMotion = false
    private halfW = 10
    private halfH = 6
    private ro: ResizeObserver
    private keyLight: THREE.PointLight
    private fillLight: THREE.PointLight

    private container: HTMLElement
    private metas: EventTypeMeta[]
    private cb: Callbacks

    constructor(container: HTMLElement, metas: EventTypeMeta[], cb: Callbacks) {
        this.container = container
        this.metas = metas
        this.cb = cb
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        container.appendChild(this.renderer.domElement)
        Object.assign(this.renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%" })

        this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200)
        this.camera.position.set(0, 0, CAM_Z)

        this.scene.add(new THREE.AmbientLight(0xbfdbfe, 0.35))
        const dir = new THREE.DirectionalLight(0xe0f2fe, 1.2)
        dir.position.set(4, 6, 10)
        this.scene.add(dir)
        this.keyLight = new THREE.PointLight(0x2563eb, 60, 40)
        this.keyLight.position.set(-6, 4, 6)
        this.fillLight = new THREE.PointLight(0x7dd3fc, 50, 40)
        this.fillLight.position.set(6, -4, 6)
        this.scene.add(this.keyLight, this.fillLight)

        this.stars = this.makeStars()
        this.scene.add(this.stars)

        const halo = haloTexture()
        metas.forEach((meta, index) => this.items.push(this.makeItem(meta, index, halo)))

        this.floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 0.02),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
        )
        this.barGroup.add(this.floor)
        const barGeo = new THREE.BoxGeometry(1, 1, 1)
        barGeo.translate(0, 0.5, 0) // grow from the base
        for (let i = 0; i < DAYS; i++) {
            const mat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 0.55,
                metalness: 0.3,
                roughness: 0.35,
                transparent: true,
                opacity: 0.92,
            })
            const mesh = new THREE.Mesh(barGeo, mat)
            mesh.visible = false
            this.barGroup.add(mesh)
            this.bars.push({ mesh, h: 0, hT: 0, startAt: 0, color: new THREE.Color(), colorT: new THREE.Color() })
        }
        this.scene.add(this.barGroup)

        // Redraw labels once the display font is available.
        document.fonts?.load(`700 150px 'Space Grotesk'`).then(() => this.redrawLabels()).catch(() => undefined)

        this.ro = new ResizeObserver(() => this.resize())
        this.ro.observe(container)
        this.resize()

        container.addEventListener("pointermove", this.onPointerMove)
        container.addEventListener("pointerleave", this.onPointerLeave)
        container.addEventListener("click", this.onClick)
        this.loop()
    }

    // ---------- public API ----------

    setReducedMotion(v: boolean) {
        this.reducedMotion = v
    }

    setCounts(counts: Partial<Record<EscrowOfferEventType, number>>) {
        for (const it of this.items) it.count = counts[it.meta.type]
        this.redrawLabels()
    }

    /** Daily buckets (oldest → newest) per event type. */
    setSeries(series: Partial<Record<EscrowOfferEventType, number[]>>) {
        this.series = series
        if (this.selected) this.layoutBars(0)
    }

    setSelected(type?: EscrowOfferEventType) {
        const was = this.selected
        this.selected = type
        this.layout()
        // Let the objects start flying before the bars rise; swaps re-rise quicker.
        this.layoutBars(was ? 0.15 : 0.45)
    }

    dispose() {
        cancelAnimationFrame(this.raf)
        this.ro.disconnect()
        this.container.removeEventListener("pointermove", this.onPointerMove)
        this.container.removeEventListener("pointerleave", this.onPointerLeave)
        this.container.removeEventListener("click", this.onClick)
        this.scene.traverse((o) => {
            const m = o as THREE.Mesh
            m.geometry?.dispose()
            const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []
            mats.forEach((mat) => {
                ;(mat as THREE.MeshBasicMaterial).map?.dispose()
                mat.dispose()
            })
        })
        this.renderer.dispose()
        this.renderer.domElement.remove()
    }

    // ---------- construction ----------

    private makeStars(): THREE.Points {
        const n = 1400
        const pos = new Float32Array(n * 3)
        const col = new Float32Array(n * 3)
        const palette = this.metas.map((m) => new THREE.Color(m.from))
        for (let i = 0; i < n; i++) {
            const r = 25 + Math.random() * 45
            const th = Math.random() * Math.PI * 2
            const ph = Math.acos(2 * Math.random() - 1)
            pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), -Math.abs(r * Math.cos(ph)) - 5], i * 3)
            const c = Math.random() < 0.7 ? new THREE.Color(0xdbeafe) : palette[i % palette.length]
            col.set([c.r, c.g, c.b], i * 3)
        }
        const geo = new THREE.BufferGeometry()
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
        geo.setAttribute("color", new THREE.BufferAttribute(col, 3))
        const mat = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.7, depthWrite: false })
        return new THREE.Points(geo, mat)
    }

    private makeItem(meta: EventTypeMeta, index: number, haloTex: THREE.Texture): Item {
        const group = new THREE.Group()

        const halo = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: haloTex,
                color: new THREE.Color(meta.to),
                transparent: true,
                opacity: 0.3,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            })
        )
        halo.scale.set(7, 2.4, 1)
        group.add(halo)

        const labelCanvas = document.createElement("canvas")
        labelCanvas.width = 1024
        labelCanvas.height = 256
        const labelFrac = drawLabel(labelCanvas, meta)
        const tex = new THREE.CanvasTexture(labelCanvas)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        const label = new THREE.Mesh(
            new THREE.PlaneGeometry(LABEL_W, LABEL_H),
            new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
        )
        group.add(label)

        // Generous invisible hit target so hovering feels forgiving.
        const hit = new THREE.Mesh(new THREE.PlaneGeometry(LABEL_W * 0.85, LABEL_H * 1.1), new THREE.MeshBasicMaterial({ visible: false }))
        group.add(hit)
        for (const o of [hit, label]) o.userData.type = meta.type

        this.scene.add(group)
        const start = new THREE.Vector3((index - 2.5) * 0.6, -9, -6)
        group.position.copy(start)
        return {
            meta,
            index,
            group,
            halo,
            label,
            labelCanvas,
            labelFrac,
            hit,
            pos: start.clone(),
            posT: start.clone(),
            scale: 0.2,
            scaleT: 1,
            labelOffset: new THREE.Vector3(0, 0, 0),
            labelOffsetT: new THREE.Vector3(0, -1.75, 0),
            labelScale: 1,
            labelScaleT: 1,
            hover: 0,
            opacity: 0,
            opacityT: 1,
        }
    }

    private redrawLabels() {
        for (const it of this.items) {
            it.labelFrac = drawLabel(it.labelCanvas, it.meta, it.count)
            it.label.material.map!.needsUpdate = true
        }
        this.layout()
    }

    // ---------- layout ----------

    private resize() {
        const w = this.container.clientWidth || 1
        const h = this.container.clientHeight || 1
        this.renderer.setSize(w, h, false)
        this.camera.aspect = w / h
        this.camera.updateProjectionMatrix()
        this.halfH = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAM_Z
        this.halfW = this.halfH * this.camera.aspect
        this.layout()
        this.layoutBars(0)
    }

    private railWidth() {
        return Math.min(4.6, this.halfW * 0.55)
    }

    private layout() {
        const { halfW, halfH } = this
        if (!this.selected) {
            // 3 × 2 constellation, slightly staggered in depth.
            const cols = this.camera.aspect < 0.9 ? 2 : 3
            const rows = Math.ceil(this.items.length / cols)
            const gapX = Math.min(5.4, (halfW * 2) / cols)
            const gapY = Math.min(3.2, (halfH * 2 - 2.5) / rows)
            const fit = Math.min(1, gapX / 5.2)
            this.items.forEach((it, i) => {
                const c = i % cols
                const r = Math.floor(i / cols)
                it.posT.set((c - (cols - 1) / 2) * gapX, ((rows - 1) / 2 - r) * gapY + 0.4, (c % 2 === 0 ? 0 : -0.8) + (r % 2) * 0.4)
                it.scaleT = fit
                it.labelOffsetT.set(0, 0, 0)
                it.labelScaleT = fit * 1.25
                it.opacityT = 1
            })
            return
        }

        const railX = -halfW + 0.8
        const rail = this.items.filter((it) => it.meta.type !== this.selected)
        const step = Math.min(1.45, (halfH * 2 - 3.2) / rail.length)
        const top = halfH - 2.4
        rail.forEach((it, i) => {
            it.posT.set(railX, top - i * step, 0)
            it.scaleT = 0.42
            // Label to the right of the object, left-aligned.
            it.labelScaleT = 0.8
            it.labelOffsetT.set((it.labelFrac * LABEL_W * 0.8) / 2, 0, 0)
            it.opacityT = 0.85
        })
        const sel = this.items.find((it) => it.meta.type === this.selected)!
        const contentLeft = -halfW + this.railWidth() + 0.6
        sel.posT.set(contentLeft, halfH - 2.0, 0.6)
        sel.scaleT = 0.6
        sel.labelScaleT = 1.3
        sel.labelOffsetT.set((sel.labelFrac * LABEL_W * 1.3) / 2, 0, 0)
        sel.opacityT = 1
    }

    private layoutBars(delay: number) {
        const { halfW, halfH } = this
        const left = -halfW + this.railWidth() + 0.6
        const right = halfW - 0.8
        const width = right - left
        const baseY = -halfH * 0.3
        const maxH = halfH - 3.2 - baseY
        this.barGroup.position.set(left, baseY, 0)
        this.floor.scale.set(width, 1, 1)
        this.floor.position.set(width / 2, -0.02, 0)

        const meta = this.metas.find((m) => m.type === this.selected)
        const data = (this.selected && this.series[this.selected]) || new Array(DAYS).fill(0)
        const max = Math.max(1, ...data)
        const slot = width / DAYS
        const now = this.clock.getElapsedTime()
        this.bars.forEach((b, i) => {
            b.mesh.position.set(slot * (i + 0.5), 0, 0)
            b.mesh.scale.x = slot * 0.62
            b.mesh.scale.z = slot * 0.62
            b.hT = meta ? Math.max(0.04, (data[i] / max) * maxH) : 0
            b.startAt = now + delay + i * 0.022
            if (meta) b.colorT.set(meta.from).lerp(new THREE.Color(meta.to), i / (DAYS - 1))
        })
        this.floor.material.opacity = meta ? 0.18 : 0
    }

    // ---------- interaction ----------

    private onPointerMove = (e: PointerEvent) => {
        const r = this.container.getBoundingClientRect()
        this.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    }

    private onPointerLeave = () => this.pointer.set(-10, -10)

    private onClick = () => {
        if (this.hovered && this.hovered !== this.selected) this.cb.onSelect(this.hovered)
    }

    private pick(): EscrowOfferEventType | undefined {
        if (this.pointer.x < -2) return undefined
        this.raycaster.setFromCamera(this.pointer, this.camera)
        const targets = this.items.flatMap((it) => [it.hit, it.label])
        const hit = this.raycaster.intersectObjects(targets, false)[0]
        return hit?.object.userData.type as EscrowOfferEventType | undefined
    }

    // ---------- frame loop ----------

    private loop = () => {
        this.raf = requestAnimationFrame(this.loop)
        const dt = Math.min(this.clock.getDelta(), 0.05)
        const t = this.clock.getElapsedTime()
        const rm = this.reducedMotion
        const k = (v: number) => (rm ? 1 : damp(v, dt))

        const hovered = this.pick()
        if (hovered !== this.hovered) {
            this.hovered = hovered
            this.container.style.cursor = hovered && hovered !== this.selected ? "pointer" : "default"
            this.cb.onHover(hovered)
        }

        for (const it of this.items) {
            const isSel = it.meta.type === this.selected
            const isHover = it.meta.type === this.hovered && !isSel
            it.hover += ((isHover ? 1 : 0) - it.hover) * k(10)
            // Stagger the flight a touch per item for a more organic swarm.
            it.pos.lerp(it.posT, k(4.2 - it.index * 0.25))
            it.scale += (it.scaleT - it.scale) * k(5)
            it.labelOffset.lerp(it.labelOffsetT, k(5))
            it.labelScale += (it.labelScaleT - it.labelScale) * k(5)
            const someoneHovered = !this.selected && this.hovered !== undefined
            const dim = someoneHovered && !isHover ? 0.45 : 1
            it.opacity += (it.opacityT * dim - it.opacity) * k(6)

            const bob = rm ? 0 : Math.sin(t * 1.1 + it.index * 1.3) * (this.selected && !isSel ? 0.05 : 0.18)
            it.group.position.set(it.pos.x, it.pos.y + bob, it.pos.z + it.hover * 0.8)
            it.group.scale.setScalar(it.scale * (1 + it.hover * 0.18))

            ;(it.halo.material as THREE.SpriteMaterial).opacity =
                (0.16 + it.hover * 0.45 + (isSel ? 0.2 : 0) + (rm ? 0 : Math.sin(t * 2 + it.index) * 0.04)) * it.opacity

            // Labels live in the group but keep their own world size/offset (independent of object scale).
            const gs = Math.max(it.group.scale.x, 0.001)
            it.label.position.copy(it.labelOffset).multiplyScalar(1 / gs)
            it.label.scale.setScalar((it.labelScale * (1 + it.hover * 0.12)) / gs)
            // Names carry the motion now: a gentle 3D sway that leans toward the cursor.
            const sway = rm ? 0 : Math.sin(t * 0.7 + it.index * 1.1) * (this.selected ? 0.05 : 0.16)
            it.label.rotation.y += (sway + (rm || this.selected ? 0 : this.pointerSmooth.x * 0.3) - it.label.rotation.y) * k(4)
            it.label.rotation.x += ((rm || this.selected ? 0 : -this.pointerSmooth.y * 0.2) - it.label.rotation.x) * k(4)
            it.hit.position.copy(it.label.position)
            it.hit.scale.copy(it.label.scale)
            // Halo glows behind the name; width follows the text.
            it.halo.position.set(it.label.position.x, it.label.position.y, -0.4 / gs)
            it.halo.scale.set(((it.labelFrac * LABEL_W + 1.5) * it.labelScale * (1 + it.hover * 0.3)) / gs, (2.2 * it.labelScale) / gs, 1)
            it.label.material.opacity = Math.min(1, it.opacity + it.hover * 0.3)
        }

        for (const b of this.bars) {
            const target = t >= b.startAt ? b.hT : 0
            b.h += (target - b.h) * k(target > b.h ? 5 : 9)
            b.mesh.visible = b.h > 0.005
            b.mesh.scale.y = b.h
            b.color.lerp(b.colorT, k(4))
            b.mesh.material.color.copy(b.color)
            b.mesh.material.emissive.copy(b.color)
            if (!rm) b.mesh.position.z = Math.sin(t * 1.5 + b.mesh.position.x) * 0.06
        }

        // Tint the lights toward the focused/hovered event.
        const tintMeta = this.metas.find((m) => m.type === (this.selected ?? this.hovered))
        if (tintMeta) {
            this.keyLight.color.lerp(new THREE.Color(tintMeta.from), k(2))
            this.fillLight.color.lerp(new THREE.Color(tintMeta.to), k(2))
        }

        // Gentle parallax camera and drifting starfield.
        const p = this.pointer.x < -2 ? new THREE.Vector2() : this.pointer
        this.pointerSmooth.lerp(p, k(2.5))
        if (!rm) {
            this.camera.position.x = this.pointerSmooth.x * 0.7
            this.camera.position.y = this.pointerSmooth.y * 0.45
            this.stars.rotation.y = t * 0.012
            this.stars.rotation.x = Math.sin(t * 0.05) * 0.05
        }
        this.camera.lookAt(0, 0, 0)
        this.renderer.render(this.scene, this.camera)
    }
}
