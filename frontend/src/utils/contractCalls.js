import { 
  openContractCall,
  openSTXTransfer,
  callReadOnlyFunction,
} from '@stacks/connect';
import { 
  StacksMainnet,
  StacksTestnet,
} from '@stacks/network';
import { 
  uintCV,
  principalCV,
  standardPrincipalCV,
  cvToHex,
  hexToCV,
} from '@stacks/transactions';

// Please note: this values will be configured for deployment
const CONTRACT_ADDRESS = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9';
const CONTRACT_NAME = 'btc-stx-swap';
const NETWORK = new StacksTestnet(); // Will use StacksMainnet() for production

// Helper function to create contract call options
const createContractCallOptions = (functionName, functionArgs) => ({
  network: NETWORK,
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACT_NAME,
  functionName,
  functionArgs,
  onFinish: data => console.log('Transaction submitted:', data),
  onCancel: () => console.log('Transaction cancelled'),
});

export const initiateSwap = async (btcAmount) => {
  const options = createContractCallOptions('initiate-swap', [
    uintCV(btcAmount)
  ]);
  await openContractCall(options);
};

export const completeSwap = async () => {
  const options = createContractCallOptions('complete-swap', []);
  await openContractCall(options);
};

export const cancelSwap = async () => {
  const options = createContractCallOptions('cancel-swap', []);
  await openContractCall(options);
};

export const updateMinGovernanceTokens = async (newMin) => {
  const options = createContractCallOptions('update-min-governance-tokens', [
    uintCV(newMin)
  ]);
  await openContractCall(options);
};

export const getPendingSwap = async (userAddress) => {
  try {
    const result = await callReadOnlyFunction({
      network: NETWORK,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-pending-swap',
      functionArgs: [standardPrincipalCV(userAddress)],
      senderAddress: userAddress,
    });

    if (result.value) {
      return {
        btcAmount: result.value['btc-amount'].value.toString(),
        stxAmount: result.value['stx-amount'].value.toString(),
        expiry: result.value.expiry.value.toString(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching pending swap:', error);
    throw error;
  }
};

export const getMinGovernanceTokens = async () => {
  try {
    const result = await callReadOnlyFunction({
      network: NETWORK,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-min-governance-tokens',
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS,
    });
    return result.value.toString();
  } catch (error) {
    console.error('Error fetching minimum governance tokens:', error);
    throw error;
  }
};

export const getContractOwner = async () => {
  try {
    const result = await callReadOnlyFunction({
      network: NETWORK,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-contract-owner',
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS,
    });
    return result.value.toString();
  } catch (error) {
    console.error('Error fetching contract owner:', error);
    throw error;
  }
};
