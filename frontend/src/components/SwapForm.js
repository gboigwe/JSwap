import React, { useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { initiateSwap } from '../utils/contractCalls';

function SwapForm() {
  const [btcAmount, setBtcAmount] = useState('');
  const { doContractCall } = useConnect();

  const handleSubmit = (e) => {
    e.preventDefault();
    initiateSwap(doContractCall, btcAmount);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={btcAmount}
        onChange={(e) => setBtcAmount(e.target.value)}
        placeholder="BTC Amount"
      />
      <button type="submit">Initiate Swap</button>
    </form>
  );
}

export default SwapForm;