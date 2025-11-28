/**
 * User Menu Component
 * Displays current user information and sign-out option
 */

import React, { useState, useRef, useEffect as ReactUseEffect } from 'react';
import { 
  useUser, 
  useClerk
} from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  User, 
  LogOut, 
  Settings, 
  CreditCard 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UserMenuProps {
  className?: string;
  showCredits?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({
  className = '',
  showCredits = true
}) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch credit balance
  ReactUseEffect(() => {
    const fetchCredits = async () => {
      if (user?.id) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const response = await axios.get(`${apiUrl}/api/credits/balance`, {
            params: { userId: user.id }
          });
          setCreditBalance(response.data.balance || 0);
        } catch (error) {
          console.error('Error fetching credits:', error);
        }
      }
    };

    fetchCredits();
    // Refresh credits every 30 seconds
    const interval = setInterval(fetchCredits, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Close menu when clicking outside
  ReactUseEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuRef]);

  // Format user's name
  let userName = 'User';
  if (user?.firstName) {
    userName = user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName;
  } else if (user?.emailAddresses?.[0]?.emailAddress) {
    userName = user.emailAddresses[0].emailAddress.split('@')[0];
  }

  // Truncate long names
  const displayName = userName.length > 15 ? `${userName.substring(0, 12)}...` : userName;

  const handleSignOut = () => {
    signOut(() => navigate('/sign-in'));
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user?.firstName) {
      return user.firstName[0].toUpperCase();
    } else if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* User Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-700/50 transition-all duration-200"
      >
        {/* User Avatar */}
        <div className="relative">
          {user?.imageUrl ? (
            <img 
              src={user.imageUrl} 
              alt={userName}
              className="w-9 h-9 rounded-full object-cover border-2 border-primary-500/30"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-white font-semibold text-sm border-2 border-primary-500/30">
              {getInitials()}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold text-white">
            {displayName}
          </span>
          {showCredits && (
            <span className="text-xs text-dark-300">
              {creditBalance} {creditBalance === 1 ? 'credit' : 'credits'}
            </span>
          )}
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown
          size={16}
          className={`text-dark-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-xl bg-dark-800 border border-dark-700 shadow-xl z-50 overflow-hidden"
          >
            {/* User Info Section */}
            <div className="px-4 py-4 border-b border-dark-700 bg-gradient-to-br from-primary-500/10 to-accent-cyan/10">
              <div className="flex items-center gap-3 mb-3">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={userName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-500/50"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-white font-bold text-lg border-2 border-primary-500/50">
                    {getInitials()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{userName}</p>
                  <p className="text-xs text-dark-300 truncate">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
              
              {/* Credits Display */}
              {showCredits && (
                <div className="flex items-center justify-between px-3 py-2 bg-dark-900/50 rounded-lg border border-primary-500/20">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-primary-400" />
                    <span className="text-sm font-medium text-white">Credits</span>
                  </div>
                  <span className="text-sm font-bold text-primary-400">{creditBalance}</span>
                </div>
              )}
            </div>

            <div className="py-2">
              {/* Menu Items */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/my-ideas');
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-dark-200 hover:bg-dark-700 hover:text-white transition-colors"
              >
                <User size={18} />
                <span>My Ideas</span>
              </button>

              {showCredits && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/credits');
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-dark-200 hover:bg-dark-700 hover:text-white transition-colors"
                >
                  <CreditCard size={18} />
                  <span>Buy Credits</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/settings');
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-dark-200 hover:bg-dark-700 hover:text-white transition-colors"
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>

              {/* Sign Out */}
              <div className="border-t border-dark-700 mt-2 pt-2">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
