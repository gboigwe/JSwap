import React, { useState } from 'react';
import { connect } from '@stacks/connect';
import { UserSession } from '@stacks/auth';
import { Person } from '@stacks/profile';
import './ConnectWallet.css';

function ConnectWallet() {
  const [userData, setUserData] = useState(null);
  const userSession = new UserSession();

  const handleConnect = () => {
    connect({
      appDetails: {
        name: 'BTC to STX Swap',
        icon: 'https://api.multiavatar.com/lEnMz69ckAaRgo',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        const person = new Person(userData.profile);
        setUserData({
          address: userData.profile.stxAddress.mainnet,
          name: person.name() || 'Stacks User',
        });
      },
      onCancel: () => console.log('Cancelled'),
      userSession,
    });
  };

  const handleSignOut = () => {
    userSession.signUserOut('/');
    setUserData(null);
  };

  return (
    <div className="connect-wallet">
      {userData ? (
        <div className="wallet-info">
          <img 
            src={`https://api.multiavatar.com/${userData.name}`} 
            alt="Profile" 
            className="profile-image"
          />
          <div className="user-details">
            <p className="user-name">{userData.name}</p>
            <p className="user-address">{userData.address}</p>
          </div>
          <button onClick={handleSignOut} className="sign-out-button">
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={handleConnect} className="connect-button">
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default ConnectWallet;
