import React from 'react';
import SwapForm from './components/SwapForm';
import SwapStatus from './components/SwapStatus';
import ConnectWallet from './components/ConnectWallet';

function App() {
  return (
    <div className="App">
      <h1>BTC to STX Swap</h1>
      <ConnectWallet />
      <SwapForm />
      <SwapStatus />
    </div>
  );
}

export default App;