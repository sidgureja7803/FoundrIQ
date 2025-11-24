/**
 * Environment Variables Checker Component
 * Shows if Appwrite is configured correctly
 * Remove this in production!
 */

import React from 'react';

const EnvChecker: React.FC = () => {
  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;

  const isEndpointCorrect = endpoint === 'https://nyc.cloud.appwrite.io/v1';
  const hasProjectId = !!projectId;
  const hasDatabaseId = !!databaseId;

  const allGood = isEndpointCorrect && hasProjectId && hasDatabaseId;

  if (allGood) return null; // Hide if everything is correct

  return (
    <div className="fixed bottom-4 right-4 bg-red-900/90 text-white p-4 rounded-lg shadow-lg max-w-md z-50 border border-red-500">
      <div className="flex items-start gap-2">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <h3 className="font-bold mb-2">Configuration Error</h3>
          <div className="text-sm space-y-1">
            {!isEndpointCorrect && (
              <div className="flex items-center gap-2">
                <span className="text-red-400">❌</span>
                <span>Wrong endpoint: {endpoint || 'missing'}</span>
              </div>
            )}
            {!hasProjectId && (
              <div className="flex items-center gap-2">
                <span className="text-red-400">❌</span>
                <span>Missing VITE_APPWRITE_PROJECT_ID</span>
              </div>
            )}
            {!hasDatabaseId && (
              <div className="flex items-center gap-2">
                <span className="text-red-400">❌</span>
                <span>Missing VITE_APPWRITE_DATABASE_ID</span>
              </div>
            )}
          </div>
          <p className="text-xs mt-3 text-gray-300">
            Check /client/.env file and restart dev server
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnvChecker;
