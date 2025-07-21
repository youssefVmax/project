import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Tv, Satellite, Users, Globe, Award, TrendingUp, Shield } from 'lucide-react';
import { dataStore } from '../utils/dataStore';
import { useEffect } from 'react';

export const CompanyOverview: React.FC = () => {
  const services = [
    {
      name: 'VMax IPTV',
      description: 'Premium IPTV streaming service with 4K quality and global content',
      features: ['4K Ultra HD Streaming', '10,000+ Channels', 'Global Content', '24/7 Support'],
      icon: Tv,
      color: 'blue'
    },
    {
      name: 'SkyLive TV',
      description: 'Advanced satellite TV solutions with cutting-edge technology',
      features: ['Satellite Broadcasting', 'HD Quality', 'Multi-Device Support', 'Live Sports'],
      icon: Satellite,
      color: 'purple'
    }
  ];

  const stats = [
    { label: 'Active Subscribers', value: '500K+', icon: Users, color: 'blue' },
    { label: 'Countries Served', value: '50+', icon: Globe, color: 'green' },
    { label: 'Years of Experience', value: '15+', icon: Award, color: 'purple' },
    { label: 'Uptime Guarantee', value: '99.9%', icon: Shield, color: 'orange' }
  ];

  const achievements = [
    'Leading IPTV provider in the Middle East',
    'Award-winning customer service',
    'ISO 27001 certified for security',
    'Partnership with major content providers',
    'Advanced CDN infrastructure',
    '24/7 technical support'
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Building2 className="w-16 h-16 text-blue-600" />
          <div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white">
              VMax Company
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mt-2">
              Premium IPTV & Satellite TV Solutions
            </p>
          </div>
        </div>
      </motion.div>

      {/* Company Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
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
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
          Our Services
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-${service.color}-100 dark:bg-${service.color}-900/30 flex items-center justify-center`}>
                  <service.icon className={`w-8 h-8 text-${service.color}-600 dark:text-${service.color}-400`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{service.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{service.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-${service.color}-500`}></div>
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Company Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto">
            To revolutionize the entertainment industry by providing cutting-edge IPTV and satellite TV solutions 
            that deliver exceptional viewing experiences to customers worldwide. We are committed to innovation, 
            quality, and customer satisfaction in everything we do.
          </p>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
          Key Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
            >
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-slate-700 dark:text-slate-300">{achievement}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mt-12 text-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Ready to Transform Your Entertainment Experience?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Contact our sales team to learn more about our premium IPTV and satellite TV solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Contact Sales
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-900 dark:text-white px-8 py-3 rounded-lg font-semibold border border-slate-300 dark:border-slate-600 transition-all duration-200"
          >
            Request Demo
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};