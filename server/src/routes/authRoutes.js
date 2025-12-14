/**
 * Auth Routes
 * Proxy routes for Appwrite authentication
 * Note: Most auth is handled client-side with Appwrite SDK
 */

import express from 'express';
import { Client, Account, ID } from 'node-appwrite';
import authMiddleware from '../middleware/auth.js';
const router = express.Router();

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

// Initialize Appwrite account
const account = new Account(client);

/**
 * Get current user profile
 * (Used to verify token and get user data)
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // User data is already loaded in auth middleware
    return res.json({
      success: true,
      data: {
        id: req.userId,
        email: req.userEmail,
        name: req.userName
      }
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
