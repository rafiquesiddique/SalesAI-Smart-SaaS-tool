import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, AlertTriangle, Target, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIInsights({ leads, isLoading }) {
  const generateInsights = () => {
    if (leads.length === 0) return [];

    const insights = [];
    
    // High-scoring leads ready for contact
    const highScoreLeads = leads.filter(l => l.lead_score >= 80).length;
    if (highScoreLeads > 0) {
      insights.push({
        type: 'opportunity',
        icon: Target,
        color: 'bg-green-50 text-green-700 border-green-200',
        title: 'Hot Prospects Ready',
        description: `${highScoreLeads} leads scoring 80+ are ready for immediate contact`,
        action: 'Contact Now',
        priority: 'high'
      });
    }

    // Overdue follow-ups
    const overdueCount = leads.filter(l => {
      return l.next_follow_up && new Date(l.next_follow_up) < new Date()
    }).length;
    if (overdueCount > 0) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        title: 'Overdue Follow-ups',
        description: `${overdueCount} leads need immediate follow-up to prevent loss`,
        action: 'View Tasks',
        priority: 'urgent'
      });
    }

    // Conversion trend
    const qualifiedRate = leads.length > 0 ? (leads.filter(l => ['qualified', 'proposal', 'negotiation', 'closed_won'].includes(l.status)).length / leads.length * 100).toFixed(0) : 0;
    insights.push({
      type: 'trend',
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      title: 'Qualification Rate',
      description: `${qualifiedRate}% of leads are progressing through your pipeline`,
      action: 'Analyze',
      priority: 'medium'
    });

    return insights;
  };

  const insights = generateInsights();

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          AI Insights
        </CardTitle>
        <p className="text-sm text-slate-600">Smart recommendations to boost conversions</p>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-full mb-3" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div key={index} className={`border rounded-lg p-4 ${insight.color}`}>
                  <div className="flex items-start gap-3">
                    <IconComponent className="w-5 h-5 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{insight.title}</h4>
                        {insight.priority === 'urgent' && (
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        )}
                      </div>
                      <p className="text-sm opacity-90 mb-3">{insight.description}</p>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        {insight.action}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {insights.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>AI insights coming soon</p>
                <p className="text-sm">Add more lead data to unlock recommendations</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}