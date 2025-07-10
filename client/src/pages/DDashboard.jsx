import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, User, Stethoscope, FileText, Calendar, 
  Search, Bell, Menu, X, ChevronDown, ChevronRight, 
  Share2, History, Contact, Lock, Settings, LogOut, 
  Edit2, Trash2, Save, ArrowLeft, Plus, AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const DDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('patients');
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [shareDays, setShareDays] = useState(7);
  const [shareDescription, setShareDescription] = useState('');
  const [showContactsDropdown, setShowContactsDropdown] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showAccountPanel, setShowAccountPanel] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Doctor account data with editable state
  const [doctorAccount, setDoctorAccount] = useState({
    name: '',
    email: '',
    hospital: '',
    role: '',
    walletAddress: '',
    phone: '',
    licenseNumber: '',
    specialization: '',
    yearsOfExperience: ''
  });

  const [tempAccount, setTempAccount] = useState({...doctorAccount});

  // Sample patient data
  const patients = [
    {
      id: 1,
      name: 'John Smith',
      age: 42,
      gender: 'Male',
      lastVisit: '2023-05-15',
      contacts: [
        { id: 1, name: 'Emergency Contact', phone: '+1 (555) 123-4567', relation: 'Spouse' },
        { id: 2, name: 'Primary Care Physician', phone: '+1 (555) 987-6543', relation: 'Dr. Johnson' }
      ],
      sharedRecords: [
        { id: 1, name: 'Cardiology Report', sharedWith: 'Dr. Anderson', date: '2023-04-10' },
        { id: 2, name: 'Lab Results', sharedWith: 'City Medical Lab', date: '2023-03-22' }
      ],
      records: [
        { id: 1, date: '2023-05-15', type: 'Consultation', diagnosis: 'Hypertension', treatment: 'Prescribed medication' },
        { id: 2, date: '2023-03-10', type: 'Follow-up', diagnosis: 'Hypertension', treatment: 'Adjusted dosage' },
        { id: 3, date: '2023-01-05', type: 'Initial Visit', diagnosis: 'Hypertension', treatment: 'Initial assessment' }
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      age: 35,
      gender: 'Female',
      lastVisit: '2023-05-10',
      contacts: [
        { id: 3, name: 'Emergency Contact', phone: '+1 (555) 234-5678', relation: 'Mother' },
        { id: 4, name: 'Endocrinologist', phone: '+1 (555) 876-5432', relation: 'Dr. Williams' }
      ],
      sharedRecords: [
        { id: 3, name: 'Diabetes Management', sharedWith: 'Endocrinology Dept', date: '2023-05-05' },
        { id: 4, name: 'Bloodwork', sharedWith: 'Central Lab', date: '2023-02-15' }
      ],
      records: [
        { id: 4, date: '2023-05-10', type: 'Consultation', diagnosis: 'Type 2 Diabetes', treatment: 'Diet and exercise plan' },
        { id: 5, date: '2023-02-20', type: 'Blood Test', diagnosis: 'Type 2 Diabetes', treatment: 'Lab work ordered' }
      ]
    }
  ];

  const allContacts = [
    { id: 1, name: 'Dr. Anderson', specialty: 'Cardiology', type: 'Physician' },
    { id: 2, name: 'City Medical Lab', specialty: 'Laboratory', type: 'Facility' },
    { id: 3, name: 'Dr. Williams', specialty: 'Endocrinology', type: 'Physician' },
    { id: 4, name: 'Central Lab', specialty: 'Laboratory', type: 'Facility' }
  ];

  // Animation variants
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const patientCardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 }
  };

  // Fetch doctor data on component mount
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const walletAddress = localStorage.getItem('walletAddress');
        
        if (!userEmail) {
          navigate('/login');
          return;
        }

        // In a real app, you would fetch from your backend
        // This is a mock implementation
        const mockDoctorData = {
          name: 'Dr. ' + (userEmail.split('@')[0] || 'User'),
          email: userEmail,
          hospital: 'Metro Health Hospital',
          role: 'Senior Cardiologist',
          phone: '+1 (555) 123-4567',
          licenseNumber: 'MD' + Math.floor(10000000 + Math.random() * 90000000),
          specialization: 'Cardiology',
          yearsOfExperience: '8'
        };

        setDoctorAccount({
          ...mockDoctorData,
          walletAddress: walletAddress || 'Not connected'
        });
        setTempAccount({
          ...mockDoctorData,
          walletAddress: walletAddress || 'Not connected'
        });
        
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        alert('Failed to load doctor data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [navigate]);

  // Helper functions
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const togglePatientExpansion = (id) => {
    setExpandedPatient(expandedPatient === id ? null : id);
  };

  const openShareModal = (record) => {
    setSelectedRecord(record);
    setShowShareModal(true);
    setSelectedContacts([]);
    setShareDays(7);
    setShareDescription('');
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setSelectedRecord(null);
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
    if (!selectedRecord || selectedContacts.length === 0) return;
    
    // In a real app, this would update the patient's sharedRecords
    alert(`Successfully shared ${selectedRecord.type} record with ${selectedContacts.length} contact(s) for ${shareDays} days`);
    
    closeShareModal();
  };

  // Account functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempAccount(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveChanges = async () => {
    try {
      // In a real app, you would call an API to update the user data here
      setDoctorAccount({...tempAccount});
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const cancelEditing = () => {
    setTempAccount({...doctorAccount});
    setIsEditing(false);
  };

  const initiateDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // In a real app, you would call an API to delete the account here
    alert('Account deletion request sent');
    handleLogout();
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('walletAddress');
    
    // Redirect to login page
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading doctor data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white shadow-md"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Side Navigation */}
      <motion.div 
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-lg z-40 border-r border-gray-700`}
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-6 h-full flex flex-col">
          <h2 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            MedChain MD
          </h2>
          
          <nav className="space-y-2 flex-1">
            <button
              onClick={() => setActiveView('patients')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'patients' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
              <User className="text-cyan-400" size={20} />
              My Patients
            </button>
            <button
              onClick={() => setActiveView('appointments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'appointments' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
              <Calendar className="text-cyan-400" size={20} />
              Appointments
            </button>
            <button
              onClick={() => setActiveView('records')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'records' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
              <FileText className="text-cyan-400" size={20} />
              Medical Records
            </button>
            <button
              onClick={() => setActiveView('prescriptions')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeView === 'prescriptions' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
            >
              <ClipboardList className="text-cyan-400" size={20} />
              Prescriptions
            </button>
          </nav>

          <div className="mt-auto pt-4 border-t border-gray-700">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white font-medium">
                {doctorAccount.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{doctorAccount.name}</p>
                <p className="text-xs text-gray-400">{doctorAccount.role}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">
                {activeView === 'patients' && 'Patient Management'}
                {activeView === 'appointments' && 'Appointments'}
                {activeView === 'records' && 'Medical Records'}
                {activeView === 'prescriptions' && 'Prescriptions'}
              </h1>
              <p className="text-gray-400">
                {activeView === 'patients' && 'View and manage your patients'}
                {activeView === 'appointments' && 'Upcoming and past appointments'}
                {activeView === 'records' && 'Access complete medical histories'}
                {activeView === 'prescriptions' && 'Create and manage prescriptions'}
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
              
              {/* Account Button */}
              <div className="relative">
                <button 
                  onClick={() => setShowAccountPanel(true)}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white font-medium">
                    {doctorAccount.name.charAt(0)}
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Patients View */}
          {activeView === 'patients' && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Active Patients</h2>
                <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <Plus size={18} />
                  Add New Patient
                </button>
              </div>
              <div className="divide-y divide-gray-700">
                {patients.map((patient) => (
                  <motion.div 
                    key={patient.id} 
                    className="p-6"
                    variants={patientCardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                  >
                    <div 
                      className="flex justify-between items-center cursor-pointer hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
                      onClick={() => togglePatientExpansion(patient.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-cyan-400">
                          <User size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{patient.name}</h3>
                          <p className="text-sm text-gray-400">{patient.age} years • {patient.gender}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">Last visit: {patient.lastVisit}</span>
                        {expandedPatient === patient.id ? 
                          <ChevronDown size={20} className="text-cyan-400" /> : 
                          <ChevronRight size={20} className="text-gray-500" />}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedPatient === patient.id && (
                        <motion.div 
                          className="mt-4 pl-16 overflow-x-hidden"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Patient Details Slider */}
                          <div className="mb-6 w-full max-w-[calc(100vw-24rem)]">
                            <Swiper
                              modules={[Navigation, Pagination]}
                              spaceBetween={20}
                              slidesPerView={1}
                              navigation
                              pagination={{ clickable: true }}
                              className="rounded-lg overflow-hidden"
                              style={{ width: '100%' }}
                            >
                              {/* Contacts Slide */}
                              <SwiperSlide>
                                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Contact className="text-cyan-400" size={20} />
                                    <h4 className="font-medium text-cyan-400">Patient Contacts</h4>
                                  </div>
                                  <div className="space-y-3">
                                    {patient.contacts.map((contact, index) => (
                                      <div key={index} className="bg-gray-800 p-3 rounded border border-gray-700 shadow-xs">
                                        <p className="font-medium text-white">{contact.name}</p>
                                        <p className="text-sm text-gray-400">{contact.relation}</p>
                                        <p className="text-sm text-cyan-400 mt-1">{contact.phone}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </SwiperSlide>

                              {/* Medical History Slide */}
                              <SwiperSlide>
                                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                  <div className="flex items-center gap-2 mb-4">
                                    <History className="text-cyan-400" size={20} />
                                    <h4 className="font-medium text-cyan-400">Medical History</h4>
                                  </div>
                                  <div className="space-y-3">
                                    {patient.records.map((record, index) => (
                                      <div key={index} className="bg-gray-800 p-3 rounded border border-gray-700 shadow-xs">
                                        <div className="flex justify-between">
                                          <span className="font-medium text-white">{record.type}</span>
                                          <span className="text-sm text-gray-500">{record.date}</span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-400">
                                          <p><span className="font-medium">Diagnosis:</span> {record.diagnosis}</p>
                                          <p><span className="font-medium">Treatment:</span> {record.treatment}</p>
                                        </div>
                                        <div className="mt-2 flex justify-end">
                                          <button 
                                            onClick={() => openShareModal(record)}
                                            className="text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                                          >
                                            <Share2 size={14} />
                                            Share Record
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </SwiperSlide>

                              {/* Shared Records Slide */}
                              <SwiperSlide>
                                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Share2 className="text-cyan-400" size={20} />
                                    <h4 className="font-medium text-cyan-400">Shared Records</h4>
                                  </div>
                                  <div className="space-y-3">
                                    {patient.sharedRecords.map((record, index) => (
                                      <div key={index} className="bg-gray-800 p-3 rounded border border-gray-700 shadow-xs">
                                        <p className="font-medium text-white">{record.name}</p>
                                        <p className="text-sm text-gray-400">Shared with: {record.sharedWith}</p>
                                        <p className="text-sm text-cyan-400 mt-1">Date shared: {record.date}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </SwiperSlide>
                            </Swiper>
                          </div>

                          <div className="flex gap-3">
                            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
                              <Stethoscope size={18} />
                              Add Treatment Note
                            </button>
                            <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg border border-gray-600 transition-all">
                              <FileText size={18} />
                              View Full History
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Appointments View */}
          {activeView === 'appointments' && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Today's Appointments</h2>
                <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <Plus size={18} />
                  New Appointment
                </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-700 rounded-lg p-4 hover:border-cyan-400 transition-colors bg-gray-700 shadow-xs">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">John Smith</h3>
                    <span className="text-sm bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded">10:00 AM</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Follow-up for hypertension</p>
                  <div className="flex gap-2">
                    <button className="text-sm bg-cyan-900/30 text-cyan-400 px-3 py-1 rounded hover:bg-cyan-900/40">
                      View Chart
                    </button>
                    <button className="text-sm bg-gray-700 text-gray-300 px-3 py-1 rounded hover:bg-gray-600">
                      Reschedule
                    </button>
                  </div>
                </div>
                <div className="border border-gray-700 rounded-lg p-4 hover:border-cyan-400 transition-colors bg-gray-700 shadow-xs">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">Sarah Johnson</h3>
                    <span className="text-sm bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded">2:30 PM</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Diabetes management</p>
                  <div className="flex gap-2">
                    <button className="text-sm bg-cyan-900/30 text-cyan-400 px-3 py-1 rounded hover:bg-cyan-900/40">
                      View Chart
                    </button>
                    <button className="text-sm bg-gray-700 text-gray-300 px-3 py-1 rounded hover:bg-gray-600">
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button className="flex items-center gap-2 bg-gray-800 border border-cyan-600 text-cyan-400 hover:bg-gray-700 px-4 py-2 rounded-lg shadow-xs hover:shadow-sm transition-all">
              <FileText size={18} />
              New Report
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
              <ClipboardList size={18} />
              Create Prescription
            </button>
          </div>
        </div>
      </div>

      {/* Account Panel Slide */}
      <AnimatePresence>
        {showAccountPanel && (
          <motion.div 
            className="fixed inset-0 z-50"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="absolute inset-0 bg-gray-800 border-l border-gray-700 shadow-2xl p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={() => setShowAccountPanel(false)}
                  className="p-2 rounded-full hover:bg-gray-700"
                >
                  <ArrowLeft size={20} className="text-gray-400" />
                </button>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Account Settings
                </h2>
                <div className="w-8"></div> {/* Spacer for alignment */}
              </div>

              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {doctorAccount.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-white">{doctorAccount.name}</h3>
                <p className="text-gray-400">{doctorAccount.role}</p>
                <p className="text-sm text-cyan-400 mt-1">
                  {doctorAccount.walletAddress}
                </p>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={tempAccount.name}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={tempAccount.email}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Hospital</label>
                    <input
                      type="text"
                      name="hospital"
                      value={tempAccount.hospital}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={tempAccount.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={tempAccount.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={tempAccount.specialization}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Years of Experience</label>
                    <input
                      type="text"
                      name="yearsOfExperience"
                      value={tempAccount.yearsOfExperience}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveChanges}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-colors"
                    >
                      <Save size={18} className="inline mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-300 mb-3">Account Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{doctorAccount.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hospital:</span>
                        <span className="text-white">{doctorAccount.hospital}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white">{doctorAccount.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">License Number:</span>
                        <span className="text-white">{doctorAccount.licenseNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Specialization:</span>
                        <span className="text-white">{doctorAccount.specialization}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Experience:</span>
                        <span className="text-white">{doctorAccount.yearsOfExperience} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wallet Address:</span>
                        <span className="text-cyan-400 font-mono">{doctorAccount.walletAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                      Edit Profile
                    </button>
                    <button
                      onClick={initiateDelete}
                      className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/40 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete Account
                    </button>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-red-400 rounded-lg border border-red-900/30 transition-colors mt-8"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 text-red-500 mr-3">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Delete Account</h3>
                  <p className="text-gray-400">
                    Are you sure you want to delete your account? This action cannot be undone. 
                    All your data will be permanently removed from our servers.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete My Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <div className="text-2xl text-cyan-400">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-medium text-white">{selectedRecord?.type}</p>
                  <p className="text-xs text-gray-400">Date: {selectedRecord?.date}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Share with medical contacts</label>
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
                  <ChevronDown size={18} className={`transition-transform ${showContactsDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showContactsDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {allContacts.map(contact => (
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
                        <div>
                          <p className="font-medium text-sm text-white">{contact.name}</p>
                          <p className="text-xs text-gray-400">{contact.specialty} • {contact.type}</p>
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
                placeholder="Add a note about why you're sharing this record..."
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
  );
};

export default DDashboard;