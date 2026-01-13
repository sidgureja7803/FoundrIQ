import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Cpu, Award, ArrowRight } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const Agents: React.FC = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: "Describe Your Idea",
      description: "Share your business concept. Our AI asks smart questions to understand your vision.",
      icon: <MessageSquare className="w-8 h-8 text-white" strokeWidth={2} />,
      delay: 0.2
    },
    {
      number: 2,
      title: "AI Analysis",
      description: "Watch real-time deep research powered by Perplexity AI and competitive intelligence.",
      icon: <Cpu className="w-8 h-8 text-white" strokeWidth={2} />,
      delay: 0.4
    },
    {
      number: 3,
      title: "Get Actionable Insights",
      description: "Receive comprehensive reports with strategic recommendations and market data.",
      icon: <Award className="w-8 h-8 text-white" strokeWidth={2} />,
      delay: 0.6
    }
  ];

  return (
    <section className="py-24 relative w-full overflow-hidden bg-black">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl md:text-6xl font-black mb-6 text-white">
            How It Works
          </h2>
          <p className="font-body text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Three simple steps to transform your idea into a validated business plan
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: step.delay }}
            >
              <div className="p-8 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 h-full">
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Icon Container */}
                  <div className="relative">
                    <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-white/10">
                      {step.icon}
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-black text-sm">
                      {step.number}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                    <p className="text-base text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-700">
                  <ArrowRight size={24} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-black mb-6 text-white">
            Ready to Validate Your Idea?
          </h2>
          <p className="font-body text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join entrepreneurs turning ideas into successful businesses
          </p>

          <a
            href="/submit"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-200 rounded-lg text-black font-bold text-lg transition-all duration-200"
          >
            Start Building Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Agents;
