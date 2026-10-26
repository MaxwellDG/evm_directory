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

export function shortAddress(addr?: string | null): string {
    if (!addr) return "—"
    return addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr
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
