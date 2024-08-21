import React, { useState, useEffect } from 'react';
import { getPendingSwap, completeSwap, cancelSwap } from '../utils/contractCalls';
import './SwapStatus.css';

function SwapStatus() {
  const [swapStatus, setSwapStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const status = await getPendingSwap();
      setSwapStatus(status);
      setError(null);
    } catch (err) {
      setError('Failed to fetch swap status');
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleComplete = async () => {
    try {
      await completeSwap();
      alert('Swap completed successfully');
      fetchStatus();
    } catch (err) {
      setError('Failed to complete swap');
      console.error(err);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSwap();
      alert('Swap cancelled successfully');
      fetchStatus();
    } catch (err) {
      setError('Failed to cancel swap');
      console.error(err);
    }
  };

  if (isLoading) return <div className="swap-status loading">Loading...</div>;

  if (error) return <div className="swap-status error">{error}</div>;

  return (
    <div className="swap-status">
      <h2>Swap Status</h2>
      {swapStatus ? (
        <div className="swap-details">
          <p><strong>BTC Amount:</strong> {swapStatus.btcAmount} BTC</p>
          <p><strong>STX Amount:</strong> {swapStatus.stxAmount} STX</p>
          <p><strong>Expiry:</strong> {new Date(swapStatus.expiry * 1000).toLocaleString()}</p>
          <div className="swap-actions">
            <button onClick={handleComplete} className="btn btn-primary">Complete Swap</button>
            <button onClick={handleCancel} className="btn btn-secondary">Cancel Swap</button>
          </div>
        </div>
      ) : (
        <p>No pending swap</p>
      )}
      <button onClick={fetchStatus} className="btn btn-refresh">Refresh Status</button>
    </div>
  );
}

export default SwapStatus;
