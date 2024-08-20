const { describe, expect, it, beforeEach } = require("vitest");

describe("JSwap Contract Tests", () => {
  const deployer = simnet.getAccounts().get("deployer")!;
  const user1 = simnet.getAccounts().get("wallet_1")!;
  const user2 = simnet.getAccounts().get("wallet_2")!;

  beforeEach(() => {
    // Reset the simnet before each test
    simnet.mineEmptyBlock();
  });

  it("ensures user can initiate a swap", () => {
    const { result } = simnet.callPublicFn("jswap", "initiate-swap", [100000000n], user1);
    expect(result).toBeOk().toBeTrue();
  });

  it("ensures user can't initiate a swap without sufficient balance", () => {
    const { result } = simnet.callPublicFn("jswap", "initiate-swap", [10000000000000n], user1);
    expect(result).toBeErr().toBeUint(1); // ERR_INSUFFICIENT_BALANCE
  });

  it("ensures user can complete a swap", () => {
    simnet.callPublicFn("jswap", "initiate-swap", [100000000n], user1);
    const { result } = simnet.callPublicFn("jswap", "complete-swap", [], user1);
    expect(result).toBeOk().toBeUint(1000000000000n); // 100000000 * 10000 (exchange rate)
  });

  it("ensures user can cancel a swap", () => {
    simnet.callPublicFn("jswap", "initiate-swap", [100000000n], user1);
    const { result } = simnet.callPublicFn("jswap", "cancel-swap", [], user1);
    expect(result).toBeOk().toBeTrue();
  });

  it("ensures only contract owner can update minimum governance tokens", () => {
    const { result: ownerResult } = simnet.callPublicFn("jswap", "update-min-governance-tokens", [200n], deployer);
    expect(ownerResult).toBeOk().toBeTrue();

    const { result: userResult } = simnet.callPublicFn("jswap", "update-min-governance-tokens", [300n], user1);
    expect(userResult).toBeErr().toBeUint(3); // ERR_UNAUTHORIZED
  });

  it("ensures get-min-governance-tokens returns correct value", () => {
    const { result } = simnet.callReadOnlyFn("jswap", "get-min-governance-tokens", [], deployer);
    expect(result).toBeOk().toBeUint(100n); // Initial value
  });
});
