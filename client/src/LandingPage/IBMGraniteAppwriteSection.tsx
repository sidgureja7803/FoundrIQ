import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Server, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const PerplexityAppwriteSection: React.FC = () => {
  const technologies = [
    {
      name: 'Perplexity AI',
      logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png',
      description: 'Advanced AI reasoning with state-of-the-art language models.',
      details: 'Real-time web search and deep research capabilities powered by cutting-edge AI technology.'
    },
    {
      name: 'Appwrite',
      logo: 'https://appwrite.io/images/logos/appwrite.svg',
      description: 'Secure, scalable backend infrastructure.',
      details: 'Authentication, database, and storage managed by Appwrite Cloud for enterprise-grade reliability.'
    },
  ];

  const features = [
    {
      icon: <Zap size={24} />,
      title: 'Perplexity AI',
      description: 'Advanced AI models deliver accurate startup insights with real-time data.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Enterprise Security',
      description: 'Appwrite provides secure authentication and data management.'
    },
    {
      icon: <Server size={24} />,
      title: 'Tavily Search',
      description: 'Real-time market intelligence powered by advanced web search.'
    },
    {
      icon: <Code size={24} />,
      title: 'Open Architecture',
      description: 'API-first design lets you integrate with existing systems.'
    },
  ];

  return (
    <section className="py-24 relative w-full overflow-hidden bg-black">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-5xl md:text-6xl font-black mb-6 text-white">
              Powered by Leading AI Technology
            </h2>
          </motion.div>

          <motion.p
            className="font-body text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            We've partnered with Perplexity AI and Appwrite to deliver the most powerful startup validation platform available.
          </motion.p>
        </div>

        {/* Core Technologies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              className="p-8 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0 p-4 rounded-lg bg-white/10 flex items-center justify-center min-w-[80px] h-20">
                  <img src={tech.logo} alt={tech.name} className="h-12 w-auto object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black mb-3 text-white">{tech.name}</h3>
                  <p className="text-gray-400 mb-2 leading-relaxed">{tech.description}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{tech.details}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="p-6 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="space-y-3">
                <div className="text-white">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-white">{feature.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legal Links */}
        <div className="text-center">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-6 text-white">Legal & Privacy</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/privacy" className="text-gray-400 hover:text-white font-medium transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/terms" className="text-gray-400 hover:text-white font-medium transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/terms" className="text-gray-400 hover:text-white font-medium transition-colors">
                Cookie Policy
              </Link>
            </div>
          </motion.div>

          <p className="text-gray-600 text-sm max-w-2xl mx-auto leading-relaxed">
            By using FoundrIQ, you agree to our Terms of Service and Privacy Policy. We use Perplexity AI and Appwrite
            technologies to provide our services. All data is processed according to our data processing guidelines.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PerplexityAppwriteSection;
