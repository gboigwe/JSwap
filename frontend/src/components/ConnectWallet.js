import React, { useState } from 'react';
import { connect } from '@stacks/connect';

function ConnectWallet() {
  const [address, setAddress] = useState('');

  const handleConnect = () => {
    connect({
      appDetails: {
        name: 'BTC to STX Swap',
        icon: 'https://api.multiavatar.com/lEnMz69ckAaRgo',
      },
      onFinish: (data) => setAddress(data.address),
      onCancel: () => console.log('Cancelled'),
    });
  };

  return (
    <div>
      {address ? (
        <p>Connected: {address}</p>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
    </div>
  );
}

export default ConnectWallet;