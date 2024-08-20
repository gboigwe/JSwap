import { Tx, Chain, Account, types, Clarinet } from '@hirosystems/clarinet-sdk/vitest';
import { describe, it, expect, beforeAll } from 'vitest';

describe("JSwap Contract Tests", () => {
    let simnet: Chain;
    let deployer: Account;
    let user1: Account;

    beforeAll(() => {
        simnet = Clarinet.testnet();
        deployer = simnet.getAccounts().get("deployer")!;
        user1 = simnet.getAccounts().get("wallet_1")!;
    });

    it("Ensure that user can initiate a swap", () => {
        const block = simnet.mineBlock([
            Tx.contractCall('jswap', 'initiate-swap', [types.uint(100000000)], user1.address)
        ]);

        expect(block.receipts.length).toBe(1);
        expect(block.height).toBe(2);
        expect(block.receipts[0].result).toHaveProperty('success');
        expect(block.receipts[0].result).toHaveProperty('value', types.bool(true));
    });

    it("Ensure that user can't initiate a swap without sufficient balance", () => {
        const block = simnet.mineBlock([
            Tx.contractCall('jswap', 'initiate-swap', [types.uint(10000000000000)], user1.address)
        ]);

        expect(block.receipts.length).toBe(1);
        expect(block.height).toBe(2);
    });
});