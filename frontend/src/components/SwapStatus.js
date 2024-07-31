import React, { useState, useEffect } from 'react';
import { getPendingSwap } from '../utils/contractCalls';

function SwapStatus() {
  const [swapStatus, setSwapStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getPendingSwap();
      setSwapStatus(status);
    };
    fetchStatus();
  }, []);

  return (
    <div>
      <h2>Swap Status</h2>
      {swapStatus ? (
        <p>
          BTC Amount: {swapStatus.btcAmount}, STX Amount: {swapStatus.stxAmount}, 
          Expiry: {swapStatus.expiry}
        </p>
      ) : (
        <p>No pending swap</p>
      )}
    </div>
  );
}

export default SwapStatus;