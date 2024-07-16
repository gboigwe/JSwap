# JSwap

# BTC to STX Swap Smart Contract

## Overview

This Clarity smart contract facilitates the swapping of Bitcoin (BTC) to Stacks (STX) tokens. It provides a simple mechanism for users to exchange their BTC for STX at a predetermined exchange rate.

## Features

- Swap BTC to STX
- Configurable exchange rate
- Contract owner management

## Contract Functions

### `swap-btc-to-stx`

Allows users to swap BTC for STX.

**Parameters:**
- `btc-amount`: The amount of BTC to swap (in satoshis)

**Returns:**
- `(ok uint)`: The amount of STX received
- `(err uint)`: Error code if the swap fails

### `set-exchange-rate`

Allows the contract owner to set a new exchange rate.

**Parameters:**
- `new-rate`: The new exchange rate (STX per BTC)

**Returns:**
- `(ok true)`: If the rate is successfully updated
- `(err uint)`: Error code if the update fails

### `get-exchange-rate`

Retrieves the current exchange rate.

**Returns:**
- `(ok uint)`: The current exchange rate

### `get-contract-owner`

Retrieves the address of the contract owner.

**Returns:**
- `(ok principal)`: The principal of the contract owner

## Error Codes

- `ERR_INSUFFICIENT_BALANCE (u1)`: Insufficient STX balance for the swap
- `ERR_TRANSFER_FAILED (u2)`: STX transfer failed
- `(err u3)`: Unauthorized attempt to set exchange rate

## Usage

1. Deploy the contract to the Stacks blockchain.
2. The deployer becomes the contract owner.
3. Users can call `swap-btc-to-stx` to exchange their BTC for STX.
4. The contract owner can update the exchange rate using `set-exchange-rate`.

## Important Notes

- This contract does not handle the actual transfer of BTC. It assumes that the BTC transfer has been handled off-chain or through a separate mechanism.
- The exchange rate is set in STX per BTC. For example, a rate of `u100` means 100 STX per 1 BTC.
- Always ensure you have sufficient STX balance before attempting a swap.

## Security Considerations

- Only the contract owner can change the exchange rate.
- Users should verify the exchange rate before swapping.
- This contract has not been audited and is for educational purposes only.

## License
