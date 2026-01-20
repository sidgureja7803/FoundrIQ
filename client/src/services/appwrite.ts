import { Client, Account, Databases, ID, Query, Storage } from 'appwrite';

// Initialize Appwrite
const client = new Client();

const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const appwriteDatabaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;

// Log configuration on load
console.log('🔧 Appwrite Configuration:');
console.log('Endpoint:', appwriteEndpoint);
console.log('Project ID:', appwriteProjectId ? '✅ Set' : '❌ Missing');
console.log('Database ID:', appwriteDatabaseId ? '✅ Set' : '❌ Missing');

if (!appwriteProjectId) {
  console.error('❌ VITE_APPWRITE_PROJECT_ID is not set in environment variables');
  console.error('Please check your .env file in the client folder');
}

if (!appwriteDatabaseId) {
  console.error('❌ VITE_APPWRITE_DATABASE_ID is not set in environment variables');
  console.error('Please check your .env file in the client folder');
}

if (appwriteProjectId) {
  client
    .setEndpoint(appwriteEndpoint)
    .setProject(appwriteProjectId);

  console.log('✅ Appwrite client initialized successfully');
} else {
  console.error('❌ Cannot initialize Appwrite client - missing Project ID');
}

// Export initialized instances
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Collection IDs
export const COLLECTIONS = {
  IDEAS: 'ideas',
  USERS: 'users',
};

// Database ID
export const DATABASE_ID = appwriteDatabaseId || 'default';

// User authentication
export const appwriteAuth = {
  // Create a new account
  createAccount: async (email: string, password: string, name: string) => {
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (newAccount) {
        // Create session (login)
        return await appwriteAuth.login(email, password);
      }

      return newAccount;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  // Login
  login: async (email: string, password: string) => {
    try {
      console.log('🔐 Creating email session...');
      const session = await account.createEmailPasswordSession(email, password);
      console.log('✅ Session created successfully');
      return session;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('Error details:', {
        code: error.code,
        type: error.type,
        message: error.message
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      return await account.deleteSession('current');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      console.log('📥 Fetching current user from Appwrite...');
      const user = await account.get();
      console.log('✅ User fetched successfully:', user?.email || user?.$id);
      return user;
    } catch (error: any) {
      // Only log error if it's not a "user not logged in" error
      if (error.code !== 401) {
        console.error('❌ Error getting current user:', error);
      }
      return null;
    }
  },

  // Check if user is logged in
  isLoggedIn: async () => {
    try {
      const user = await account.get();
      return !!user;
    } catch (error) {
      return false;
    }
  },

  // OAuth with GitHub
  loginWithGitHub: () => {
    try {
      account.createOAuth2Session(
        'github' as any, // Appwrite SDK type issue
        `${window.location.origin}/dashboard`, // Success redirect
        `${window.location.origin}/sign-in` // Failure redirect
      );
    } catch (error) {
      console.error('Error logging in with GitHub:', error);
      throw error;
    }
  },

  // OAuth with Google
  loginWithGoogle: () => {
    try {
      account.createOAuth2Session(
        'google' as any, // Appwrite SDK type issue
        `${window.location.origin}/dashboard`, // Success redirect
        `${window.location.origin}/sign-in` // Failure redirect
      );
    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw error;
    }
  }
};

// Ideas management
export const ideaService = {
  // Create a new idea
  createIdea: async (userId: string, ideaData: any, isPublic: boolean = false) => {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.IDEAS,
        ID.unique(),
        {
          userId,
          ...ideaData,
          isPublic,
          createdAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error creating idea:', error);
      throw error;
    }
  },

  // Get user's ideas
  getUserIdeas: async (userId: string) => {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.IDEAS,
        [
          Query.equal('userId', userId)
        ]
      );
    } catch (error: any) {
      console.error('Error getting user ideas:', error);
      if (error.code === 404 && error.message?.includes('Collection')) {
        console.error('❌ Collection "ideas" not found in database "' + DATABASE_ID + '"');
        console.error('👉 Create the collection in Appwrite Console: https://nyc.cloud.appwrite.io/console');
      }
      throw error;
    }
  },


  // Get a single idea by ID
  getIdea: async (ideaId: string) => {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.IDEAS,
        ideaId
      );
    } catch (error: any) {
      console.error('Error getting idea:', error);
      if (error.code === 404) {
        console.error('❌ Idea not found:', ideaId);
      }
      throw error;
    }
  },

  // Get public ideas for gallery
  getPublicIdeas: async () => {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.IDEAS,
        [
          Query.equal('isPublic', true)
        ]
      );
    } catch (error: any) {
      console.error('Error getting public ideas:', error);
      if (error.code === 404 && error.message?.includes('Collection')) {
        console.error('❌ Collection "ideas" not found in database "' + DATABASE_ID + '"');
        console.error('👉 Create the collection in Appwrite Console: https://nyc.cloud.appwrite.io/console');
      }
      throw error;
    }
  },

  // Update idea visibility
  updateIdeaVisibility: async (ideaId: string, isPublic: boolean) => {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.IDEAS,
        ideaId,
        {
          isPublic
        }
      );
    } catch (error) {
      console.error('Error updating idea visibility:', error);
      throw error;
    }
  },

  // Update idea with analysis results
  updateIdeaWithAnalysis: async (ideaId: string, analysisResults: any, status: string = 'completed') => {
    try {
      console.log('[Appwrite] Updating idea with analysis results');
      console.log('[Appwrite] Idea ID:', ideaId);
      console.log('[Appwrite] Analysis data size:', JSON.stringify(analysisResults).length, 'characters');

      const result = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.IDEAS,
        ideaId,
        {
          status,
          analysisResults: JSON.stringify(analysisResults),
          analyzedAt: new Date().toISOString()
        }
      );

      console.log('[Appwrite] ✅ Update successful, doc ID:', result.$id);
      return result;
    } catch (error: any) {
      console.error('[Appwrite] ❌ Error updating idea:', error);
      console.error('[Appwrite] Error message:', error.message);
      throw error;
    }
  },


  // Delete an idea
  deleteIdea: async (ideaId: string) => {
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.IDEAS,
        ideaId
      );
    } catch (error) {
      console.error('Error deleting idea:', error);
      throw error;
    }
  },

  // Check if user has reached free tier limit (5 ideas)
  checkFreeTierLimit: async (userId: string) => {
    try {
      const ideas = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.IDEAS,
        [
          Query.equal('userId', userId)
        ]
      );

      return {
        total: ideas.total,
        reachedLimit: ideas.total >= 5
      };
    } catch (error) {
      console.error('Error checking free tier limit:', error);
      throw error;
    }
  }
};

export default {
  client,
  account,
  databases,
  storage,
  appwriteAuth,
  ideaService
};
