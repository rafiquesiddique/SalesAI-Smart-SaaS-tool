import React, { useState, useEffect } from "react";
import { Activity, Lead } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

import ActivityCard from "@/components/activities/ActivityCard";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [activitiesData, leadsData] = await Promise.all([
      Activity.list('-scheduled_date', 50),
      Lead.list('-created_date', 100)
    ]);
    setActivities(activitiesData);
    setLeads(leadsData);
    setIsLoading(false);
  };

  const upcomingActivities = activities.filter(a =>
    !a.completed && a.scheduled_date && new Date(a.scheduled_date) >= new Date()
  );
  const overdueActivities = activities.filter(a =>
    !a.completed && a.scheduled_date && new Date(a.scheduled_date) < new Date()
  );
  const completedActivities = activities.filter(a => a.completed);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Activity Management</h1>
          <p className="text-slate-600 mt-1">Track and manage your lead interactions</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{overdueActivities.length}</p>
                <p className="text-sm text-slate-600">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{upcomingActivities.length}</p>
                <p className="text-sm text-slate-600">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{completedActivities.length}</p>
                <p className="text-sm text-slate-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{activities.length}</p>
                <p className="text-sm text-slate-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activities by Category */}
      <div className="space-y-6">
        {overdueActivities.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Overdue Activities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {overdueActivities.map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  leads={leads}
                  onUpdate={loadData}
                  isOverdue={true}
                />
              ))}
            </div>
          </div>
        )}

        {upcomingActivities.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Upcoming Activities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingActivities.map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  leads={leads}
                  onUpdate={loadData}
                />
              ))}
            </div>
          </div>
        )}

        {completedActivities.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Recently Completed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedActivities.slice(0, 6).map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  leads={leads}
                  onUpdate={loadData}
                  isCompleted={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {activities.length === 0 && !isLoading && (
        <Card className="shadow-sm">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No activities yet</h3>
            <p className="text-slate-600 mb-6">Start tracking your interactions with leads</p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Activity
            </Button>
          </CardContent>
        </Card>
      )}

      
    </div>
  );
}