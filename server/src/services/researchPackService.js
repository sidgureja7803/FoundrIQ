/**
 * ResearchPack Service - Appwrite Implementation
 * Replaces MongoDB ResearchPack model
 */

import { Client, Databases, ID, Query } from 'node-appwrite';

const COLLECTION_ID = 'researchPacks';
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

// Lazy-load appwrite client
let client, databases;
function getAppwrite() {
  if (!client) {
    client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);
    databases = new Databases(client);
  }
  return { client, databases };
}

class ResearchPackService {
  /**
   * Create a new research pack
   */
  async create({ ideaId, researchHash, queries, sources, documents, facts, metrics, assumptions, ttl }) {
    try {
      const { databases } = getAppwrite();
      const researchPack = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          ideaId,
          researchHash,
          queries: JSON.stringify(queries || []),
          sources: JSON.stringify(sources || []),
          documents: JSON.stringify(documents || []),
          facts: JSON.stringify(facts || []),
          metrics: JSON.stringify(metrics || {}),
          assumptions: JSON.stringify(assumptions || []),
          ttl: ttl ? ttl.toISOString() : new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );

      // Parse JSON fields back to objects
      return this._parseDocument(researchPack);
    } catch (error) {
      console.error('[ResearchPackService] Create error:', error);
      throw new Error(`Failed to create research pack: ${error.message}`);
    }
  }

  /**
   * Find research pack by ideaId and researchHash
   */
  async findByIdeaAndHash(ideaId, researchHash) {
    try {
      const { databases } = getAppwrite();
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('ideaId', ideaId),
          Query.equal('researchHash', researchHash),
          Query.limit(1)
        ]
      );

      if (result.documents.length === 0) {
        return null;
      }

      return this._parseDocument(result.documents[0]);
    } catch (error) {
      console.error('[ResearchPackService] Find error:', error);
      return null;
    }
  }

  /**
   * Find research pack by ID
   */
  async findById(id) {
    try {
      const { databases } = getAppwrite();
      const doc = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );

      return this._parseDocument(doc);
    } catch (error) {
      console.error('[ResearchPackService] FindById error:', error);
      return null;
    }
  }

  /**
   * Delete expired research packs (TTL cleanup)
   */
  async deleteExpired() {
    try {
      const { databases } = getAppwrite();
      const now = new Date().toISOString();
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.lessThan('ttl', now),
          Query.limit(100)
        ]
      );

      for (const doc of result.documents) {
        await databases.deleteDocument(
          DATABASE_ID,
          COLLECTION_ID,
          doc.$id
        );
      }

      return result.documents.length;
    } catch (error) {
      console.error('[ResearchPackService] DeleteExpired error:', error);
      return 0;
    }
  }

  /**
   * Parse JSON fields from Appwrite document
   * @private
   */
  _parseDocument(doc) {
    if (!doc) return null;

    return {
      _id: doc.$id,
      id: doc.$id,
      ideaId: doc.ideaId,
      researchHash: doc.researchHash,
      queries: this._safeJSONParse(doc.queries, []),
      sources: this._safeJSONParse(doc.sources, []),
      documents: this._safeJSONParse(doc.documents, []),
      facts: this._safeJSONParse(doc.facts, []),
      metrics: this._safeJSONParse(doc.metrics, {}),
      assumptions: this._safeJSONParse(doc.assumptions, []),
      ttl: doc.ttl ? new Date(doc.ttl) : null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  /**
   * Safely parse JSON with fallback
   * @private
   */
  _safeJSONParse(str, fallback) {
    try {
      return typeof str === 'string' ? JSON.parse(str) : str;
    } catch {
      return fallback;
    }
  }
}

export default new ResearchPackService();
