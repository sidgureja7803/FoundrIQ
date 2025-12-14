/**
 * User Menu Component for Appwrite
 * Displays current user information and sign-out option
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  User as UserIcon, 
  LogOut, 
  Settings, 
  CreditCard 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface UserMenuProps {
  className?: string;
  showCredits?: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({
  className = '',
  showCredits = true
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuRef]);

  // Format user's name
  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  const displayName = userName.length > 15 ? `${userName.substring(0, 12)}...` : userName;

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = () => {
    if (user?.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  if (!user) return null;

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* User Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-700/50 transition-all duration-200"
      >
        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-white font-semibold text-sm border-2 border-primary-500/30">
          {getInitials()}
        </div>

        {/* User Info */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold text-white">
            {displayName}
          </span>
          {showCredits && (
            <span className="text-xs text-dark-300">
              View Credits
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-white font-bold text-lg border-2 border-primary-500/50">
                  {getInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{userName}</p>
                  <p className="text-xs text-dark-300 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
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
                <UserIcon size={18} />
                <span>My Ideas</span>
              </button>

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
