import React, { useState, useEffect } from "react";
import { Lead, Activity } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Target, DollarSign, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/lib/utils"; // Corrected import path

import MetricCard from "@/components/dashboard/MetricCard";
import ConversionChart from "@/components/dashboard/ConversionChart";
import LeadPipeline from "@/components/dashboard/LeadPipeline";
import TopLeads from "@/components/dashboard/TopLeads";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AIInsightPanel from "@/components/dashboard/AIInsightPanel"; // Corrected component name and path

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Pass sort and limit to list methods
      const [leadsData, activitiesData] = await Promise.all([
        Lead.list('-createdAt', 50), // Assuming 'createdAt' is the field for created date in backend
        Activity.list('-createdAt', 20) // Assuming 'createdAt' is the field for created date in backend
      ]);
      setLeads(leadsData.data); // Backend returns { success: true, data: [...] }
      setActivities(activitiesData.data); // Backend returns { success: true, data: [...] }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Handle error (e.g., show a message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = () => {
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(l => ['qualified', 'proposal', 'negotiation'].includes(l.status)).length;
    const wonDeals = leads.filter(l => l.status === 'closed_won').length;
    const conversionRate = totalLeads > 0 ? (wonDeals / totalLeads * 100).toFixed(1) : 0;
    const totalValue = leads.reduce((sum, l) => sum + (l.estimated_value || 0), 0);
    const avgScore = leads.length > 0 ? (leads.reduce((sum, l) => sum + (l.lead_score || 0), 0) / leads.length).toFixed(1) : 0;

    return {
      totalLeads,
      qualifiedLeads,
      conversionRate,
      totalValue,
      avgScore
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sales Dashboard</h1>
          <p className="text-slate-600 mt-1">AI-powered insights to maximize your conversion rates</p>
        </div>
        <div className="flex gap-3">
          <Link to="/leads">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Users className="w-4 h-4 mr-2" />
              View All Leads
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Leads"
          value={metrics.totalLeads}
          icon={Users}
          trend="+12% this month"
          trendUp={true}
          bgColor="from-blue-500 to-blue-600"
        />
        <MetricCard
          title="Qualified Leads"
          value={metrics.qualifiedLeads}
          icon={Target}
          trend="+8% this week"
          trendUp={true}
          bgColor="from-green-500 to-green-600"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          icon={TrendingUp}
          trend="+2.1% vs last month"
          trendUp={true}
          bgColor="from-purple-500 to-purple-600"
        />
        <MetricCard
          title="Pipeline Value"
          value={`$${(metrics.totalValue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          trend="+15% growth"
          trendUp={true}
          bgColor="from-orange-500 to-orange-600"
        />
        <MetricCard
          title="Avg Lead Score"
          value={metrics.avgScore}
          icon={Sparkles}
          trend="AI optimized"
          trendUp={true}
          bgColor="from-indigo-500 to-indigo-600"
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="xl:col-span-2 space-y-6">
          <ConversionChart leads={leads} isLoading={isLoading} />
          <LeadPipeline leads={leads} isLoading={isLoading} />
        </div>

        {/* Right Column - Insights & Activity */}
        <div className="space-y-6">
          <AIInsightPanel leads={leads} activities={activities} isLoading={isLoading} /> {/* Corrected component name */}
          <TopLeads leads={leads} isLoading={isLoading} />
          <RecentActivity activities={activities} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}