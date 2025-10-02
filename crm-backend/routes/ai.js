const express = require('express');
const router = express.Router();

// This is the route for scoring leads
router.post('/score-lead', async (req, res) => {
  try {
    // DISABLED: OpenAI API call due to quota limits
    // Using simple scoring algorithm instead
    
    const { company_size, industry, position, source, estimated_value } = req.body;
    
    let score = 20; // Base score
    
    // Company size scoring
    if (company_size) {
      if (company_size === "1000+") score += 25;
      else if (company_size === "201-1000") score += 20;
      else if (company_size === "51-200") score += 15;
      else if (company_size === "11-50") score += 10;
    }
    
    // Industry scoring
    if (industry) {
      const highValueIndustries = ['Technology', 'Finance', 'Healthcare'];
      if (highValueIndustries.includes(industry)) score += 15;
    }
    
    // Position scoring
    if (position) {
      const posLower = position.toLowerCase();
      if (posLower.includes('ceo') || posLower.includes('founder')) score += 25;
      else if (posLower.includes('cto') || posLower.includes('vp') || posLower.includes('director')) score += 20;
      else if (posLower.includes('manager')) score += 10;
    }
    
    // Source scoring
    if (source === 'referral') score += 15;
    else if (source === 'website') score += 5;
    
    // Deal value scoring
    if (estimated_value) {
      const value = Number(estimated_value);
      if (value >= 50000) score += 20;
      else if (value >= 20000) score += 15;
      else if (value >= 10000) score += 10;
      else if (value >= 5000) score += 5;
    }
    
    // Cap the score at 95
    score = Math.min(score, 95);
    
    console.log('Simple Lead Scoring:', { score, inputs: req.body });
    
    res.json({ score });
    
  } catch (error) {
    console.error('Lead Scoring Error:', error);
    // Fallback score if anything fails
    res.json({ score: 50 });
  }
});

// Any other AI-related routes would go here...

// This line MUST be at the end of the file
module.exports = router;