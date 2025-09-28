module.exports = {
  name: "Activity",
  type: "object",
  properties: {
    lead_id: {
      type: "string",
      description: "ID of the associated lead"
    },
    type: {
      type: "string",
      enum: [
        "call",
        "email",
        "meeting",
        "demo",
        "follow_up",
        "note"
      ],
      description: "Type of activity"
    },
    subject: {
      type: "string",
      description: "Activity subject/title"
    },
    description: {
      type: "string",
      description: "Detailed description of the activity"
    },
    outcome: {
      type: "string",
      enum: [
        "positive",
        "neutral",
        "negative"
      ],
      description: "Outcome of the activity"
    },
    duration: {
      type: "number",
      description: "Duration in minutes"
    },
    scheduled_date: {
      type: "string",
      format: "date-time",
      description: "Scheduled date and time"
    },
    completed: {
      type: "boolean",
      default: false,
      description: "Whether the activity is completed"
    },
    priority: {
      type: "string",
      enum: [
        "low",
        "medium",
        "high",
        "urgent"
      ],
      default: "medium",
      description: "Activity priority"
    }
  },
  required: [
    "lead_id",
    "type",
    "subject"
  ]
};