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

    const systemPrompt = `You are an expert startup consultant. Your goal is to ask 3 critical follow-up questions to better understand a startup idea.
    
INSTRUCTIONS:
1. Return VALID JSON ONLY. No commentary.
2. The JSON must contain a "questions" array with exactly 3 strings.
3. The questions should focus on clarifying the problem, the solution, or the target market.

OUTPUT_JSON:
{
  "questions": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ]
}`;

    const userPrompt = `Startup Idea: """${rawIdea.trim()}"""`;

    const response = await ibmWatsonxClient.generateText(
      { systemPrompt, userPrompt },
      {
        temperature: 0.3,
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
        console.error("Error parsing questions JSON", e);
        // Fallback to raw text split if JSON fails
        return res.json({ questions: ["What problem does this solve?", "Who is your target customer?", "How do you plan to make money?"] });
    }

    if (!data.questions || !Array.isArray(data.questions)) {
         return res.json({ questions: ["What problem does this solve?", "Who is your target customer?", "How do you plan to make money?"] });
    }

    return res.json({ questions: data.questions.slice(0, 3) });

  } catch (error) {
    console.error('Error generating questions:', error);
    console.warn('⚠️  Returning fallback questions due to AI error');
    
    // Return fallback questions instead of 500 error
    return res.json({ 
      questions: [
        "What problem does this solve?", 
        "Who is your target customer?", 
        "How do you plan to make money?"
      ]
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

    // Create the structured prompt for idea refinement
    const systemPrompt = `You are FoundrIQ Idea Refiner. Return VALID JSON ONLY. No commentary, no markdown.

INSTRUCTIONS:
1. Return a concise structured 'refinedIdea' object with keys:
   - title, oneLinePitch, problem, solution, targetCustomers, userPersona, uniqueValueProps (array up to 4),
     topAssumptions (array up to 4), topRisks (array up to 4)
2. Generate 'searchKeywords' (6 strings) prioritized for web search.
3. Provide 'complexity' as "low"|"medium"|"high".
4. Refine the idea based on the user's answers to follow-up questions if provided.

OUTPUT_JSON:
{
 "refinedIdea": {
    "title": "...",
    "oneLinePitch": "...",
    "problem": "...",
    "solution": "...",
    "targetCustomers": "...",
    "userPersona": "...",
    "uniqueValueProps": ["..."],
    "topAssumptions": ["..."],
    "topRisks": ["..."]
 },
 "searchKeywords": ["..."],
 "complexity": "low|medium|high"
}`;

    let userPrompt = `RawIdea: """${rawIdea.trim()}"""`;
    
    if (answers && Array.isArray(answers) && answers.length > 0) {
        userPrompt += `\n\nUser Answers to Follow-up Questions:\n`;
        answers.forEach((a, i) => {
            userPrompt += `Q: ${a.question}\nA: ${a.answer}\n`;
        });
    }

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
      console.error('Raw response:', response);

      // Fallback: return a structured error response
      return res.status(500).json({
        error: 'Failed to parse AI response',
        rawResponse: response
      });
    }

    // Validate the response structure
    if (!refinedData.refinedIdea || !refinedData.searchKeywords || !refinedData.complexity) {
      return res.status(500).json({
        error: 'Invalid response structure from AI',
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

    // Log successful refinement
    console.log(`Successfully refined idea: "${refinedData.refinedIdea.title || 'Untitled'}"`);

    // Return the refined idea data
    res.json(refinedData);

  } catch (error) {
    console.error('Error refining idea:', error);

    res.status(500).json({
      error: 'Failed to refine idea',
      message: error.message
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
