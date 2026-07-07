import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { 
      type: String, 
      enum: ['SALE', 'WISHLIST', 'GIFT', 'SYSTEM', 'FRIEND_REQUEST'], 
      required: true 
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

// TTL Index: Automatically delete notifications after 30 days to prevent unbounded collection growth
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

// Optimize for fetching unread notifications for a user
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
