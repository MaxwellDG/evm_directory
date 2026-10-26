/** Formatting helpers for on-chain values returned as decimal strings by the API. */

const WEI_PER_ETH = 10n ** 18n

/** Wei string -> human ETH string with up to `decimals` fraction digits. */
export function formatEth(wei?: string | null, decimals = 4): string {
    if (wei == null || wei === "") return "—"
    let v: bigint
    try {
        v = BigInt(wei)
    } catch {
        return wei
    }
    const neg = v < 0n
    if (neg) v = -v
    const whole = v / WEI_PER_ETH
    const frac = (v % WEI_PER_ETH).toString().padStart(18, "0").slice(0, decimals).replace(/0+$/, "")
    return `${neg ? "-" : ""}${whole.toLocaleString("en-US")}${frac ? `.${frac}` : ""} ETH`
}

/** USD value with 18 decimals (as emitted by DirectoryEscrow) -> "$1,234.56". */
export function formatUsd(value?: string | null, decimals = 18): string {
    if (value == null || value === "") return "—"
    let n: number
    try {
        n = Number(BigInt(value)) / 10 ** decimals
    } catch {
        return value
    }
    return n.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

export function shortAddress(addr?: string | null): string {
    if (!addr) return "—"
    return addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr
}

export function isZeroAddress(addr?: string | null): boolean {
    return !addr || /^0x0{40}$/i.test(addr)
}

/** Unix seconds string -> local date/time. */
export function formatTimestamp(ts?: string | null): string {
    if (!ts) return "—"
    const n = Number(ts)
    if (!Number.isFinite(n) || n === 0) return "—"
    return new Date(n * 1000).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    })
}

/** Relative description of a unix-seconds deadline vs now, e.g. "in 3d 4h" / "5h ago". */
export function relativeTime(ts?: string | null, nowMs: number = Date.now()): string {
    if (!ts) return "—"
    const diff = Number(ts) - Math.floor(nowMs / 1000)
    const abs = Math.abs(diff)
    const d = Math.floor(abs / 86400)
    const h = Math.floor((abs % 86400) / 3600)
    const m = Math.floor((abs % 3600) / 60)
    const parts = d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${Math.max(m, 1)}m`
    return diff >= 0 ? `in ${parts}` : `${parts} ago`
}

export const ETHERSCAN = "https://sepolia.etherscan.io"
