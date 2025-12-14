/**
 * Idea Refiner Controller
 * Refines raw startup ideas into structured format using AI
 */

import ibmWatsonxClient from '../services/ibmWatsonxClient.js';

/**
 * Generate follow-up questions for a startup idea
 * @param {Request} req 
 * @param {Response} res 
 */
const generateQuestions = async (req, res) => {
  try {
    const { rawIdea } = req.body;

    if (!rawIdea || typeof rawIdea !== 'string' || rawIdea.trim().length === 0) {
      return res.status(400).json({
        error: 'Raw idea text is required'
      });
    }

    // Check if IBM Watsonx or Perplexity is available
    if (ibmWatsonxClient.ibmDisabled && !ibmWatsonxClient.perplexityApiKey) {
      return res.status(503).json({
        error: 'AI service unavailable',
        message: 'IBM Granite and Perplexity API keys are not configured. Please add IBM_WATSONX_API_KEY or PERPLEXITY_API_KEY to your server environment variables.',
        details: {
          ibm_granite: 'Not configured',
          perplexity: 'Not configured'
        }
      });
    }

    const systemPrompt = `You are an expert startup consultant analyzing a specific startup idea.

Your task: Generate 3-5 critical follow-up questions to understand THIS specific idea better.

Requirements:
1. Questions MUST be specific to the provided idea (not generic)
2. Focus on: problem validation, target market, business model, or competitive advantage
3. Questions should be open-ended to gather detailed insights
4. Each question should help clarify ambiguous aspects of the idea

Return ONLY valid JSON in this exact format:
{
  "questions": [
    "First specific question about this idea?",
    "Second specific question?",
    "Third specific question?"
  ]
}`;

    const userPrompt = `Analyze this startup idea and generate 3-5 targeted questions:

"${rawIdea.trim()}"

Return ONLY the JSON with the questions array.`;

    const response = await ibmWatsonxClient.generateText(
      { systemPrompt, userPrompt },
      {
        temperature: 0.5,
        maxTokens: 512
      }
    );

    let data;
    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            data = JSON.parse(jsonMatch[0]);
        } else {
            data = JSON.parse(response);
        }
    } catch (e) {
        console.error("Failed to parse AI response:", e);
        return res.status(500).json({ 
          error: 'AI response parsing failed',
          message: 'The AI returned an invalid format. This typically indicates an API key issue or service degradation. Please verify your IBM Granite or Perplexity API keys are valid.'
        });
    }

    if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
         return res.status(500).json({ 
           error: 'Invalid AI response',
           message: 'AI did not generate questions. Please check that your IBM Granite or Perplexity API keys are valid and have sufficient quota.'
         });
    }

    return res.json({ questions: data.questions.slice(0, 5) });

  } catch (error) {
    console.error('Error in generateQuestions:', error.message);
    
    // Check for authentication/API key errors
    if (error.message?.includes('API key') || 
        error.message?.includes('authentication') ||
        error.message?.includes('Unauthorized') ||
        error.message?.includes('401') ||
        error.message?.includes('403') ||
        error.message?.includes('IAM token')) {
      return res.status(503).json({
        error: 'AI authentication failed',
        message: 'Your IBM Granite or Perplexity API key is invalid or expired. Please check the API keys in your server .env file and ensure they have the correct permissions.'
      });
    }
    
    // Timeout or network errors
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({
        error: 'AI service unreachable',
        message: 'Cannot connect to IBM Granite or Perplexity servers. Please check your network connection and API endpoint configuration.'
      });
    }
    
    // Generic error
    return res.status(500).json({
      error: 'Question generation failed',
      message: 'An unexpected error occurred. Please try again or contact support if the issue persists.'
    });
  }
};

const refineIdea = async (req, res) => {
  try {
    const { rawIdea, answers } = req.body;

    if (!rawIdea || typeof rawIdea !== 'string' || rawIdea.trim().length === 0) {
      return res.status(400).json({
        error: 'Raw idea text is required'
      });
    }

    // Check if IBM Watsonx or Perplexity is available
    if (ibmWatsonxClient.ibmDisabled && !ibmWatsonxClient.perplexityApiKey) {
      return res.status(503).json({
        error: 'AI service unavailable',
        message: 'IBM Watsonx and Perplexity API keys are not configured. Please check your environment variables.',
        details: {
          ibm_granite: 'API key not set',
          perplexity: 'API key not set'
        }
      });
    }

    // Create the structured prompt for idea refinement
    const systemPrompt = `You are FoundrIQ Idea Refiner. Analyze the startup idea and return VALID JSON ONLY. No commentary, no markdown.

INSTRUCTIONS:
1. Return a concise structured 'refinedIdea' object with keys:
   - title (clear, catchy name for the startup)
   - oneLinePitch (elevator pitch in one sentence)
   - problem (what problem does it solve?)
   - solution (how does it solve the problem?)
   - targetCustomers (who are the customers?)
   - userPersona (detailed customer persona)
   - uniqueValueProps (array of 3-4 unique value propositions)
   - topAssumptions (array of 3-4 key assumptions that need validation)
   - topRisks (array of 3-4 major risks)
2. Generate 'searchKeywords' (6 strings) optimized for market research.
3. Provide 'complexity' as "low"|"medium"|"high".
4. If user answers are provided, incorporate them to refine the idea better.

OUTPUT_JSON:
{
 "refinedIdea": {
    "title": "...",
    "oneLinePitch": "...",
    "problem": "...",
    "solution": "...",
    "targetCustomers": "...",
    "userPersona": "...",
    "uniqueValueProps": ["...", "...", "..."],
    "topAssumptions": ["...", "...", "..."],
    "topRisks": ["...", "...", "..."]
 },
 "searchKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
 "complexity": "low|medium|high"
}`;

    let userPrompt = `RawIdea: """${rawIdea.trim()}"""`;
    
    if (answers && Array.isArray(answers) && answers.length > 0) {
        userPrompt += `\n\nUser Answers to Follow-up Questions:\n`;
        answers.forEach((a, i) => {
            userPrompt += `Q${i+1}: ${a.question}\nA${i+1}: ${a.answer}\n`;
        });
    }

    userPrompt += `\n\nAnalyze the above and return the refined structured JSON.`;

    // Use IBM Granite for idea refinement
    const response = await ibmWatsonxClient.generateText(
      { systemPrompt, userPrompt },
      {
        temperature: 0.3,
        maxTokens: 2048
      }
    );

    // Parse the JSON response
    let refinedData;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        refinedData = JSON.parse(jsonMatch[0]);
      } else {
        refinedData = JSON.parse(response);
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response:', response.substring(0, 500));

      return res.status(500).json({
        error: 'Failed to parse AI response',
        message: 'The AI service returned an invalid format. This may indicate an API key issue or service degradation.',
        rawResponse: response.substring(0, 200)
      });
    }

    // Validate the response structure
    if (!refinedData.refinedIdea || !refinedData.searchKeywords || !refinedData.complexity) {
      return res.status(500).json({
        error: 'Invalid response structure from AI',
        message: 'The AI did not return the expected data format. Please verify API configuration.',
        received: refinedData
      });
    }

    // Ensure arrays are properly formatted
    if (!Array.isArray(refinedData.searchKeywords)) {
      refinedData.searchKeywords = [];
    }
    
    // Validate complexity value
    if (!['low', 'medium', 'high'].includes(refinedData.complexity)) {
      refinedData.complexity = 'medium';
    }

    // Return the refined idea data
    res.json(refinedData);

  } catch (error) {
    console.error('Error refining idea:', error);

    // Check if it's an API key error
    if (error.message?.includes('API key') || 
        error.message?.includes('authentication') || 
        error.message?.includes('Unauthorized') ||
        error.message?.includes('IAM token')) {
      return res.status(503).json({
        error: 'AI service authentication failed',
        message: 'Invalid or expired IBM Watsonx/Perplexity API key. Please check your server environment variables and verify the API keys are correct.',
        details: error.message
      });
    }

    // Network/timeout errors
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'AI service unavailable',
        message: 'Cannot connect to IBM Watsonx or Perplexity. Please check your network connection and API endpoints.',
        details: error.message
      });
    }

    // Generic error
    res.status(500).json({
      error: 'Failed to refine idea',
      message: 'An unexpected error occurred while refining your idea. Please try again or contact support if the issue persists.',
      details: error.message
    });
  }
};

const getRefinementStatus = async (req, res) => {
  try {
    // Simple health check for the refinement service
    res.json({
      status: 'operational',
      service: 'FoundrIQ Idea Refiner',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking refinement status:', error);
    res.status(500).json({
      error: 'Service unavailable'
    });
  }
};

export {
  generateQuestions,
  refineIdea,
  getRefinementStatus
};
