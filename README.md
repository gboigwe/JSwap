# JSwap

# BTC to STX Swap Smart Contract with Governance

## Overview

This Clarity smart contract facilitates the swapping of Bitcoin (BTC) to Stacks (STX) tokens with governance token requirements. It provides a mechanism for users to initiate and complete BTC to STX swaps, subject to governance token ownership.

## Features

- Initiate and complete BTC to STX swaps
- Governance token requirements for swap participation
- Configurable minimum governance token threshold
- Swap expiration mechanism
- Contract owner management

## Contract Functions

### `initiate-swap`

Allows users to initiate a BTC to STX swap.

**Parameters:**
- `btc-amount`: The amount of BTC to swap (in satoshis)

**Returns:**
- `(ok true)`: If the swap is successfully initiated
- `(err ...)`: Error response if the initiation fails

### `complete-swap`

Completes a previously initiated swap, transferring STX to the user.

**Returns:**
- `(ok uint)`: The amount of STX transferred
- `(err ...)`: Error response if the completion fails

### `cancel-swap`

Cancels a pending swap initiated by the caller.

**Returns:**
- `(ok true)`: If the swap is successfully cancelled
- `(err ...)`: Error response if the cancellation fails

### `update-min-governance-tokens`

Allows the contract owner to update the minimum required governance tokens.

**Parameters:**
- `new-min`: The new minimum number of governance tokens required

**Returns:**
- `(ok true)`: If the update is successful
- `(err ...)`: Error response if the update fails

### `get-min-governance-tokens`

Retrieves the current minimum required governance tokens.

**Returns:**
- `(ok uint)`: The current minimum governance token requirement

### `get-contract-owner`

Retrieves the address of the contract owner.

**Returns:**
- `(ok principal)`: The principal of the contract owner

## Error Codes

- `ERR_INSUFFICIENT_BALANCE`: Insufficient STX balance for the swap
- `ERR_TRANSFER_FAILED`: STX transfer failed
- `ERR_UNAUTHORIZED`: Unauthorized access
- `ERR_INVALID_SWAP_STATUS`: Invalid swap status
- `ERR_ORACLE_UPDATE_FAILED`: Failed to update oracle data
- `ERR_INVALID_INPUT`: Invalid input parameters

## Usage

1. Deploy the contract to the Stacks blockchain.
2. The deployer becomes the contract owner.
3. Users must hold the required amount of governance tokens to participate.
4. Users call `initiate-swap` to start the BTC to STX swap process.
5. After BTC transfer is confirmed off-chain, users call `complete-swap` to receive STX.
6. Users can cancel pending swaps using `cancel-swap`.
7. The contract owner can update the minimum governance token requirement.

## Important Notes

- This contract does not handle the actual transfer of BTC. It assumes that the BTC transfer is handled off-chain or through a separate mechanism.
- Swaps have an expiration time (approximately 24 hours).
- Users must hold a minimum number of governance tokens to participate in swaps.
- The exchange rate is hardcoded in the contract (1 BTC = 10000 STX in the current implementation).

## Security Considerations

- Only the contract owner can update the minimum governance token requirement.
- Users should ensure they complete the swap before it expires.
- This contract has not been audited and is for educational purposes only.