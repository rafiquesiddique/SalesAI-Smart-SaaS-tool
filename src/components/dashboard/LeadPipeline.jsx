import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  'new': { label: 'New', color: 'bg-slate-100 text-slate-700', count: 0 },
  'contacted': { label: 'Contacted', color: 'bg-blue-100 text-blue-700', count: 0 },
  'qualified': { label: 'Qualified', color: 'bg-purple-100 text-purple-700', count: 0 },
  'proposal': { label: 'Proposal', color: 'bg-orange-100 text-orange-700', count: 0 },
  'negotiation': { label: 'Negotiation', color: 'bg-yellow-100 text-yellow-700', count: 0 },
  'closed_won': { label: 'Won', color: 'bg-green-100 text-green-700', count: 0 },
  'closed_lost': { label: 'Lost', color: 'bg-red-100 text-red-700', count: 0 }
};

export default function LeadPipeline({ leads, isLoading }) {
  const getPipelineData = () => {
    const pipeline = { ...statusConfig };
    leads.forEach(lead => {
      if (pipeline[lead.status]) {
        pipeline[lead.status].count++;
      }
    });
    return Object.entries(pipeline).map(([status, data]) => ({
      status,
      ...data
    }));
  };

  const pipelineData = getPipelineData();

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-slate-900">Sales Pipeline</CardTitle>
        <p className="text-sm text-slate-600">Lead distribution across pipeline stages</p>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(7).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {pipelineData.slice(0, -2).map((stage, index) => (
                <div key={stage.status} className="relative">
                  <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={stage.color}>{stage.label}</Badge>
                      {index < pipelineData.length - 3 && (
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-2xl font-bold text-slate-900">{stage.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4 pt-4 border-t border-slate-100">
              {pipelineData.slice(-2).map((stage) => (
                <div key={stage.status} className="flex-1">
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <Badge className={stage.color}>{stage.label}</Badge>
                    <div className="flex items-center gap-2 mt-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-xl font-bold text-slate-900">{stage.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}