import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      title: "NATIVE INTEROPERABILITY",
      subtitle: "Sharing users and liquidity",
      description: "Patient records secured with native, frictionless interoperability through a consistent interface. Enables secure communication and data transfers between healthcare providers across the entire network.",
      image: "/images/f1.png" // Optimized WebP version
    },
    {
      title: "PATIENT-CENTRIC DESIGN",
      subtitle: "With the very best UX",
      description: "Secure one-tap access via biometric authentication, eliminating complex credentials. Modular health wallets at protocol level provide seamless control of medical data through a single interface.",
      image: "/images/f3.png" // Optimized WebP version
    }
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gray-900">
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
      <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-64 md:h-64 rounded-full bg-purple-600/10 blur-3xl animate-float-1"></div>
      <div className="absolute bottom-1/3 right-1/4 w-56 h-56 md:w-72 md:h-72 rounded-full bg-blue-600/10 blur-3xl animate-float-2"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Key Features
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Revolutionizing healthcare through decentralized technology
          </p>
        </div>

        {features.map((feature, index) => (
          <div 
            key={index} 
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12 mb-20 md:mb-32`}
          >
            {/* Image container with optimized settings */}
            <div className="w-full md:w-1/2 relative group">
              <div className={`absolute -inset-2 md:-inset-4 bg-gradient-to-br ${index % 2 === 0 ? 'from-purple-600/10 to-blue-600/10' : 'from-blue-600/10 to-teal-600/10'} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
              <div className="relative overflow-hidden rounded-xl border border-gray-700/50 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                <img 
                  src={feature.image}
                  alt={feature.title}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            
            {/* Text content */}
            <div className="w-full md:w-1/2 px-2 sm:px-0">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                {feature.title}
              </h3>
              <h4 className="text-lg md:text-xl text-gray-400 font-medium mb-4 md:mb-6">
                {feature.subtitle}
              </h4>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-4 md:mb-6">
                {feature.description}
              </p>
              <div className={`h-1 w-12 md:w-16 ${index % 2 === 0 ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gradient-to-r from-blue-500 to-teal-500'} transition-all duration-300 group-hover:w-16 md:group-hover:w-20`}></div>
            </div>
          </div>
        ))}
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
    </section>
  );
};

export default FeaturesSection;