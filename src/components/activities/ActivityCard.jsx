import React, { useState } from "react";
import { Activity } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Calendar, FileText, Clock, CheckCircle, Building2 } from "lucide-react";
import { format } from "date-fns";

const activityIcons = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  demo: FileText,
  follow_up: Clock,
  note: FileText
};

const activityColors = {
  call: 'bg-blue-100 text-blue-700',
  email: 'bg-green-100 text-green-700',
  meeting: 'bg-purple-100 text-purple-700',
  demo: 'bg-orange-100 text-orange-700',
  follow_up: 'bg-yellow-100 text-yellow-700',
  note: 'bg-gray-100 text-gray-700'
};

const priorityColors = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-blue-100 text-blue-700'
};

export default function ActivityCard({ activity, leads, onUpdate, isOverdue, isCompleted }) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const IconComponent = activityIcons[activity.type] || FileText;
  const lead = leads.find(l => l.id === activity.lead_id);

  const handleComplete = async () => {
    setIsUpdating(true);
    try {
      await Activity.update(activity.id, { completed: true });
      onUpdate();
    } catch (error) {
      console.error("Error completing activity:", error);
    }
    setIsUpdating(false);
  };

  const cardClasses = [
    "shadow-sm hover:shadow-md transition-all duration-300",
    isOverdue && !isCompleted ? "border-l-4 border-l-red-500" : "",
    isCompleted ? "opacity-75" : ""
  ].filter(Boolean).join(" ");

  return (
    <Card className={cardClasses}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${activityColors[activity.type] || 'bg-gray-100 text-gray-700'}`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{activity.subject}</h3>
              {lead && (
                <div className="flex items-center gap-1 mt-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-600">{lead.name} • {lead.company}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {activity.priority && (
              <Badge className={`text-xs ${priorityColors[activity.priority]}`}>
                {activity.priority.toUpperCase()}
              </Badge>
            )}
            {isCompleted && (
              <Badge className="bg-green-100 text-green-700 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Done
              </Badge>
            )}
          </div>
        </div>

        {activity.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{activity.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            {activity.scheduled_date && (
              <span className={isOverdue && !isCompleted ? "text-red-600 font-medium" : ""}>
                {format(new Date(activity.scheduled_date), "MMM d, h:mm a")}
              </span>
            )}
            {activity.duration && (
              <span className="ml-2">• {activity.duration}min</span>
            )}
          </div>

          {!isCompleted && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleComplete}
              disabled={isUpdating}
              className="hover:bg-green-50 hover:text-green-700 hover:border-green-200"
            >
              {isUpdating ? (
                <>
                  <div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-1" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complete
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}