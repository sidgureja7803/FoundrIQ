/**
 * Authentication Middleware
 * Verifies user authentication using Appwrite
 */

import sdk from 'node-appwrite';
const { Client, Account, ID } = sdk;

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID);

// Initialize Appwrite account
const account = new Account(client);

/**
 * Middleware to authenticate requests using Appwrite JWT
 */
const authMiddleware = async (req, res, next) => {
  // Get the JWT token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  // Extract token
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify JWT with Appwrite by calling get account
    // This will throw an error if the session is invalid
    client.setJWT(token);
    const user = await account.get();
    
    // Store user details in request object
    req.userId = user.$id;
    req.userEmail = user.email;
    req.userName = user.name;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token'
    });
  }
};

export const requireAuth = authMiddleware;
export default authMiddleware;