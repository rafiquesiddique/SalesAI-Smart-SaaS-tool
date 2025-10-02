// src/integrations/core.js - Real AI integration
import { AIAPI } from '@/entities/all';

export async function InvokeLLM({ prompt, response_json_schema, leadId, leadData, activities }) {
  try {
    if (leadId) {
      // Use the specific lead analysis endpoint
      const response = await AIAPI.analyzeLead(leadId, leadData, activities); // Pass leadData and activities
      return response.data; // Backend should return { success: true, data: insights }
    }
    
    // If not analyzing a specific lead, can use a general prompt or fallback
    // For now, let's assume analyzeLead is the primary use.
    // If you need a general LLM call, you'd add a '/ai/general' endpoint to your backend.
    
    // Fallback/mock for cases not handled by specific backend endpoints
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      ai_insights: "AI-powered insights based on lead profile and market data (mocked).",
      conversation_prep: "Focus on their business challenges and demonstrate ROI (mocked).",
      lead_score: Math.floor(Math.random() * 30) + 70 // Use lead_score directly now
    };
  } catch (error) {
    console.error('AI Integration Error:', error);
    
    // Fallback response in case of API error
    return {
      ai_insights: "AI analysis temporarily unavailable. Manual review recommended.",
      conversation_prep: "Research company background and prepare value proposition.",
      lead_score: 50
    };
  }
}

export async function ScoreLead(leadData) {
  try {
    // The backend for /ai/score-lead returns { score: number }
    // AIAPI.scoreLead will return that object directly.
    const response = await AIAPI.scoreLead(leadData);
    
    // We return the entire response object so handleSubmit can access `response.score`
    return response; 
  } catch (error) {
    console.error('Lead scoring error, using fallback:', error.message);
    // Return a fallback score in the same format
    return { score: 30 };
  }
}


// Assuming you'll add an '/ai/generate-email' endpoint to your backend
export async function GenerateEmail(leadData, recentActivities = []) {
  try {
    const response = await AIAPI.generateEmail(leadData, recentActivities);
    return response.data; // Backend should return { success: true, data: { subject, body } }
  } catch (error) {
    console.error('Email Generation Error:', error);
    return {
      subject: `Regarding ${leadData.company}`,
      body: `Hi ${leadData.name},\n\nI hope this email finds you well. I wanted to reach out regarding your work at ${leadData.company}.\n\nBest,`,
      tone: "professional",
      follow_up_in_days: 3
    };
  }
}