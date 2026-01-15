import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Github, Twitter, Linkedin, Globe, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-black border-t border-white/10 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 p-2">
                <Brain className="h-full w-full text-white" />
              </div>
              <div>
                <span className="text-xl font-black text-white">FoundrIQ</span>
                <div className="text-xs text-gray-500 font-medium">
                  Powered by Perplexity AI + Tavily
                </div>
              </div>
            </div>
            <p className="text-gray-500 mb-6 leading-relaxed text-sm">
              Transform your startup ideas into comprehensive, data-driven market analyses with AI-powered insights.
              Validate faster, launch smarter.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/validate-idea" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Validate Idea
                </a>
              </li>
              <li>
                <a href="/my-ideas" className="text-gray-400 hover:text-white transition-colors text-sm">
                  My Ideas
                </a>
              </li>
              <li>
                <a href="/gallery" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Public Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 FoundrIQ. All rights reserved. Built with ❤️ for entrepreneurs.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                System Operational
              </span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
