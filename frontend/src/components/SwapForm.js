import React, { useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { initiateSwap } from '../utils/contractCalls';
import './SwapForm.css';

function SwapForm() {
  const [btcAmount, setBtcAmount] = useState('');
  const [stxEstimate, setStxEstimate] = useState('');
  const { doContractCall } = useConnect();

  const handleBtcAmountChange = (e) => {
    const amount = e.target.value;
    setBtcAmount(amount);
    setStxEstimate(amount ? (parseFloat(amount) * 10000).toFixed(2) : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!btcAmount) {
      alert('Please enter a BTC amount');
      return;
    }
    initiateSwap(doContractCall, btcAmount);
  };

  return (
    <div className="swap-form-container">
      <h2>Initiate BTC to STX Swap</h2>
      <form onSubmit={handleSubmit} className="swap-form">
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
      <p className="disclaimer">
        Note: This swap is subject to network fees and exchange rates. 
        Please review all details before confirming.
      </p>
    </div>
  );
}

export default SwapForm;
