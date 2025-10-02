// import React, { useState, useEffect } from "react";
// import { Lead } from "@/entities/all";
// import { InvokeLLM } from "@/integrations/core";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Plus, Search, Sparkles, Building2, Mail, Phone } from "lucide-react";
// import { Link } from "react-router-dom";
// import { createPageUrl } from "@/utils";

// import LeadCard from "@/components/leads/LeadCard";
// import AddLeadDialog from "@/components/leads/AddLeadDialog";
// import LeadFilters from "@/components/leads/LeadFilters";

// export default function Leads() {
//   const [leads, setLeads] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showAddDialog, setShowAddDialog] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({
//     status: "all",
//     industry: "all",
//     score_range: "all"
//   });
//   const [isGeneratingInsights, setIsGeneratingInsights] = useState({});

//   useEffect(() => {
//     loadLeads();
//   }, []);

//   const loadLeads = async () => {
//     setIsLoading(true);
//     const data = await Lead.list("-lead_score", 50);
//     setLeads(data);
//     setIsLoading(false);
//   };

//   const generateAIInsights = async (leadId) => {
//     setIsGeneratingInsights(prev => ({ ...prev, [leadId]: true }));
//     const lead = leads.find(l => l.id === leadId);

//     try {
//       const prompt = `Analyze this sales lead and provide insights and conversation preparation:
      
// Lead Details:
// - Name: ${lead.name}
// - Company: ${lead.company}
// - Position: ${lead.position}
// - Industry: ${lead.industry}
// - Company Size: ${lead.company_size}
// - Status: ${lead.status}
// - Lead Score: ${lead.lead_score}
// - Pain Points: ${lead.pain_points?.join(", ") || "None specified"}
// - Notes: ${lead.notes || "None"}

// Provide actionable insights and conversation preparation strategies to maximize conversion rate.`;

//       const response = await InvokeLLM({
//         prompt,
//         response_json_schema: {
//           type: "object",
//           properties: {
//             ai_insights: { type: "string" },
//             conversation_prep: { type: "string" },
//             recommended_score: { type: "number", minimum: 0, maximum: 100 }
//           }
//         }
//       });

//       await Lead.update(leadId, {
//         ai_insights: response.ai_insights,
//         conversation_prep: response.conversation_prep,
//         lead_score: response.recommended_score || lead.lead_score
//       });

//       loadLeads();
//     } catch (error) {
//       console.error("Error generating AI insights:", error);
//     }

//     setIsGeneratingInsights(prev => ({ ...prev, [leadId]: false }));
//   };

//   const filteredLeads = leads.filter(lead => {
//     const matchesSearch =
//       lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       lead.company.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus = filters.status === "all" || lead.status === filters.status;
//     const matchesIndustry = filters.industry === "all" || lead.industry === filters.industry;

//     let matchesScore = true;
//     if (filters.score_range === "high") matchesScore = lead.lead_score >= 80;
//     else if (filters.score_range === "medium") matchesScore = lead.lead_score >= 50 && lead.lead_score < 80;
//     else if (filters.score_range === "low") matchesScore = lead.lead_score < 50;

//     return matchesSearch && matchesStatus && matchesIndustry && matchesScore;
//   });

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">Lead Management</h1>
//           <p className="text-slate-600 mt-1">Manage and analyze your sales prospects with AI insights</p>
//         </div>
//         <Button
//           onClick={() => setShowAddDialog(true)}
//           className="bg-blue-600 hover:bg-blue-700"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Add New Lead
//         </Button>
//       </div>

//       {/* Search and Filters */}
//       <Card className="shadow-sm">
//         <CardContent className="p-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
//               <Input
//                 placeholder="Search leads by name or company..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <LeadFilters filters={filters} setFilters={setFilters} />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Leads Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {isLoading ? (
//           Array(6).fill(0).map((_, i) => (
//             <Card key={i} className="animate-pulse">
//               <CardContent className="p-6">
//                 <div className="h-32 bg-slate-200 rounded"></div>
//               </CardContent>
//             </Card>
//           ))
//         ) : (
//           filteredLeads.map(lead => (
//             <LeadCard
//               key={lead.id}
//               lead={lead}
//               onGenerateInsights={() => generateAIInsights(lead.id)}
//               isGeneratingInsights={isGeneratingInsights[lead.id]}
//             />
//           ))
//         )}
//       </div>

//       {filteredLeads.length === 0 && !isLoading && (
//         <Card className="shadow-sm">
//           <CardContent className="p-12 text-center">
//             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Building2 className="w-8 h-8 text-slate-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-slate-900 mb-2">No leads found</h3>
//             <p className="text-slate-600 mb-6">
//               {searchTerm || Object.values(filters).some(f => f !== "all")
//                 ? "Try adjusting your search or filters"
//                 : "Start by adding your first lead to the system"}
//             </p>
//             <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
//               <Plus className="w-4 h-4 mr-2" />
//               Add Your First Lead
//             </Button>
//           </CardContent>
//         </Card>
//       )}

//       <AddLeadDialog
//         open={showAddDialog}
//         onClose={() => setShowAddDialog(false)}
//         onLeadAdded={loadLeads}
//       />
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Lead, Activity } from "@/entities/all"; // Also import Activity for AI context
import { InvokeLLM } from "@/integrations/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Sparkles, Building2, Bot, Loader2 } from "lucide-react"; // Added Bot, Loader2
import { Link } from "react-router-dom";
import { createPageUrl } from "@/lib/utils"; // Corrected import path

import LeadCard from "@/components/leads/LeadCard";
import AddLeadDialog from "@/components/leads/AddLeadDialog";
import LeadFilters from "@/components/leads/LeadFilters";
import { AIThinkingIndicator } from "@/components/ui/loading-spinner"; // Assuming this is defined there

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [activities, setActivities] = useState([]); // State for activities
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    industry: "all",
    score_range: "all"
  });
  const [isGeneratingInsights, setIsGeneratingInsights] = useState({});
  const [bulkAnalyzing, setBulkAnalyzing] = useState(false); // Added for bulk analysis

  useEffect(() => {
    loadData(); // Load both leads and activities
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [leadsData, activitiesData] = await Promise.all([
        Lead.list('-lead_score', 50), // Use '-lead_score' to sort
        Activity.list('-createdAt', 100) // Fetch activities for AI context
      ]);
      setLeads(leadsData.data); // Backend returns { success: true, data: [...] }
      setActivities(activitiesData.data); // Backend returns { success: true, data: [...] }
    } catch (error) {
      console.error("Error loading leads/activities:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIInsights = async (leadId) => {
    setIsGeneratingInsights(prev => ({ ...prev, [leadId]: true }));
    const lead = leads.find(l => l._id === leadId); // Find by _id
    const leadActivities = activities.filter(a => a.lead_id === leadId); // Filter activities by leadId

    try {
      // InvokeLLM needs leadData and activities for context
      const response = await InvokeLLM({
        prompt: `Analyze this sales lead and provide insights and conversation preparation:`,
        leadId: lead._id, // Pass lead ID to the backend AI endpoint
        leadData: lead,
        activities: leadActivities,
        response_json_schema: { /* schema as defined in integrations/core.js for backend */ }
      });

      // Backend should update the lead directly, but we refresh for frontend state
      // If AI integration *updates* the lead on backend, then fetch it, otherwise client-side update
      if (response && response.ai_insights) { // Check if AI returned insights
        // Assuming the backend endpoint for analyzeLead already updates the Lead entity
        // So we just need to refetch the data.
        loadData();
      }
    } catch (error) {
      console.error("Error generating AI insights:", error);
    } finally {
      setIsGeneratingInsights(prev => ({ ...prev, [leadId]: false }));
    }
  };

  const bulkAnalyzeLeads = async () => {
    setBulkAnalyzing(true);
    const leadsToAnalyze = filteredLeads
      .filter(lead => !lead.ai_insights || (lead.lead_score || 0) < 80) // Prioritize non-analyzed or low-score leads
      .slice(0, 3); // Limit to a few for demo/cost

    for (const lead of leadsToAnalyze) {
      await generateAIInsights(lead._id);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
    }
    setBulkAnalyzing(false);
  };

  const filteredLeads = leads.filter(lead => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = lead.name?.toLowerCase().includes(searchLower) ||
                         lead.company?.toLowerCase().includes(searchLower) ||
                         lead.email?.toLowerCase().includes(searchLower); // Added email search
    
    const matchesStatus = filters.status === "all" || lead.status === filters.status;
    const matchesIndustry = filters.industry === "all" || (lead.industry && lead.industry === filters.industry); // Handle null industry
    
    let matchesScore = true;
    if (filters.score_range === "high") matchesScore = (lead.lead_score || 0) >= 80;
    else if (filters.score_range === "medium") matchesScore = (lead.lead_score || 0) >= 50 && (lead.lead_score || 0) < 80;
    else if (filters.score_range === "low") matchesScore = (lead.lead_score || 0) < 50;

    return matchesSearch && matchesStatus && matchesIndustry && matchesScore;
  });

  const stats = {
    total: leads.length,
    highPriority: leads.filter(l => (l.lead_score || 0) >= 80).length,
    withAI: leads.filter(l => l.ai_insights).length,
    totalValue: leads.reduce((sum, l) => sum + (l.estimated_value || 0), 0)
  };


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lead Management</h1>
          <p className="text-slate-600 mt-1">Manage and analyze your sales prospects with AI insights</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={bulkAnalyzeLeads}
            disabled={bulkAnalyzing || isLoading}
            variant="outline"
            className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 transition-all"
          >
            {bulkAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                AI Analyzing...
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 mr-2" />
                Bulk AI Analysis
              </>
            )}
          </Button>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-700">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Leads</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">High Priority</p>
                <p className="text-2xl font-bold text-green-900">{stats.highPriority}</p>
              </div>
              <Sparkles className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">AI Enhanced</p>
                <p className="text-2xl font-bold text-purple-900">{stats.withAI}</p>
              </div>
              <Bot className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Pipeline Value</p>
                <p className="text-2xl font-bold text-orange-900">
                  ${(stats.totalValue / 1000).toFixed(0)}K
                </p>
              </div>
              <Building2 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {bulkAnalyzing && (
        <AIThinkingIndicator text="Running bulk AI analysis on your leads..." />
      )}

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
        ) : filteredLeads.length > 0 ? (
          filteredLeads.map(lead => (
            <LeadCard
              key={lead._id} // Use _id from MongoDB
              lead={lead}
              onGenerateInsights={() => generateAIInsights(lead._id)} // Pass _id
              isGeneratingInsights={isGeneratingInsights[lead._id]}
            />
          ))
        ) : (
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
      </div>

      <AddLeadDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onLeadAdded={loadData} // Reload all data after adding lead
      />
    </div>
  );
}
