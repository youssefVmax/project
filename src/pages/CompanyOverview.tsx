import React from "react";
import { motion } from "framer-motion";
import { Users, Award, TrendingUp, Tv, Satellite, Globe, Shield, Building2, BarChart, Radio, Server, Monitor, Film, Headphones, Activity, BookOpen, User, Briefcase, Star, MessageCircle, Phone, Mail, MapPin, Trophy, Diamond, Sparkles, Crown } from "lucide-react";

export const CompanyOverview: React.FC = () => {
  const services = [
    {
      name: 'VMax IPTV',
      description: 'Premium IPTV streaming service with 4K quality and global content',
      features: ['4K Ultra HD Streaming', '10,000+ Channels', 'Global Content', '24/7 Support', 'Multi-device Compatibility', 'Catch-up TV'],
      icon: <Tv className="w-8 h-8 text-blue-600" />,
      color: 'blue',
      link: 'https://vmaxllc.us/'
    },
    {
      name: 'SkyLive TV',
      description: 'Advanced satellite TV solutions with cutting-edge technology',
      features: ['Satellite Broadcasting', 'HD Quality', 'Multi-Device Support', 'Live Sports', 'PVR Functionality', 'Interactive TV'],
      icon: <Satellite className="w-8 h-8 text-purple-600" />,
      color: 'purple',
      link: 'https://skylivellc.us/'
    },


  ];

  const stats = [
    { label: 'Active Subscribers', value: '1.8M+', icon: Users, color: 'blue' },
    { label: 'Countries Served', value: '150+', icon: Globe, color: 'green' },
    { label: 'Content Channels', value: '25K+', icon: Tv, color: 'purple' },
    { label: 'Uptime Guarantee', value: '99.99%', icon: Shield, color: 'orange' },
    { label: 'Reseller Partners', value: '500+', icon: Briefcase, color: 'cyan' },
    { label: 'Content Providers', value: '100+', icon: Film, color: 'pink' }
  ];
  
  const leadership = [
    {
      name: "Nour Eskandr",
      title: "CEO & Founder",
      bio: "Visionary leader with 10+ years in media technology. Nour has driven FlashX's expansion to 150+ countries through innovative strategies and partnerships.",
      contact: "nour.eskandr@flashxtv.com",
      color: "from-purple-600 to-indigo-700",
      achievements: [
        "Led company through 300% growth in 3 years",
        "Recipient of Media Innovation Award 2023",
        "Pioneered FlashX's global expansion strategy",
        "Established key partnerships with content providers"
      ]
    },
    {
      name: "Hassan Ahmed",
      title: "CTO & Technical Director",
      bio: "Technology expert with deep expertise in streaming infrastructure. Hassan has architected FlashX's award-winning platform serving 1.8M+ subscribers.",
      contact: "hassan.ahmed@flashxtv.com",
      color: "from-blue-600 to-cyan-500",
      achievements: [
        "Developed proprietary adaptive streaming technology",
        "Built global CDN with 200+ edge locations",
        "Implemented advanced DRM solutions",
        "Led development of VMax and SkyLive platforms"
      ]
    }
  ];
  
  const achievements = [
    'Middle East\'s fastest growing IPTV provider (2024)',
    'Award-winning streaming technology',
    'ISO 27001 certified security infrastructure',
    'Partnerships with major content providers',
    'Global CDN with 200+ edge locations',
    '24/7 multilingual customer support',
    'Featured in Streaming Media Magazine',
    'Recognized for innovation at CES 2023'
  ];

  const technologies = [
    { name: 'Adaptive Bitrate Streaming', icon: Activity },
    { name: 'Global Content Delivery Network', icon: Globe },
    { name: 'Advanced DRM Security', icon: Shield },
    { name: 'Electronic Program Guide (EPG)', icon: BookOpen },
    { name: 'Multi-Device Compatibility', icon: Monitor },
    { name: 'Video on Demand (VOD)', icon: Film },
    { name: 'Cloud DVR Technology', icon: Server },
    { name: 'AI-Powered Recommendations', icon: Headphones }
  ];

  return (
    <div className="p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 py-8"
      >
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4 mb-4">
            <Building2 className="w-16 h-16 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              FlashX Group
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mt-2">
              Global Leader in IPTV & Streaming Solutions
            </p>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mt-6"
        >
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
            Since 2015, FlashX has been revolutionizing the entertainment industry with cutting-edge 
            IPTV technology, delivering premium content to over 1.8 million subscribers worldwide through 
            our flagship brands <span className="font-semibold text-blue-600">VMax IPTV</span> and <span className="font-semibold text-purple-600">SkyLive TV</span>.
          </p>
          
          <div className="flex items-center justify-center mt-4 text-slate-600 dark:text-slate-400">
            <MapPin className="w-5 h-5 mr-2" />
            <span>Headquarters: Brooklyn, New York, USA</span>
          </div>
        </motion.div>
      </motion.div>


      {/* Services */}
      {/* Our Brands & Services Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
          Our Brands & Services
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            {
              name: "IBO Player",
              description: "Premium IPTV service for sports enthusiasts",
              features: [
                "Live Sports Channels", 
                "4K Quality Streaming", 
                "Multi-Device Support"
              ],
              link: "#",
              color: "blue",
              icon: <Trophy className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            },
            {
              name: "IBO Pro",
              description: "Professional streaming solutions for businesses",
              features: [
                "Enterprise-grade reliability",
                "Custom channel packages",
                "24/7 Technical Support"
              ],
              link: "#",
              color: "purple",
              icon: <Diamond className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            },
            {
              name: "Smarters TV",
              description: "User-friendly streaming experience for all",
              features: [
                "Intuitive interface",
                "Multi-language support",
                "Parental controls"
              ],
              link: "#",
              color: "green",
              icon: <Sparkles className="w-8 h-8 text-green-600 dark:text-green-400" />
            }
          ].map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl ${
                  service.color === 'blue' 
                    ? 'bg-blue-100 dark:bg-blue-900/30' 
                    : service.color === 'purple'
                      ? 'bg-purple-100 dark:bg-purple-900/30'
                      : 'bg-green-100 dark:bg-green-900/30'
                } flex items-center justify-center`}>
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{service.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{service.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 mb-6 flex-grow">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      service.color === 'blue' 
                        ? 'bg-blue-500' 
                        : service.color === 'purple'
                          ? 'bg-purple-500'
                          : 'bg-green-500'
                    }`}></div>
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <motion.a
                href={service.link}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-auto px-4 py-2 rounded-lg font-medium text-center ${
                  service.color === 'blue' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                    : service.color === 'purple'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                      : 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                }`}
              >
                Learn More
              </motion.a>
            </motion.div>
          ))}
        </div>
      </motion.div>
            {/* Our Brands & Services Section */}
            <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
          Our Premium Service Tiers
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Gold Tier",
              description: "Exclusive VIP experience with premium features",
              features: [
                "4K Ultra HD Streaming", 
                "All Sports & PPV Events", 
                "Multi-Device (5 Devices)",
                "24/7 Dedicated Support",
                "Advanced DVR Functionality"
              ],
              link: "#",
              color: "gold",
              icon: <Crown className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            },
            {
              name: "Silver Tier",
              description: "Enhanced experience with premium channels",
              features: [
                "Full HD Streaming Quality", 
                "All Entertainment Channels", 
                "Multi-Device (3 Devices)",
                "Priority Support",
                "Basic DVR Functionality"
              ],
              link: "#",
              color: "silver",
              icon: <Award className="w-8 h-8 text-gray-400 dark:text-gray-300" />
            },
            {
              name: "Premium Tier",
              description: "Premium experience at an affordable price",
              features: [
                "HD Streaming Quality", 
                "Popular Sports & Entertainment", 
                "Multi-Device (2 Devices)",
                "Standard Support",
                "On-Demand Content"
              ],
              link: "#",
              color: "blue",
              icon: <Star className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            }
          ].map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Tier badge */}
              <div className={`absolute top-0 right-0 px-6 py-1 font-bold text-white ${
                service.color === 'gold' 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' 
                  : service.color === 'silver'
                    ? 'bg-gradient-to-r from-gray-400 to-gray-600'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
              } rounded-bl-lg`}>
                {service.name.split(' ')[0]}
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl ${
                  service.color === 'gold' 
                    ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                    : service.color === 'silver'
                      ? 'bg-gray-100 dark:bg-gray-900/30'
                      : 'bg-blue-100 dark:bg-blue-900/30'
                } flex items-center justify-center`}>
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{service.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{service.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 mb-6 flex-grow">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      service.color === 'gold' 
                        ? 'bg-yellow-500' 
                        : service.color === 'silver'
                          ? 'bg-gray-400'
                          : 'bg-blue-500'
                    }`}></div>
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <motion.a
                href={service.link}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-auto px-4 py-3 rounded-lg font-bold text-center ${
                  service.color === 'gold' 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' 
                    : service.color === 'silver'
                      ? 'bg-gradient-to-r from-gray-500 to-gray-700 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                }`}
              >
                Get {service.name.split(' ')[0]}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
          Our Companies 
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-${service.color}-100 dark:bg-${service.color}-900/30 flex items-center justify-center`}>
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{service.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{service.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 mb-6 flex-grow">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-${service.color}-500`}></div>
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <motion.a
                href={service.link}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-auto bg-gradient-to-r from-${service.color}-600 to-${service.color}-700 text-white px-4 py-2 rounded-lg font-medium text-center`}
              >
                Learn More
              </motion.a>
            </motion.div>
          ))}
        </div>
      </motion.div>
      {/* Technology Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-16"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Our Technology</h2>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto">
            FlashX leverages cutting-edge technology to deliver seamless streaming experiences across all platforms
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 mb-3 flex items-center justify-center bg-blue-500/20 rounded-lg">
                <tech.icon className="w-8 h-8" />
              </div>
              <h3 className="font-semibold">{tech.name}</h3>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Leadership */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-4">
          Leadership Team
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 text-center mb-12 max-w-3xl mx-auto">
          Meet the visionary leaders driving FlashX's innovation and global expansion
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {leadership.map((leader, index) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + index * 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className={`bg-gradient-to-r ${leader.color} p-6`}>
                <div className="flex items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{leader.name}</h3>
                    <p className="text-blue-100">{leader.title}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-slate-700 dark:text-slate-300 mb-6">
                  {leader.bio}
                </p>
                
                <div className="flex items-center mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <span className="text-slate-700 dark:text-slate-300">{leader.contact}</span>
                </div>
                
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  Key Achievements
                </h4>
                <ul className="space-y-2">
                  {leader.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                      <span className="text-slate-700 dark:text-slate-300">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center text-blue-600 dark:text-blue-400"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span>Send Message</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
          >
            View Full Leadership Team
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};