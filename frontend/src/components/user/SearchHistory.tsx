/**
 * Search History Component
 * Displays user's last 5 startup idea searches
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, FileText, ChevronRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
// We'll use a placeholder function instead of date-fns until we can install it
const formatDistanceToNow = (date: Date, options?: { addSuffix: boolean }) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  let result = '';
  if (diffDay > 0) {
    result = `${diffDay} day${diffDay > 1 ? 's' : ''}`;
  } else if (diffHr > 0) {
    result = `${diffHr} hour${diffHr > 1 ? 's' : ''}`;
  } else if (diffMin > 0) {
    result = `${diffMin} minute${diffMin > 1 ? 's' : ''}`;
  } else {
    result = `${diffSec} second${diffSec > 1 ? 's' : ''}`;
  }

  return options?.addSuffix ? `${result} ago` : result;
};

import { SearchHistory as SearchHistoryType } from '../../models/UserCredits';
import { useAuth } from '../../hooks/useAuth';

// Demo search history - this would come from an API in a real app
const DEMO_SEARCH_HISTORY: SearchHistoryType[] = [
  {
    id: 'search1',
    userId: 'user1',
    ideaName: 'AI-Powered Meal Planning App',
    description: 'App that creates personalized meal plans based on dietary preferences and available ingredients',
    searchDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    credits: 1,
    status: 'completed',
    resultId: 'result1'
  },
  {
    id: 'search2',
    userId: 'user1',
    ideaName: 'Smart Home Energy Management',
    description: 'System that optimizes home energy usage by learning user patterns and adjusting systems automatically',
    searchDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    credits: 1,
    status: 'completed',
    resultId: 'result2'
  },
  {
    id: 'search3',
    userId: 'user1',
    ideaName: 'AR Shopping Assistant',
    description: 'Augmented reality app that helps shoppers find items in stores and provides product information',
    searchDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    credits: 1,
    status: 'in-progress'
  },
  {
    id: 'search4',
    userId: 'user1',
    ideaName: 'Sustainable Fashion Marketplace',
    description: 'Platform for buying and selling second-hand clothing with carbon footprint tracking',
    searchDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    credits: 1,
    status: 'completed',
    resultId: 'result4'
  },
  {
    id: 'search5',
    userId: 'user1',
    ideaName: 'Virtual Reality Therapy',
    description: 'VR-based platform for mental health therapy sessions and exercises',
    searchDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    credits: 1,
    status: 'completed',
    resultId: 'result5'
  }
];

interface SearchHistoryProps {
  maxItems?: number;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ maxItems = 5 }) => {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = React.useState<SearchHistoryType[]>([]);

  // Simulate fetching search history
  React.useEffect(() => {
    // This would be an API call in a real application
    const fetchSearchHistory = async () => {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      setSearchHistory(DEMO_SEARCH_HISTORY.slice(0, maxItems));
    };

    fetchSearchHistory();
  }, [maxItems, user]);

  if (searchHistory.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 text-center py-12">
        <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Search History</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          You haven't analyzed any startup ideas yet.
        </p>
        <Link 
          to="/submit" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Analyze Your First Idea
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'in-progress':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-semibold">Your Recent Searches</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          View and access your last {maxItems} idea validations
        </p>
      </div>
      
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {searchHistory.map(search => (
          <motion.div 
            key={search.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{search.ideaName}</h4>
              <div className="flex items-center gap-2">
                {getStatusIcon(search.status)}
                <span className="text-sm text-gray-500 capitalize">
                  {search.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {search.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(search.searchDate), { addSuffix: true })}
              </span>
              
              {search.resultId && search.status === 'completed' && (
                <Link 
                  to={`/results/${search.resultId}`}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  View Results
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-750 text-center">
        <Link 
          to="/dashboard"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center"
        >
          View All History
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default SearchHistory;
