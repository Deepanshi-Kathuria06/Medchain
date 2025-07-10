import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ConnectWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showRobot, setShowRobot] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  // Function to update wallet in backend
  const updateWalletInBackend = async (walletAddress) => {
    try {
      if (!userEmail) {
        throw new Error('User email not found');
      }

      const response = await fetch('http://localhost:5000/api/user/wallet', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: userEmail,
          walletAddress
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (responseData.user?.role) {
        localStorage.setItem('userRole', responseData.user.role);
        setUserRole(responseData.user.role);
      }

      return responseData;
    } catch (error) {
      console.error('Wallet update error:', error);
      throw new Error(`Failed to update wallet: ${error.message}`);
    }
  };

  // Get user data from localStorage when component mounts
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    
    if (!email) {
      alert('Please login first');
      navigate('/PAuth');
      return;
    }
    
    setUserEmail(email);
    if (role) setUserRole(role);
  }, [navigate]);

  const getNetwork = async () => {
    if (!window.ethereum) return;
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    switch (chainId) {
      case '0x1': setNetwork('Ethereum Mainnet'); break;
      case '0x5': setNetwork('Goerli Testnet'); break;
      case '0xaa36a7': setNetwork('Sepolia Testnet'); break;
      case '0x89': setNetwork('Polygon Mainnet'); break;
      case '0x13881': setNetwork('Mumbai Testnet'); break;
      default: setNetwork('Unknown Network');
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      if (!window.ethereum) throw new Error('Please install MetaMask!');
      if (!userEmail) throw new Error('User session expired');

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const walletAddress = accounts[0];
      
      await updateWalletInBackend(walletAddress);

      setIsConnected(true);
      setAccount(walletAddress);
      await getNetwork();
      
      setShowRobot(true);
      
      // Redirect based on user role after animation
     // In the connectWallet function after successful connection:
setTimeout(() => {
  navigate(userRole === 'doctor' ? '/DDashboard' : '/PDashboardpage', {
    state: { userEmail } // Only pass email
  });
}, 2500);

      // Event listeners for account/chain changes
      const handleAccountsChanged = (accounts) => {
        if (!accounts.length) {
          setIsConnected(false);
          setAccount('');
          setNetwork('');
        }
      };
      
      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup function
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
      
    } catch (err) {
      console.error('Connection error:', err);
      
      let errorMessage = err.message;
      if (err.message.includes('User denied')) {
        errorMessage = 'You need to approve the connection in MetaMask';
      } else if (err.message.includes('already linked')) {
        errorMessage = 'This wallet is already connected to another account';
      }
      
      alert(`Wallet connection failed: ${errorMessage}`);
      
      setIsConnected(false);
      setAccount('');
      setNetwork('');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount('');
    setNetwork('');
    setShowRobot(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden relative">
      {/* Neural Network Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M10,50 Q25,20 40,50 T70,50 T90,30" 
            stroke="url(#neural-gradient)" 
            strokeWidth="0.3" 
            fill="none"
            strokeDasharray="0.5 0.3"
          />
          <path 
            d="M10,70 Q25,40 40,70 T70,70 T90,50" 
            stroke="url(#neural-gradient)" 
            strokeWidth="0.3" 
            fill="none"
            strokeDasharray="0.5 0.3"
          />
          
          <circle cx="40" cy="50" r="1.5" fill="url(#neuron-glow)" className="animate-pulse" />
          <circle cx="70" cy="50" r="1.5" fill="url(#neuron-glow)" className="animate-pulse" style={{ animationDelay: "0.3s" }} />
          
          <defs>
            <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <radialGradient id="neuron-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Floating gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-purple-600/10 blur-3xl animate-float-1"></div>
      <div className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full bg-blue-600/10 blur-3xl animate-float-2"></div>

      {/* Cute Robot Animation */}
      {showRobot && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative"
            initial={{ scale: 0.5, y: 100 }}
            animate={{ 
              scale: [0.5, 1.2, 1],
              y: [100, -20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 1.5,
              ease: "backOut"
            }}
          >
            <div className="relative w-64 h-64">
              {/* Robot Body */}
              <div className="absolute w-40 h-48 bg-blue-400 rounded-xl bottom-0 left-1/2 transform -translate-x-1/2 shadow-lg">
                {/* Robot Face */}
                <div className="absolute w-32 h-24 bg-blue-300 rounded-lg top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center pt-3">
                  {/* Eyes */}
                  <div className="flex space-x-6 mb-2">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-black rounded-full animate-pulse"></div>
                    </div>
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-black rounded-full animate-pulse" style={{ animationDelay: "0.3s" }}></div>
                    </div>
                  </div>
                  {/* Mouth */}
                  <motion.div 
                    className="w-16 h-6 bg-white rounded-b-full"
                    animate={{
                      height: [6, 2, 6],
                      borderRadius: ["0 0 9999px 9999px", "9999px", "0 0 9999px 9999px"]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </div>
                {/* Antenna */}
                <div className="absolute w-2 h-8 bg-blue-500 top-0 left-1/2 transform -translate-x-1/2"></div>
                <div className="absolute w-4 h-4 bg-yellow-300 rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              {/* Arms */}
              <motion.div 
                className="absolute w-6 h-16 bg-blue-400 rounded-full top-16 left-0 origin-top"
                animate={{ rotate: [0, 45, -45, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="absolute w-6 h-16 bg-blue-400 rounded-full top-16 right-0 origin-top"
                animate={{ rotate: [0, -45, 45, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              {/* Success Message */}
              <motion.div 
                className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-green-600 font-bold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Wallet Connected!
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Animated MetaMask Fox */}
        <motion.div 
          className="w-48 h-48 mb-8 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: [0, -15, 0],
          }}
          transition={{ 
            duration: 0.8,
            y: {
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: "easeInOut"
            }
          }}
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png" 
            alt="MetaMask Logo" 
            className="w-full h-full object-contain hover:rotate-6 transition-transform duration-300"
          />
        </motion.div>

        {/* Main content card */}
        <motion.div 
          className="w-full max-w-md bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden shadow-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Card header */}
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 border-b border-gray-700">
            <motion.h1 
              className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Connect Your Wallet
            </motion.h1>
          </div>

          {/* Card body */}
          <div className="p-6">
            <motion.p 
              className="text-gray-400 text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Secure connection to access Web3 applications
            </motion.p>

            {/* Action button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-3 transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 ${isConnecting ? 'opacity-80' : ''}`}
              >
                {isConnecting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </motion.div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 7h7m0 0v7m0-7l-7 7m-4 0H4m0 0v-7m0 7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Footer note */}
          <motion.div 
            className="px-6 py-4 bg-gray-800/50 text-center text-xs text-gray-400 border-t border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Secured by Ethereum blockchain technology
          </motion.div>
        </motion.div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-10px, -15px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, 10px); }
        }
        .animate-float-1 {
          animation: float-1 12s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ConnectWallet;