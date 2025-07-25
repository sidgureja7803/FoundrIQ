import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Lightbulb, 
  Search, 
  Users, 
  Target, 
  BarChart3, 
  Rocket,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "Market Research",
      description: "Real-time market analysis using Tavily's search capabilities to understand current trends and opportunities."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "TAM/SAM/SOM Analysis",
      description: "Comprehensive market sizing with Total, Serviceable, and Obtainable market calculations."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Cultural Alignment",
      description: "Qloo AI integration to assess how well your idea aligns with current consumer preferences and trends."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Competition Analysis",
      description: "Identify competitors, analyze their strategies, and discover market gaps and opportunities."
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Feasibility Assessment",
      description: "Evaluate technical requirements, risks, regulations, and capital needs for your startup idea."
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Strategy Recommendations",
      description: "Get personalized go-to-market strategies, monetization models, and partnership suggestions."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Submit Your Idea",
      description: "Describe your startup concept and select relevant categories"
    },
    {
      number: "02", 
      title: "AI Analysis",
      description: "Our agents analyze market trends, competition, and feasibility"
    },
    {
      number: "03",
      title: "Get Insights",
      description: "Receive comprehensive analysis across 5 key dimensions"
    },
    {
      number: "04",
      title: "Download Report",
      description: "Export your complete validation report as PDF or Markdown"
    }
  ];

  const apiLogos = [
    { name: "Gemini", description: "AI Reasoning & Synthesis" },
    { name: "Tavily", description: "Real-time Market Research" },
    { name: "Qloo", description: "Cultural Intelligence" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Brain className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                <Lightbulb className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Validate Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Startup Ideas
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered platform that helps aspiring founders analyze and validate their startup ideas using 
              real-time market research, cultural alignment insights, and competitive intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/submit"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Validation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* API Partners Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-8">
              Powered by Leading AI APIs
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {apiLogos.map((api, index) => (
                <motion.div
                  key={api.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800"
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {api.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    {api.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Startup Analysis
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI agents work together to provide deep insights across every aspect of your startup idea
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get comprehensive startup validation in 4 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-full mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Validate Your Startup Idea?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who trust our AI-powered analysis to make informed decisions about their startup ventures.
            </p>
            <Link
              to="/submit"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
