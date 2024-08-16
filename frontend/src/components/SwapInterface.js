import React, { useState, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';
import { 
  initiateSwap, 
  completeSwap, 
  cancelSwap, 
  getPendingSwap, 
  getMinGovernanceTokens 
} from '../utils/contractCalls';
import './SwapInterface.css';

function SwapInterface() {
  const [btcAmount, setBtcAmount] = useState('');
  const [stxEstimate, setStxEstimate] = useState('');
  const [swapStatus, setSwapStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { doContractCall } = useConnect();

  useEffect(() => {
    fetchStatus();
    fetchMinGovernanceTokens();
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

  const fetchMinGovernanceTokens = async () => {
    try {
      const minTokens = await getMinGovernanceTokens();
      console.log('Minimum governance tokens required:', minTokens);
    } catch (err) {
      console.error('Failed to fetch minimum governance tokens:', err);
    }
  };

  const handleBtcAmountChange = (e) => {
    const amount = e.target.value;
    setBtcAmount(amount);
    setStxEstimate(amount ? (parseFloat(amount) * 10000).toFixed(2) : '');
  };

  const handleInitiateSwap = async (e) => {
    e.preventDefault();
    if (!btcAmount) {
      alert('Please enter a BTC amount');
      return;
    }
    try {
      await initiateSwap(btcAmount);
      alert('Swap initiated successfully');
      fetchStatus();
    } catch (error) {
      setError('Failed to initiate swap');
      console.error('Failed to initiate swap:', error);
    }
  };

  const handleCompleteSwap = async () => {
    try {
      await completeSwap();
      alert('Swap completed successfully');
      fetchStatus();
    } catch (err) {
      setError('Failed to complete swap');
      console.error(err);
    }
  };

  const handleCancelSwap = async () => {
    try {
      await cancelSwap();
      alert('Swap cancelled successfully');
      fetchStatus();
    } catch (err) {
      setError('Failed to cancel swap');
      console.error(err);
    }
  };

  return (
    <div className="swap-interface">
      <h1>BTC to STX Swap</h1>
      
      <div className="swap-form-container">
        <h2>Initiate New Swap</h2>
        <form onSubmit={handleInitiateSwap} className="swap-form">
          <div className="form-group">
            <label htmlFor="btcAmount">BTC Amount:</label>
            <input
              type="number"
              id="btcAmount"
              value={btcAmount}
              onChange={handleBtcAmountChange}
              placeholder="Enter BTC amount"
              step="0.00000001"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="stxEstimate">Estimated STX:</label>
            <input
              type="text"
              id="stxEstimate"
              value={stxEstimate}
              readOnly
              placeholder="Estimated STX amount"
            />
          </div>
          <button type="submit" className="submit-button">Initiate Swap</button>
        </form>
      </div>

      <div className="swap-status">
        <h2>Swap Status</h2>
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : swapStatus ? (
          <div className="swap-details">
            <p><strong>BTC Amount:</strong> {swapStatus.btcAmount} BTC</p>
            <p><strong>STX Amount:</strong> {swapStatus.stxAmount} STX</p>
            <p><strong>Expiry:</strong> {new Date(swapStatus.expiry * 1000).toLocaleString()}</p>
            <div className="swap-actions">
              <button onClick={handleCompleteSwap} className="btn btn-primary">Complete Swap</button>
              <button onClick={handleCancelSwap} className="btn btn-secondary">Cancel Swap</button>
            </div>
          </div>
        ) : (
          <p>No pending swap</p>
        )}
        <button onClick={fetchStatus} className="btn btn-refresh">Refresh Status</button>
      </div>
    </div>
  );
}

export default SwapInterface;
