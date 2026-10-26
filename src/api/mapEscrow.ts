import { CONTRACT_TYPE, type Contract, type ContractData } from "../components/contracts/contractInfo/types"
import type { Escrow } from "./types"

/** Map an escrow deal into the contracts UI model (Sepolia escrow = DeFi). */
export function escrowToContract(escrow: Escrow): Contract {
    return {
        hashId: escrow.contract,
        name: `Escrow #${escrow.escrowId}`,
        desc: `${escrow.status} · ${escrow.outcome} · amount ${escrow.amount}`,
        company: escrow.seller,
        type: CONTRACT_TYPE.DEFI,
        escrowId: escrow.id,
    }
}

export function escrowToContractData(escrow: Escrow): ContractData {
    return {
        ...escrowToContract(escrow),
        overview: {
            status: escrow.status,
            outcome: escrow.outcome,
            seller: escrow.seller,
            buyer: escrow.buyer,
            broker: escrow.broker,
            token: escrow.token,
            amount: escrow.amount,
            deposit: escrow.deposit ?? undefined,
            createdAt: escrow.createdAt,
            createdTx: escrow.createdTx,
            events: escrow.events.map((e) => ({
                type: e.type,
                blockTimestamp: e.blockTimestamp,
                transactionHash: e.transactionHash,
            })),
        },
    }
}
