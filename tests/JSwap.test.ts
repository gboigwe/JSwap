import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure that user can initiate a swap",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('jswap', 'initiate-swap', [types.uint(100000000)], user1.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Ensure that user can't initiate a swap without sufficient balance",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('jswap', 'initiate-swap', [types.uint(10000000000000)], user1.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectErr().expectUint(1); // ERR_INSUFFICIENT_BALANCE
    },
});

Clarinet.test({
    name: "Ensure that user can complete a swap",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('jswap', 'initiate-swap', [types.uint(100000000)], user1.address),
            Tx.contractCall('jswap', 'complete-swap', [], user1.address)
        ]);

        assertEquals(block.receipts.length, 2);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectUint(1000000000000); // 100000000 * 10000 (exchange rate)
    },
});

Clarinet.test({
    name: "Ensure that user can cancel a swap",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('jswap', 'initiate-swap', [types.uint(100000000)], user1.address),
            Tx.contractCall('jswap', 'cancel-swap', [], user1.address)
        ]);

        assertEquals(block.receipts.length, 2);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectOk().expectBool(true);
    },
});

Clarinet.test({
    name: "Ensure that only contract owner can update minimum governance tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('jswap', 'update-min-governance-tokens', [types.uint(200)], deployer.address),
            Tx.contractCall('jswap', 'update-min-governance-tokens', [types.uint(300)], user1.address)
        ]);

        assertEquals(block.receipts.length, 2);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectOk().expectBool(true);
        block.receipts[1].result.expectErr().expectUint(3); // ERR_UNAUTHORIZED
    },
});

Clarinet.test({
    name: "Ensure that get-min-governance-tokens returns correct value",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall('jswap', 'get-min-governance-tokens', [], deployer.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.height, 2);
        block.receipts[0].result.expectOk().expectUint(100); // Initial value
    },
});








// import { describe, expect, it } from "vitest";

// const accounts = simnet.getAccounts();
// const address1 = accounts.get("wallet_1")!;

// /*
//   The test below is an example. To learn more, read the testing documentation here:
//   https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
// */

// describe("example tests", () => {
//   it("ensures simnet is well initalised", () => {
//     expect(simnet.blockHeight).toBeDefined();
//   });

//   // it("shows an example", () => {
//   //   const { result } = simnet.callReadOnlyFn("counter", "get-counter", [], address1);
//   //   expect(result).toBeUint(0);
//   // });
// });
