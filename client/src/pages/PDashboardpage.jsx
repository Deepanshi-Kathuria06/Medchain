import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, Copy, Share2, HardDrive, Users, Clock, X, Menu, FolderOpen, ChevronDown, ChevronUp, Lock, Calendar, Settings, LogOut, User, Bell, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PDashboardpage = () => {
  // State for user data and loading
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  
  // Dashboard states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('recent');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [shareDays, setShareDays] = useState(7);
  const [shareDescription, setShareDescription] = useState('');
  const [showContactsDropdown, setShowContactsDropdown] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Patient account data - will be populated from userData
  const [patientAccount, setPatientAccount] = useState({
    name: '',
    email: '',
    walletAddress: '',
    dob: '',
    bloodType: '',
    allergies: '',
    medications: '',
    phone: '',
    emergencyContact: ''
  });

  // Default contacts
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', role: 'Cardiologist', address: '0x3f5CE...3d4f', avatar: '❤️' },
    { id: 2, name: 'Dr. Michael Chen', role: 'Neurologist', address: '0x1a2B3...5e6f', avatar: '🧠' },
    { id: 3, name: 'Dr. Emily Wilson', role: 'Pediatrician', address: '0x7c8D9...1b2c', avatar: '👶' },
    { id: 4, name: 'St. Mary Hospital', role: 'Healthcare Provider', address: '0x4e5F6...7d8e', avatar: '🏥' }
  ]);

  // Sample files data - in a real app, this would come from the backend
  const sampleFiles = [
    { name: 'blood-test-results.pdf', cid: 'QmXyZ1234UtNxGuqRGGgw3s2mf', shared: true },
    { name: 'x-ray-scan.png', cid: 'QmAbC5678UtNxGuqRGGgw3s2mf', shared: false },
    { name: 'prescription-0423.pdf', cid: 'QmDeF9012UtNxGuqRGGgw3s2mf', shared: true }
  ];

  // Function to extract username from email
  const getUsernameFromEmail = (email) => {
    if (!email) return '';
    const atIndex = email.indexOf('@');
    if (atIndex === -1) return email;
    const username = email.substring(0, atIndex);
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real app, you would get this from localStorage or auth context
        const userEmail = localStorage.getItem('userEmail') || 'patient@example.com';
        const walletAddress = localStorage.getItem('walletAddress') || '0x7f3a...4b5c';
        
        // Generate username from email
        const username = getUsernameFromEmail(userEmail);
        
        // Simulate API call
        setTimeout(() => {
          // Mock response with additional patient details
          const mockUserData = {
            name: username || 'John Smith', // Use generated username or fallback
            email: userEmail,
            walletAddress: walletAddress,
            dob: '1985-07-15',
            bloodType: 'A+',
            allergies: 'Penicillin, Peanuts',
            medications: 'Lisinopril 10mg daily',
            phone: '+1 (555) 123-4567',
            emergencyContact: 'Jane Doe (Spouse) +1 (555) 987-6543'
          };
          
          setUserData(mockUserData);
          setPatientAccount(mockUserData);
          
          // Set sample files for demo purposes
          setFiles(sampleFiles);
          
          setIsLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Dashboard functions
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload with progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            // Add the new file to the list
            const newFile = {
              name: file.name,
              cid: `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
              shared: false
            };
            setFiles(prevFiles => [newFile, ...prevFiles]);
            setUploadProgress(0);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const openShareModal = (file) => {
    setSelectedFile(file);
    setShowShareModal(true);
    setSelectedContacts([]);
    setShareDays(7);
    setShareDescription('');
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setSelectedFile(null);
  };

  const toggleContactSelection = (contact) => {
    setSelectedContacts(prev => {
      if (prev.some(c => c.id === contact.id)) {
        return prev.filter(c => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const confirmShare = () => {
    if (!selectedFile || selectedContacts.length === 0) return;
    
    // Simulate sharing with encryption and time limit
    const sharedFiles = files.map(file => 
      file.cid === selectedFile.cid 
        ? { ...file, shared: true, sharedWith: selectedContacts.map(c => c.id) }
        : file
    );
    
    setFiles(sharedFiles);
    
    // Show success message
    alert(`Successfully shared ${selectedFile.name} with ${selectedContacts.length} contact(s) for ${shareDays} days`);
    
    closeShareModal();
  };

  const renderFileIcon = (fileName) => {
    return fileName.includes('blood') ? '🩸' : 
           fileName.includes('x-ray') ? '🩻' :
           fileName.includes('prescription') ? '💊' :
           fileName.includes('allergy') ? '🤧' :
           fileName.includes('history') ? '📋' :
           fileName.includes('vaccine') ? '💉' :
           fileName.includes('ultrasound') ? '👶' : '📝';
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    
    // If email is being changed, update the username as well
    if (name === 'email') {
      const username = getUsernameFromEmail(value);
      setPatientAccount(prev => ({
        ...prev,
        [name]: value,
        name: username || prev.name // Update name only if we can extract from email
      }));
    } else {
      setPatientAccount(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const saveAccountChanges = () => {
    setIsEditing(false);
    // Update user data with new account information
    setUserData(patientAccount);
    // In a real app, you would save to backend here
    alert('Account information updated successfully!');
  };

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('walletAddress');
    
    // Redirect to login page (in a real app)
    alert('You have been logged out');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
      />
      
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white shadow-md"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Side Navigation */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-lg z-40 md:static md:translate-x-0 border-r border-gray-700`}
      >
        <div className="p-6 h-full flex flex-col">
          <h2 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            MedChain
          </h2>
          
          <nav className="space-y-2 flex-1">
            <button
              onClick={() => setActiveView('recent')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'recent' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
              <Clock className="text-cyan-400" size={20} />
              Recent Records
            </button>
            <button
              onClick={() => setActiveView('uploads')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'uploads' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
              <UploadCloud className="text-cyan-400" size={20} />
              My Uploads
            </button>
            <button
              onClick={() => setActiveView('records')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'records' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
              <HardDrive className="text-cyan-400" size={20} />
              Saved Records
            </button>
            <button
              onClick={() => setActiveView('contacts')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'contacts' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
              <Users className="text-cyan-400" size={20} />
              Contacts
            </button>
            <button
              onClick={() => setActiveView('account')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'account' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
              <User className="text-cyan-400" size={20} />
              My Account
            </button>
          </nav>

          <div className="mt-auto pt-4 border-t border-gray-700">
            <div className="w-full flex items-center gap-2 px-4 py-3 text-gray-400 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                {patientAccount.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-sm font-medium truncate">{patientAccount.name}</p>
                <p className="text-xs truncate">{patientAccount.email}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">
                  {activeView === 'recent' && 'Recent Records'}
                  {activeView === 'uploads' && 'My Uploads'}
                  {activeView === 'records' && 'Saved Records'}
                  {activeView === 'contacts' && 'Contacts'}
                  {activeView === 'account' && 'My Account'}
                </h1>
                <p className="text-gray-400">
                  {activeView === 'recent' && 'Your most recent uploads stored securely on IPFS'}
                  {activeView === 'uploads' && 'All files you have uploaded to the network'}
                  {activeView === 'records' && 'Your complete medical records history'}
                  {activeView === 'contacts' && 'Your trusted medical contacts and providers'}
                  {activeView === 'account' && 'Manage your personal information and settings'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-cyan-400 rounded-full hover:bg-gray-800">
                  <Bell size={20} />
                </button>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-500"
                  />
                  <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
                </div>
                
                {activeView !== 'account' && (
                  <button
                    onClick={triggerFileInput}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <UploadCloud size={18} />
                    Upload
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">Uploading file...</span>
                  <span className="text-sm text-gray-400">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <motion.div 
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2.5 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Files Grid - Only shown for recent and uploads views */}
          {(activeView === 'recent' || activeView === 'uploads') && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
            >
              {files.map((file, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-800 rounded-lg p-4 hover:shadow-md transition-all border border-gray-700 hover:border-cyan-400"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl mb-2">
                        {renderFileIcon(file.name)}
                      </div>
                      <p className="font-medium text-white text-sm truncate">{file.name}</p>
                      <p className="text-xs text-gray-400 mt-1">CID: {file.cid.substring(0, 8)}...</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => copyToClipboard(file.cid, index)}
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                        title="Copy CID"
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                        onClick={() => openShareModal(file)}
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                        title="Share"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                  {copiedIndex === index && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-cyan-400 mt-2"
                    >
                      CID copied to clipboard!
                    </motion.div>
                  )}
                  {file.shared && (
                    <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                      <Users size={12} />
                      Shared
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Saved Records View */}
          {activeView === 'records' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-10"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Complete Medical History</h2>
              <div className="space-y-3">
                {files.map((file, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {renderFileIcon(file.name)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-xs text-gray-400">Uploaded: {new Date().toLocaleDateString()}</p>
                        {file.shared && (
                          <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                            <Users size={12} />
                            Shared with {file.sharedWith ? file.sharedWith.length : 0} contacts
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => copyToClipboard(file.cid, index)}
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                        title="Copy CID"
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                        onClick={() => openShareModal(file)}
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                        title="Share"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contacts View */}
          {activeView === 'contacts' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-10"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Trusted Contacts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts.map((contact, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between gap-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {contact.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-white">{contact.name}</p>
                        <p className="text-xs text-gray-400">{contact.role}</p>
                        <p className="text-xs text-gray-400 mt-1">{contact.address}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(contact.address, index)}
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                      title="Copy address"
                    >
                      <Copy size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Account View */}
          {activeView === 'account' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">My Account</h2>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={saveAccountChanges}
                      className="px-3 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-lg shadow-md transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    <Settings size={16} />
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={patientAccount.name}
                        onChange={handleAccountChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="p-2 bg-gray-700 rounded-lg text-white">{patientAccount.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={patientAccount.email}
                        onChange={handleAccountChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="p-2 bg-gray-700 rounded-lg text-white">{patientAccount.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dob"
                        value={patientAccount.dob}
                        onChange={handleAccountChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="p-2 bg-gray-700 rounded-lg text-white">{patientAccount.dob}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Blood Type</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="bloodType"
                        value={patientAccount.bloodType}
                        onChange={handleAccountChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="p-2 bg-gray-700 rounded-lg text-white">{patientAccount.bloodType}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Allergies</label>
                    {isEditing ? (
                      <textarea
                        name="allergies"
                        value={patientAccount.allergies}
                        onChange={handleAccountChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-20"
                      />
                    ) : (
                      <p className="p-2 bg-gray-700 rounded-lg text-white">{patientAccount.allergies}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Current Medications</label>
                    {isEditing ? (
                      <textarea
                        name="medications"
                        value={patientAccount.medications}
                        onChange={handleAccountChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-20"
                      />
                    ) : (
                      <p className="p-2 bg-gray-700 rounded-lg text-white">{patientAccount.medications}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={patientAccount.phone}
                        onChange={handleAccountChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="p-2 bg-gray-700 rounded-lg text-white">{patientAccount.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Emergency Contact</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="emergencyContact"
                        value={patientAccount.emergencyContact}
                        onChange={handleAccountChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="p-2 bg-gray-700 rounded-lg text-white">{patientAccount.emergencyContact}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-medium text-white mb-4">Account Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="flex items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors">
                    <Lock size={18} className="text-purple-400" />
                    <span>Change Password</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors"
                  >
                    <LogOut size={18} className="text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Share Modal */}
          {showShareModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Share Medical Record</h3>
                  <button onClick={closeShareModal} className="text-gray-400 hover:text-gray-200">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="text-2xl">
                      {selectedFile && renderFileIcon(selectedFile.name)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{selectedFile?.name}</p>
                      <p className="text-xs text-gray-400">CID: {selectedFile?.cid.substring(0, 8)}...</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Share with contacts</label>
                  <div className="relative">
                    <button 
                      onClick={() => setShowContactsDropdown(!showContactsDropdown)}
                      className="w-full flex justify-between items-center p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-300"
                    >
                      <span>
                        {selectedContacts.length > 0 
                          ? `${selectedContacts.length} selected` 
                          : "Select contacts"}
                      </span>
                      {showContactsDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    
                    {showContactsDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {contacts.map(contact => (
                          <div 
                            key={contact.id}
                            onClick={() => toggleContactSelection(contact)}
                            className={`p-3 hover:bg-gray-600 cursor-pointer flex items-center gap-3 ${selectedContacts.some(c => c.id === contact.id) ? 'bg-gray-600' : ''}`}
                          >
                            <input 
                              type="checkbox" 
                              checked={selectedContacts.some(c => c.id === contact.id)}
                              readOnly
                              className="rounded text-cyan-400"
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{contact.avatar}</span>
                              <div>
                                <p className="font-medium text-sm text-white">{contact.name}</p>
                                <p className="text-xs text-gray-400">{contact.role}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Access Duration (days)</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={shareDays}
                    onChange={(e) => setShareDays(Math.max(1, Math.min(365, parseInt(e.target.value) || 1)))}
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Purpose (optional)</label>
                  <textarea
                    value={shareDescription}
                    onChange={(e) => setShareDescription(e.target.value)}
                    placeholder="Add a note about this shared record..."
                    className="w-full p-2 border border-gray-600 rounded-lg h-20 bg-gray-700 text-white"
                  />
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <Lock size={16} className="text-cyan-400" />
                  <span>This record will be encrypted and accessible only to selected contacts</span>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeShareModal}
                    className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmShare}
                    disabled={selectedContacts.length === 0}
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${selectedContacts.length === 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700'}`}
                  >
                    Share Record
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDashboardpage;