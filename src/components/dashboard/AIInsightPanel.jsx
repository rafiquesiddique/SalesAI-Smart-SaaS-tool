// src/components/dashboard/AIInsightPanel.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, TrendingUp, AlertTriangle, Target, ArrowRight, 
  Bot, Zap, Brain
} from "lucide-react";
import { AIThinkingIndicator } from "@/components/ui/loading-spinner"; // Correct import path
import { InvokeLLM } from "@/integrations/core";

const InsightCard = ({ insight, index }) => (
  <div 
    className={`rounded-xl p-4 border transition-all duration-300 hover:shadow-md cursor-pointer transform hover:scale-105 ${insight.color}`}
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex items-start gap-3">
      <insight.icon className="w-5 h-5 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-sm">{insight.title}</h4>
          {insight.priority === 'urgent' && (
            <Badge variant="destructive" className="text-xs px-2 py-0">Urgent</Badge>
          )}
          {insight.priority === 'high' && (
            <Badge className="text-xs px-2 py-0 bg-orange-100 text-orange-700">High</Badge>
          )}
        </div>
        <p className="text-sm opacity-90 leading-relaxed mb-3">{insight.description}</p>
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="h-7 text-xs hover:bg-white/50 transition-colors">
            {insight.action}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
          {insight.impact && (
            <span className="text-xs opacity-75">{insight.impact}</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default function AIInsightPanel({ leads, activities, isLoading }) {
  const [insights, setInsights] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const generateAdvancedInsights = useCallback(async () => {
    if (!leads || leads.length === 0) {
      setInsights([]); // Clear insights if no leads
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const topLeads = [...leads]
        .filter(lead => lead.lead_score > 0) // Only consider scored leads
        .sort((a, b) => (b.lead_score || 0) - (a.lead_score || 0))
        .slice(0, 3); // Analyze top 3 leads

      const analysisResults = await Promise.all(topLeads.map(async lead => {
        const leadActivities = activities.filter(a => a.lead_id === lead._id); // Filter activities by lead ID
        try {
          const response = await InvokeLLM({
            prompt: `Analyze this lead for advanced insights:`,
            leadId: lead._id,
            leadData: lead,
            activities: leadActivities,
          });
          return { ...response, leadId: lead._id, leadName: lead.name };
        } catch (error) {
          console.error(`Error analyzing lead ${lead._id}:`, error);
          return null;
        }
      }));
      
      const validResults = analysisResults.filter(r => r !== null && r.ai_insights);
      
      const generatedInsights = [];
      
      const hotProspects = validResults.filter(r => r.lead_score >= 80);
      if (hotProspects.length > 0) {
        generatedInsights.push({
          type: 'opportunity',
          icon: Target,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
          title: 'Hot Prospects Identified',
          description: `${hotProspects.length} leads show strong buying signals. Immediate, personalized outreach recommended.`,
          action: 'View Hot List',
          priority: 'high',
        });
      }
      
      const allRisks = validResults.flatMap(r => r.risk_factors || []);
      if (allRisks.length > 0) {
        const uniqueRisks = [...new Set(allRisks)];
        generatedInsights.push({
          type: 'risk',
          icon: AlertTriangle,
          color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
          title: 'Potential Risks Detected',
          description: `AI flagged risks like '${uniqueRisks[0]}' for key accounts. Proactive mitigation is advised.`,
          action: 'Review Risks',
          priority: 'urgent',
        });
      }
      
      const allOpportunities = validResults.flatMap(r => r.opportunities || []);
      if (allOpportunities.length > 0) {
        const uniqueOpportunities = [...new Set(allOpportunities)];
        generatedInsights.push({
          type: 'optimization',
          icon: Brain,
          color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
          title: 'Strategic Opportunities',
          description: `AI suggests new opportunities such as '${uniqueOpportunities[0]}' based on recent market data.`,
          action: 'Explore Strategies',
          priority: 'medium',
        });
      }

      setInsights(generatedInsights.slice(0, 3)); // Show top 3 insights
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [leads, activities]);

  useEffect(() => {
    // Only generate insights if leads/activities are available and not currently generating
    if (leads.length > 0 && !isGenerating) {
      generateAdvancedInsights();
    } else if (leads.length === 0) {
      setInsights([]); // Clear insights if no leads are present
    }
  }, [leads, activities, isGenerating, generateAdvancedInsights]);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="border-b border-slate-100 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Advanced AI Insights
                <Sparkles className="w-5 h-5 text-blue-500" />
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                {lastUpdate ? `Last updated ${lastUpdate.toLocaleTimeString()}` : 'AI-powered recommendations'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateAdvancedInsights}
            disabled={isGenerating || isLoading}
            className="hover:bg-blue-50 transition-colors"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin border-blue-600 border-t-transparent rounded-full" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {isGenerating ? (
          <AIThinkingIndicator text="Analyzing your pipeline with advanced AI..." />
        ) : insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-500 mb-4">No insights available yet. Add leads to get started.</p>
            <Button onClick={generateAdvancedInsights} className="bg-blue-600 hover:bg-blue-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}