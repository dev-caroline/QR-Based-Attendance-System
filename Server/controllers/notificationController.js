const Notification = require('../models/Notification');

// Get all notifications for the logged-in user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('relatedId');
        
        const unreadCount = await Notification.countDocuments({ 
            userId: req.user.userId, 
            read: false 
        });

        res.json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications'
        });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId: req.user.userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to mark notification as read'
        });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.userId, read: false },
            { read: true }
        );

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to mark all as read'
        });
    }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            userId: req.user.userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            message: 'Notification deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete notification'
        });
    }
};

// Helper function to create notification (used by other controllers)
exports.createNotification = async (userId, type, title, message, relatedId = null, relatedModel = null) => {
    try {
        const notification = new Notification({
            userId,
            type,
            title,
            message,
            relatedId,
            relatedModel
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};
