import { openContractCall } from '@stacks/connect';
import { StacksMainnet } from '@stacks/network';

const CONTRACT_ADDRESS = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9';
const CONTRACT_NAME = 'btc-stx-swap';

export const initiateSwap = async (doContractCall, btcAmount) => {
  await doContractCall({
    network: new StacksMainnet(),
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'initiate-swap',
    functionArgs: [btcAmount],
    onFinish: data => console.log('Swap initiated', data),
    onCancel: () => console.log('Swap cancelled'),
  });
};

export const getPendingSwap = async () => {
  // This function would call the contract to get pending swap details
  // Implementation depends on querying the blockchain
  // @stacks/transactions or a custom API might be used
};