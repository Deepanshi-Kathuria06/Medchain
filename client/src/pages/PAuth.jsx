import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import axios from 'axios';

const PAuth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverState, setHoverState] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [username, setUsername] = useState('');

//   const connectWallet = async () => {
//   if (window.ethereum) {
//     try {
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       setWalletAddress(accounts[0]);
//     } catch (err) {
//       alert("Failed to connect wallet.");
//     }
//   } else {
//     alert("MetaMask is not installed.");
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const res = await axios.post('http://localhost:5000/api/register', {
        username,
      email,
      password,
      role: activeTab,
      // 🚫 remove walletAddress from here
    });

    if (res.status === 201) {
      setShowSuccess(true);

localStorage.setItem('userEmail', email);
localStorage.setItem('userRole', activeTab);
      // Navigate to wallet connection page
      setTimeout(() => {
        navigate('/connectwallet'); // On this page, you handle MetaMask
      }, 1500);
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'Registration failed.');
  } finally {
    setIsSubmitting(false);
  }
};

    
   
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900 text-white">
      {/* 3D Background with DNA Helix */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 25], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5} 
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 3}
          />
          <Stars radius={150} depth={60} count={8000} factor={6} saturation={0} fade speed={2} />
          
          {/* DNA Helix */}
          <DnaHelix />
          
          <Text
          >
          </Text>
        </Canvas>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-1 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-400/20"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Login Container */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
        <div 
          className="w-full max-w-md rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-blue-500/20 hover:border-blue-400/30"
          onMouseEnter={() => setHoverState(true)}
          onMouseLeave={() => setHoverState(false)}
        >
          {/* Animated Gradient Border */}
          <div className={`h-1 bg-gradient-to-r ${hoverState ? 'from-blue-500 via-purple-500 to-emerald-500' : 'from-blue-400/30 via-purple-400/30 to-emerald-400/30'} animate-gradient-x`}></div>
          
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              {/* Animated Logo */}
              <div className={`w-24 h-24 rounded-full ${hoverState ? 'bg-gradient-to-br from-blue-500 to-emerald-500' : 'bg-gradient-to-br from-blue-600/80 to-emerald-600/80'} flex items-center justify-center mb-4 shadow-lg transition-all duration-500 ${hoverState ? 'shadow-blue-400/30' : 'shadow-blue-400/10'} animate-pulse-slow`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-mono tracking-tight">
                MEDCHAIN
              </h1>
              <p className="mt-2 text-gray-300 text-center text-sm">
                {activeTab === 'patient' 
                  ? "Your health data, secured by blockchain technology" 
                  : "Secure access to patient records with decentralized authentication"}
              </p>
            </div>

            {/* Tab Selector */}
            <div className="flex mb-6 bg-gray-800/50 rounded-lg p-1">
              <button
                type="button"
                className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${activeTab === 'patient' ? 'text-white bg-gray-700/80 shadow-md' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('patient')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Patient</span>
                </div>
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${activeTab === 'doctor' ? 'text-white bg-gray-700/80 shadow-md' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('doctor')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Provider</span>
                </div>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <FloatingInput 
  id="username"
  type="text"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  label="Username"
  placeholder="Enter unique username"
  required
/>

                <FloatingInput 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label={activeTab === 'patient' ? 'Patient Email' : 'Professional Email'}
                  placeholder={activeTab === 'patient' ? 'patient@example.com' : 'doctor@clinic.com'}
                  required
                />
                
                <FloatingInput 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="pt-2">
                <div className="relative flex items-center justify-center before:absolute before:w-full before:h-px before:bg-gradient-to-r before:from-transparent before:via-blue-400/30 before:to-transparent before:top-1/2 before:left-0">
                  <span className="relative z-10 px-3 text-xs text-gray-400 bg-gray-900/80">
                    Blockchain Authentication
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'patient' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400' 
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400'
                } shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In with Wallet</span>
                    <h1>hello</h1>
                  </>
                )}
              </button>
            </form>
            {showSuccess && (
  <div className="mt-4 text-green-400 text-center font-medium animate-pulse">
    ✅ Registered successfully! Redirecting to MetaMask...
    
  </div>
  // After successful login
)}


          </div>

          <div className="px-8 py-4 bg-white/5 border-t border-white/10 text-center">
            <p className="text-xs text-gray-400">
              Powered by Ethereum • HIPAA compliant • Zero-knowledge proofs
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 1; }
          50% { transform: translateY(-100px) translateX(20px); opacity: 0.8; }
          100% { transform: translateY(-200px) translateX(0); opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-gradient-x {
          background-size: 300% 300%;
          animation: gradient-x 6s ease infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// DNA Helix Component
const DnaHelix = () => {
  const helixRadius = 5;
  const helixHeight = 15;
  const segmentCount = 50;
  
  return (
    <group position={[0, 0, 0]}>
      {Array.from({ length: segmentCount }).map((_, i) => {
        const theta = (i / segmentCount) * Math.PI * 8;
        const y = (i / segmentCount) * helixHeight - helixHeight / 2;
        const x = Math.cos(theta) * helixRadius;
        const z = Math.sin(theta) * helixRadius;
        
        return (
          <group key={i}>
            {/* Main helix strand */}
            <mesh position={[x, y, z]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#3b82f6" : "#10b981"} emissive={i % 2 === 0 ? "#3b82f6" : "#10b981"} emissiveIntensity={0.3} />
            </mesh>
            
            {/* Connecting lines */}
            {i < segmentCount - 1 && (
              <>
                <line>
                  <bufferGeometry attach="geometry" 
                    attributes={{
                      position: new THREE.BufferAttribute(new Float32Array([
                        x, y, z,
                        Math.cos(theta + Math.PI * 8 / segmentCount) * helixRadius, 
                        y + helixHeight / segmentCount, 
                        Math.sin(theta + Math.PI * 8 / segmentCount) * helixRadius
                      ]), 3)
                    }} 
                  />
                  <lineBasicMaterial attach="material" color="#ffffff" opacity={0.2} transparent />
                </line>
                
                {/* Cross connections */}
                {i % 5 === 0 && (
                  <line>
                    <bufferGeometry attach="geometry" 
                      attributes={{
                        position: new THREE.BufferAttribute(new Float32Array([
                          x, y, z,
                          -x, y, -z
                        ]), 3)
                      }} 
                    />
                    <lineBasicMaterial attach="material" color="#ffffff" opacity={0.1} transparent />
                  </line>
                )}
              </>
            )}
          </group>
        );
      })}
    </group>
  );
};

// Floating Input Component
const FloatingInput = ({ id, label, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative">
      <input
        id={id}
        className={`block w-full px-4 pt-5 pb-2 rounded-lg bg-white/5 border ${isFocused ? 'border-blue-400/50' : 'border-white/10'} focus:outline-none focus:ring-1 focus:ring-blue-400/30 peer transition placeholder-transparent`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      <label 
        htmlFor={id} 
        className={`absolute left-4 transition-all duration-200 ${isFocused || props.value ? 'top-1.5 text-xs text-blue-400' : 'top-4 text-sm text-gray-400'}`}
      >
        {label}
      </label>
      <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300 ${isFocused ? 'w-full' : 'w-0'}`}></div>
    </div>
  );
};

export default PAuth;   