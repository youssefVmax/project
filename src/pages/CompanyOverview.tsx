import React from "react";
import { motion } from "framer-motion";
import { Users, Award, TrendingUp, Tv, Satellite, Globe, Shield, Building2, BarChart, Radio, Server, Monitor, Film, Headphones, Activity, BookOpen, User, Briefcase, Star, MessageCircle, Phone, Mail, MapPin } from "lucide-react";

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
    {
      name: 'Enterprise Solutions',
      description: 'Custom IPTV solutions for businesses and organizations',
      features: ['Custom Channel Lineups', 'Branded Applications', 'Hotel TV Systems', 'Corporate Communications', 'Digital Signage', 'API Integration'],
      icon: <Server className="w-8 h-8 text-green-600" />,
      color: 'green',
      link: '#enterprise'
    }
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

      {/* Company Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-16"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
              <stat.icon className={`w-8 h-8 text-${stat.color}-600 dark:text-${stat.color}-400`} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</h3>
            <p className="text-slate-600 dark:text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Services */}
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

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 mb-16"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
          Our Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex items-start space-x-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <Award className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <p className="text-slate-700 dark:text-slate-300">{achievement}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Content Offerings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
          Content Library
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Live Sports', icon: Activity, count: '500+ Channels', description: 'All major leagues and events worldwide' },
            { name: 'Movies', icon: Film, count: '50,000+ Titles', description: 'New releases and classic films' },
            { name: 'TV Series', icon: Tv, count: '15,000+ Shows', description: 'Complete seasons and box sets' },
            { name: 'News Channels', icon: Radio, count: '300+ Global', description: '24/7 news coverage from every continent' }
          ].map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 text-center flex flex-col h-full"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.name}</h3>
              <p className="text-2xl text-slate-800 dark:text-slate-200 font-bold mb-3">{item.count}</p>
              <p className="text-slate-600 dark:text-slate-400 mt-auto">{item.description}</p>
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

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-blue-200 dark:border-slate-700"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
          <Building2 className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Join the FlashX Experience
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
          Experience the future of television with our premium IPTV services. Contact us to become a reseller
          or get a personalized demo of our enterprise solutions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg"
          >
            Become a Reseller
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-900 dark:text-white px-8 py-3 rounded-lg font-semibold border border-slate-300 dark:border-slate-600 transition-all duration-200 shadow"
          >
            Request Enterprise Demo
          </motion.button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-center gap-6 text-slate-600 dark:text-slate-400">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <span>+1 (718) 555-0199</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <span>info@flashxgroup.com</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>Brooklyn, New York, USA</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};