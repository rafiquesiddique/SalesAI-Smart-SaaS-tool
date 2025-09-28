import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, Sparkles, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusColors = {
  'new': 'bg-slate-100 text-slate-700',
  'contacted': 'bg-blue-100 text-blue-700',
  'qualified': 'bg-purple-100 text-purple-700',
  'proposal': 'bg-orange-100 text-orange-700',
  'negotiation': 'bg-yellow-100 text-yellow-700',
  'closed_won': 'bg-green-100 text-green-700',
  'closed_lost': 'bg-red-100 text-red-700'
};

const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
  if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

export default function LeadCard({ lead, onGenerateInsights, isGeneratingInsights }) {
  return (
    <Card className="shadow-sm hover:shadow-lg transition-all duration-300 border-0 hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
              {lead.name[0]}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{lead.name}</h3>
              <p className="text-sm text-slate-600">{lead.position}</p>
            </div>
          </div>
          {lead.lead_score > 0 && (
            <Badge className={`font-bold border ${getScoreColor(lead.lead_score)}`}>
              <Star className="w-3 h-3 mr-1" />
              {lead.lead_score}
            </Badge>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-700">{lead.company}</span>
            <Badge variant="outline" className="text-xs ml-auto">
              {lead.industry}
            </Badge>
          </div>
          
          {lead.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700 truncate">{lead.email}</span>
            </div>
          )}
          
          {lead.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700">{lead.phone}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <Badge className={statusColors[lead.status] || 'bg-slate-100 text-slate-700'}>
            {lead.status.replace('_', ' ').toUpperCase()}
          </Badge>
          {lead.estimated_value > 0 && (
            <span className="text-sm font-semibold text-green-600">
              ${lead.estimated_value.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerateInsights}
            disabled={isGeneratingInsights}
            className="flex-1"
          >
            {isGeneratingInsights ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                AI Insights
              </>
            )}
          </Button>
          <Link to={createPageUrl(`Lead?id=${lead.id}`)}>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {lead.ai_insights && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">AI Recommendation</span>
            </div>
            <p className="text-sm text-blue-700 line-clamp-2">{lead.ai_insights}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}