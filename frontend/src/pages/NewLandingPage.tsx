/**
 * New Landing Page
 * Enhanced landing page with chatbot, agent workflow visualization, and report download features
 */

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Brain, 
  Lightbulb,
  ChevronRight, 
  ArrowRight,
  MessageSquare, 
  Users,
  LineChart,
  FileText,
  Check,
  Info,
  LucideIcon,
  Eye
} from 'lucide-react';

// Import our new components
import ChatBot from '../components/ChatBot';
import AgentWorkflow from '../components/AgentWorkflow';
import ReportDownload from '../components/ReportDownload';

// Feature card component types
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Feature card component
const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
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

// Tech stack logos
import tavily from '../assets/images/tavily.svg';
import gemini from '../assets/images/gemini.svg';
import clerk from '../assets/images/clerk.svg';
import langchain from '../assets/images/langchain.svg';
import openai from '../assets/images/openai.svg';

const NewLandingPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  useInView(heroRef);
  
  // Parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);

  // Tabs for user dashboard
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { name: 'Getting Started', icon: Info },
    { name: 'Agent Pipeline', icon: Brain },
    { name: 'Reports & Analysis', icon: FileText },
    { name: 'Ask Questions', icon: MessageSquare }
  ];

  // Feature card component
  // No feature card component here - moved outside the parent component

  return (
    <div className="overflow-x-hidden">
      {/* Chatbot component - floating on all pages */}
      <ChatBot />
      
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
              FoundrIQ
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

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-6">
                <div className="flex space-x-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">Transforming How Startups Are Built</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Our AI-powered platform analyzes, validates and refines your startup ideas in minutes instead of months.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                          <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm">8 AI Agents</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
                          <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-sm">5-Tab Analysis</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3">
                          <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="text-sm">Exportable Reports</p>
                      </div>
                    </div>
                    
                    <motion.div
                      className="flex justify-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to="/idea-submission" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-base">
                        Analyze My Idea <ArrowRight size={16} />
                      </Link>
                    </motion.div>
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

      {/* Agent Workflow Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
        <AgentWorkflow />
      </section>

      {/* Report Download Section */}
      <section id="reports" className="py-20 bg-gray-50 dark:bg-gray-800">
        <ReportDownload />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Powerful Features For Founders
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Everything you need to validate and refine your startup idea, powered by AI.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Brain}
              title="AI-Powered Analysis"
              description="Multi-agent workflow orchestration using LangChain and LangGraph for comprehensive market insights."
            />
            <FeatureCard
              icon={LineChart}
              title="Market Sizing"
              description="Accurate TAM/SAM/SOM calculations to understand your market opportunity and potential."
            />
            <FeatureCard
              icon={Users}
              title="Competition Analysis"
              description="Detailed competitor mapping with strength/weakness assessments and market positioning."
            />
            <FeatureCard
              icon={Eye}
              title="Cultural Alignment"
              description="Analyze how well your idea aligns with cultural trends and consumer preferences."
            />
            <FeatureCard
              icon={MessageSquare}
              title="Interactive Chatbot"
              description="Ask questions and get immediate answers about your startup analysis and reports."
            />
            <FeatureCard
              icon={FileText}
              title="Downloadable Reports"
              description="Export comprehensive reports in PDF and Markdown formats for sharing and presentations."
            />
          </div>
        </div>
      </section>

      {/* Post-Login Dashboard Preview */}
      <section id="dashboard-preview" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Your Insight Dashboard
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              After you sign up, explore our comprehensive dashboard to understand how everything works.
            </motion.p>
          </div>

          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Dashboard tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex overflow-x-auto">
                  {tabs.map((tab, tabIndex) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.name}
                        className={`px-4 py-3 flex items-center gap-2 text-sm font-medium whitespace-nowrap ${
                          activeTab === tabIndex
                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                        onClick={() => setActiveTab(tabIndex)}
                      >
                        <Icon size={16} />
                        {tab.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-6">
                {activeTab === 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Welcome to FoundrIQ</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Get started by submitting your startup idea for a comprehensive AI-powered analysis.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Info size={18} className="text-blue-500" />
                          How it Works
                        </h4>
                        <ol className="list-decimal list-inside text-sm text-gray-600 dark:text-gray-300 space-y-2">
                          <li>Submit your startup idea with details</li>
                          <li>Our AI agents analyze various aspects</li>
                          <li>Review your comprehensive report</li>
                          <li>Download or share your results</li>
                          <li>Iterate and refine your concept</li>
                        </ol>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Check size={18} className="text-green-500" />
                          What You'll Get
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-2">
                          <li>Market size and opportunity assessment</li>
                          <li>Competitive landscape analysis</li>
                          <li>Cultural alignment insights</li>
                          <li>Technical and financial feasibility</li>
                          <li>Strategic recommendations</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                      <motion.div
                        className="inline-block"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link to="/idea-submission" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-base flex items-center gap-2">
                          Submit Your Idea <ArrowRight size={16} />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                )}
                
                {activeTab === 1 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Agent Pipeline</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      See how our 8 specialized AI agents work together to analyze your startup idea.
                    </p>
                    
                    <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">
                        [Agent pipeline visualization - sign up to see the full interactive version]
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 2 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Reports & Analysis</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      After analysis, you'll get comprehensive reports with visualizations and strategic recommendations.
                    </p>
                    
                    <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">
                        [Report preview - sign up to see the full dashboard]
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 3 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Ask Questions</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Use our AI chatbot to ask questions about your startup analysis and reports.
                    </p>
                    
                    <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">
                        [Chatbot interface - sign up to use the full interactive version]
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
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
              Powered By Cutting-Edge Technology
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Built with modern tech for reliable, accurate startup analysis.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { id: 'gemini', name: 'Gemini Pro', logo: gemini },
              { id: 'langchain', name: 'LangChain', logo: langchain },
              { id: 'tavily', name: 'Tavily', logo: tavily },
              { id: 'clerk', name: 'Clerk', logo: clerk },
              { id: 'openai', name: 'OpenAI', logo: openai }
            ].map((tech, techIndex) => (
              <motion.div
                key={tech.id}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: techIndex * 0.1 }}
              >
                <div className="w-20 h-20 mb-4 flex items-center justify-center">
                  <img src={tech.logo} alt={tech.name} className="max-w-full max-h-full" />
                </div>
                <p className="text-center font-medium">{tech.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Validate Your Startup Idea?</h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Join thousands of founders who've used FoundrIQ to refine their concepts and build better startups.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/sign-up">
                <motion.button
                  className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-full font-medium text-lg flex items-center gap-2 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started - Free <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/sign-in">
                <motion.button
                  className="px-8 py-4 bg-transparent border border-white hover:bg-white/10 text-white rounded-full font-medium text-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In <ChevronRight size={18} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ... */}
      <footer className="py-12 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-bold">FoundrIQ</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                AI-powered startup idea analysis and validation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li><a href="#how-it-works" className="hover:text-blue-600">AI Analysis</a></li>
                <li><a href="#reports" className="hover:text-blue-600">Reports</a></li>
                <li><a href="#features" className="hover:text-blue-600">Features</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-blue-600">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li><Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-300 text-sm">
            <p>&copy; {new Date().getFullYear()} FoundrIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLandingPage;
