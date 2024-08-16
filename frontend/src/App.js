import React, { useState } from 'react';
import SwapForm from './components/SwapForm';
import SwapStatus from './components/SwapStatus';
import ConnectWallet from './components/ConnectWallet';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSwapInitiated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <h1>BTC to STX Swap</h1>
      <ConnectWallet />
      <SwapForm onSwapInitiated={handleSwapInitiated} />
      <SwapStatus key={refreshTrigger} />
    </div>
  );
}

export default App;