import React from 'react';
import SwapForm from './components/SwapForm';
import ConnectWallet from './components/ConnectWallet';

function App() {
  return (
    <div className="App">
      <h1>BTC to STX Swap</h1>
      <ConnectWallet />
      <SwapForm />
    </div>
  );
}

export default App;