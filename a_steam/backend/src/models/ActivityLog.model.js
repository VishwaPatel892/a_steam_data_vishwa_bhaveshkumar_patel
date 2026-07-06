import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { 
      type: String, 
      enum: ['LOGIN', 'PURCHASE', 'PLAY', 'REVIEW', 'PROFILE_UPDATE'], 
      required: true 
    },
    ipAddress: { type: String },
    details: { type: mongoose.Schema.Types.Mixed }, // Flexible payload for different action types
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

// TTL Index: Keep logs for 90 days (7776000 seconds) then auto-delete to save space
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

// Optimize for fetching a user's recent activity
activityLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);

// Model structure verified
