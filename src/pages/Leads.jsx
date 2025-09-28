import React, { useState, useEffect } from "react";
import { Lead } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Sparkles, Building2, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import LeadCard from "@/components/leads/LeadCard";
import AddLeadDialog from "@/components/leads/AddLeadDialog";
import LeadFilters from "@/components/leads/LeadFilters";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    industry: "all",
    score_range: "all"
  });
  const [isGeneratingInsights, setIsGeneratingInsights] = useState({});

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    const data = await Lead.list("-lead_score", 50);
    setLeads(data);
    setIsLoading(false);
  };

  const generateAIInsights = async (leadId) => {
    setIsGeneratingInsights(prev => ({ ...prev, [leadId]: true }));
    const lead = leads.find(l => l.id === leadId);

    try {
      const prompt = `Analyze this sales lead and provide insights and conversation preparation:
      
Lead Details:
- Name: ${lead.name}
- Company: ${lead.company}
- Position: ${lead.position}
- Industry: ${lead.industry}
- Company Size: ${lead.company_size}
- Status: ${lead.status}
- Lead Score: ${lead.lead_score}
- Pain Points: ${lead.pain_points?.join(", ") || "None specified"}
- Notes: ${lead.notes || "None"}

Provide actionable insights and conversation preparation strategies to maximize conversion rate.`;

      const response = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            ai_insights: { type: "string" },
            conversation_prep: { type: "string" },
            recommended_score: { type: "number", minimum: 0, maximum: 100 }
          }
        }
      });

      await Lead.update(leadId, {
        ai_insights: response.ai_insights,
        conversation_prep: response.conversation_prep,
        lead_score: response.recommended_score || lead.lead_score
      });

      loadLeads();
    } catch (error) {
      console.error("Error generating AI insights:", error);
    }

    setIsGeneratingInsights(prev => ({ ...prev, [leadId]: false }));
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === "all" || lead.status === filters.status;
    const matchesIndustry = filters.industry === "all" || lead.industry === filters.industry;

    let matchesScore = true;
    if (filters.score_range === "high") matchesScore = lead.lead_score >= 80;
    else if (filters.score_range === "medium") matchesScore = lead.lead_score >= 50 && lead.lead_score < 80;
    else if (filters.score_range === "low") matchesScore = lead.lead_score < 50;

    return matchesSearch && matchesStatus && matchesIndustry && matchesScore;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lead Management</h1>
          <p className="text-slate-600 mt-1">Manage and analyze your sales prospects with AI insights</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Lead
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search leads by name or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <LeadFilters filters={filters} setFilters={setFilters} />
          </div>
        </CardContent>
      </Card>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-slate-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onGenerateInsights={() => generateAIInsights(lead.id)}
              isGeneratingInsights={isGeneratingInsights[lead.id]}
            />
          ))
        )}
      </div>

      {filteredLeads.length === 0 && !isLoading && (
        <Card className="shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No leads found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f !== "all")
                ? "Try adjusting your search or filters"
                : "Start by adding your first lead to the system"}
            </p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Lead
            </Button>
          </CardContent>
        </Card>
      )}

      <AddLeadDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onLeadAdded={loadLeads}
      />
    </div>
  );
}
