import Notification from '../models/notificationmodel.js'

export const getNotifications = async (req, res) => {
    try {
        console.log('inside get notifications');
        const userId = req.user._id;
        console.log('userid',userId);
        const notifications = await Notification.find({ to: userId }).populate({
            path: 'from',
            select: 'username profilePic'
        });
        await Notification.updateMany({ to: userId }, { read: true });
        return res.status(200).json(notifications);
    } catch (error) {
        console.error("Get notifications error:", error);
        return res.status(500).json({ error: "Internal server error during getting notifications" });
    }
}


export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.deleteMany({ to: userId });
        return res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        console.error("delete notifications error:", error); 
        return res.status(500).json({ error: "Internal server error during deleting notifications" });
    }
}
