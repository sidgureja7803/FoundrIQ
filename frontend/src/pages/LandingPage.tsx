/**
 * Landing Page
 * Modern, engaging landing page showcasing the platform's capabilities
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Brain, 
  Lightbulb,
  ChevronRight, 
  BarChart3, 
  Users, 
  Sparkles, 
  Zap,
  LucideIcon,
  ArrowRight,
  LineChart,
  PieChart,
  Target,
  CheckCircle,
  Code,
  MessageSquare
} from 'lucide-react';

// Tech stack logos
import tavily from '../assets/images/tavily.svg';
import gemini from '../assets/images/gemini.svg';
import clerk from '../assets/images/clerk.svg';
import langchain from '../assets/images/langchain.svg';
import openai from '../assets/images/openai.svg';

const LandingPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef);
  
  // Parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  
  // Agent animation states
  const [activeAgent, setActiveAgent] = useState(0);
  const agentTypes = [
    { name: 'Market Analysis Agent', icon: BarChart3, color: 'bg-blue-500' },
    { name: 'TAM/SAM Analysis Agent', icon: PieChart, color: 'bg-green-500' },
    { name: 'Competitive Landscape Agent', icon: Users, color: 'bg-purple-500' },
    { name: 'Feasibility Assessment Agent', icon: Target, color: 'bg-amber-500' },
    { name: 'Strategic Recommendations Agent', icon: Sparkles, color: 'bg-pink-500' }
  ];
  
  // Cycle through agents for animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % agentTypes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Technology cards
  const technologies = [
    {
      name: 'Gemini Pro',
      logo: gemini,
      description: 'Advanced generative AI for creative ideation and market insights',
      color: 'from-blue-500 to-teal-400'
    },
    {
      name: 'LangChain',
      logo: langchain,
      description: 'Orchestrates multi-agent workflows and complex reasoning chains',
      color: 'from-emerald-500 to-teal-400'
    },
    {
      name: 'Tavily',
      logo: tavily,
      description: 'AI-powered research for accurate, up-to-date market intelligence',
      color: 'from-purple-500 to-indigo-400'
    },
    {
      name: 'Clerk',
      logo: clerk, 
      description: 'Secure, seamless authentication and user management',
      color: 'from-rose-500 to-pink-400'
    },
    {
      name: 'OpenAI',
      logo: openai,
      description: 'Powers strategic recommendations and competitive analysis',
      color: 'from-gray-700 to-gray-500'
    }
  ];

  // Feature card component
  const FeatureCard = ({ icon: Icon, title, description }: { icon: LucideIcon, title: string, description: string }) => (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="rounded-full w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 mb-4">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );

  // Process step component
  const ProcessStep = ({ number, title, description }: { number: number, title: string, description: string }) => (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <motion.div 
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800"
        style={{ y }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute w-96 h-96 rounded-full bg-blue-100 dark:bg-blue-900/20 opacity-40 dark:opacity-20 blur-3xl"
            animate={{ 
              x: [0, 100, 0], 
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: '10%', left: '15%' }}
          />
          <motion.div 
            className="absolute w-80 h-80 rounded-full bg-purple-100 dark:bg-purple-900/20 opacity-30 dark:opacity-20 blur-3xl"
            animate={{ 
              x: [0, -80, 0], 
              y: [0, 120, 0],
              scale: [1, 1.1, 1], 
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: '30%', right: '10%' }}
          />
        </div>

        <div className="container px-4 mx-auto text-center z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Brain className="h-16 w-16 text-blue-600" />
                <Lightbulb className="h-8 w-8 text-yellow-500 absolute -top-1 -right-1" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-blue-800">
              The Idea Hub
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-700 dark:text-gray-300">
              Transform your startup ideas with AI-powered analysis across market fit, TAM/SAM, competitive landscape, feasibility, and strategic recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/sign-up">
                <motion.button
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/sign-in">
                <motion.button
                  className="px-8 py-4 bg-transparent border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full font-medium text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image/Animation */}
          <motion.div
            className="relative max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-2">
                <div className="flex space-x-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <div className="flex items-center justify-center">
                    {/* Animated Agent Graph */}
                    <div className="relative w-full h-80">
                      {/* Central AI Brain */}
                      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <motion.div 
                          className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Brain className="h-10 w-10 text-white" />
                        </motion.div>
                      </div>

                      {/* Agent Nodes */}
                      {agentTypes.map((agent, index) => {
                        const angle = (index * (2 * Math.PI)) / agentTypes.length;
                        const x = Math.cos(angle) * 120;
                        const y = Math.sin(angle) * 120;
                        const Icon = agent.icon;
                        
                        return (
                          <motion.div
                            key={index}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2`}
                            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                            animate={{ 
                              scale: activeAgent === index ? 1.2 : 1,
                              boxShadow: activeAgent === index ? '0 8px 16px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            <div className={`w-16 h-16 rounded-full ${agent.color} flex items-center justify-center shadow-lg`}>
                              <Icon className="h-8 w-8 text-white" />
                            </div>
                            
                            {/* Connection lines */}
                            <div className="absolute left-1/2 top-1/2 w-[120px] h-[1px] bg-blue-300 dark:bg-blue-700 origin-left"
                              style={{ transform: `rotate(${angle + Math.PI}rad)` }}></div>
                            
                            {/* Agent label */}
                            <motion.div
                              className="absolute mt-2 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300"
                              animate={{ opacity: activeAgent === index ? 1 : 0.6 }}
                            >
                              {agent.name}
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <a href="#how-it-works" className="flex flex-col items-center text-gray-500 hover:text-blue-600">
              <p className="text-sm mb-2">Learn More</p>
              <ChevronRight size={24} className="transform rotate-90" />
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              How The Idea Hub Works
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Our platform uses cutting-edge AI agents and technologies to provide comprehensive analysis of your startup ideas.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="space-y-8">
                <ProcessStep
                  number={1}
                  title="Submit Your Idea"
                  description="Share your startup concept with details about target market, value proposition, and business model."
                />
                <ProcessStep
                  number={2}
                  title="AI Agent Analysis"
                  description="Our five specialized AI agents analyze different aspects of your idea using real-time data and advanced AI models."
                />
                <ProcessStep
                  number={3}
                  title="Comprehensive Report"
                  description="Receive a detailed report with visualizations, market insights, and strategic recommendations."
                />
                <ProcessStep
                  number={4}
                  title="Iterate and Improve"
                  description="Use the insights to refine your idea and run additional analyses to track improvements."
                />
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Workflow Visualization */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-6 space-y-6">
                  {/* Step 1: Input */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">1</div>
                      User Input
                    </h4>
                    <div className="flex items-center gap-3">
                      <MessageSquare size={16} className="text-gray-500" />
                      <div className="text-sm text-gray-600 dark:text-gray-300">Innovative delivery drone service for urban areas</div>
                    </div>
                  </div>

                  {/* Step 2: Processing */}
                  <div>
                    <div className="flex justify-center">
                      <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold">2</div>
                        AI Processing
                      </h4>
                      <div className="grid grid-cols-5 gap-2">
                        {agentTypes.map((agent, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full ${agent.color} flex items-center justify-center mb-1`}>
                              <agent.icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-xs text-center text-gray-500">{agent.name.split(' ')[0]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Output */}
                  <div>
                    <div className="flex justify-center">
                      <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center text-xs font-bold">3</div>
                        Results
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <LineChart size={14} className="text-blue-500" />
                          <span>Market Growth: 24% CAGR</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <PieChart size={14} className="text-green-500" />
                          <span>TAM: $8.4B / SAM: $1.2B</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Target size={14} className="text-amber-500" />
                          <span>Feasibility Score: 82/100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Powered by Cutting-Edge Technology
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              We leverage the best AI models and frameworks to deliver accurate, comprehensive analyses.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className={`h-3 bg-gradient-to-r ${tech.color}`}></div>
                <div className="p-6">
                  <div className="mb-4 h-16 flex items-center">
                    <img src={tech.logo} alt={tech.name} className="h-12 object-contain" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{tech.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{tech.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Key Features
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Brain}
              title="Multi-Agent Analysis"
              description="Five specialized AI agents collaborate to analyze different aspects of your business idea."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Market Intelligence"
              description="Real-time market data and trend analysis with accurate TAM and SAM calculations."
            />
            <FeatureCard 
              icon={Users}
              title="Competitive Analysis"
              description="Detailed breakdown of market competitors and differentiation opportunities."
            />
            <FeatureCard 
              icon={Target}
              title="Feasibility Scoring"
              description="Quantitative assessment of technical, operational, and financial feasibility."
            />
            <FeatureCard 
              icon={LineChart}
              title="Advanced Visualizations"
              description="Interactive charts and visual data representations for clear insights."
            />
            <FeatureCard 
              icon={Sparkles}
              title="Strategic Recommendations"
              description="AI-generated strategies and actionable next steps for your business."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Ready to Validate Your Startup Idea?
            </motion.h2>
            <motion.p
              className="text-xl mb-10 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Join thousands of entrepreneurs using AI-powered analysis to build successful startups.
            </motion.p>

            <Link to="/sign-up">
              <motion.button
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-medium text-lg flex items-center gap-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Get Started Today <ArrowRight size={18} />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
