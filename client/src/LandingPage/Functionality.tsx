import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Users, Target, BarChart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Functionality: React.FC = () => {
  const features: FeatureItem[] = [
    {
      icon: <PieChart size={28} strokeWidth={2} />,
      title: "Market Analysis",
      description: "Deep market insights powered by AI",
      delay: 0.3
    },
    {
      icon: <BarChart size={28} strokeWidth={2} />,
      title: "TAM/SAM Assessment",
      description: "Calculate your addressable market",
      delay: 0.4
    },
    {
      icon: <Users size={28} strokeWidth={2} />,
      title: "Competition Analysis",
      description: "Understand your competitive landscape",
      delay: 0.5
    },
    {
      icon: <Target size={28} strokeWidth={2} />,
      title: "Go-to-Market Strategy",
      description: "Actionable strategies for launch",
      delay: 0.6
    }
  ];

  return (
    <section className="py-24 relative w-full overflow-hidden bg-black">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left Column */}
          <motion.div
            className="lg:w-1/2 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-5xl md:text-6xl font-black leading-tight text-white">
              Analyze and Validate Ideas
            </h2>

            <p className="font-body text-xl text-gray-500 leading-relaxed max-w-xl">
              Transform your startup concepts into data-backed business plans with comprehensive market research and competitive intelligence.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/validate-idea"
                className="group px-8 py-3 bg-white hover:bg-gray-200 rounded-lg text-black font-bold transition-all duration-200 flex items-center gap-2"
              >
                Validate Your Idea
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/my-ideas"
                className="px-8 py-3 bg-transparent hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-lg text-white font-bold transition-all duration-200"
              >
                View My Ideas
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Feature Cards */}
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
              >
                <div className="space-y-3">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Functionality;
