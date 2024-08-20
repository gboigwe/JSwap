import { Tx, Chain, Account, types } from '@hirosystems/clarinet-sdk';
import { Clarinet } from '@hirosystems/clarinet-sdk/dist/clarinet';
import { describe, it, expect, beforeAll } from 'vitest';

describe("JSwap Contract Tests", () => {
    let simnet: Chain;
    let deployer: Account;
    let user1: Account;

    beforeAll(async () => {
        simnet = await Clarinet.use(Clarinet.Devnet);
        deployer = simnet.accounts.get("deployer")!;
        user1 = simnet.accounts.get("wallet_1")!;
    });

    it("Ensure that user can initiate a swap", async () => {
        const block = await simnet.mineBlock([
            Tx.contractCall('jswap', 'initiate-swap', [types.uint(100000000)], user1.address)
        ]);

        expect(block.receipts.length).toBe(1);
        expect(block.height).toBe(2);
        expect(block.receipts[0].result).toHaveProperty('success', true);
    });

    it("Ensure that user can't initiate a swap without sufficient balance", async () => {
        const block = await simnet.mineBlock([
            Tx.contractCall('jswap', 'initiate-swap', [types.uint(10000000000000)], user1.address)
        ]);

        expect(block.receipts.length).toBe(1);
        expect(block.height).toBe(2);
        expect(block.receipts[0].result).toHaveProperty('success', false);
        expect(block.receipts[0].result).toHaveProperty('error');
        // Assuming ERR_INSUFFICIENT_BALANCE is error code 1
        expect(block.receipts[0].result.value).toBe('(err u1)');
    });
});