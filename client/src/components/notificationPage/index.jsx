import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Auth/AuthContext.jsx";
import Sidebar from "../common/sidebar.jsx";
import PeopleToFollow from '../common/peopletofollow.jsx'
import {
  Feed,
  FeedEvent,
  FeedContent,
  Icon,
} from "semantic-ui-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (auth && auth.token) {
          const headers = {
            Authorization: `${auth.token}`,
          };
          const response = await axios.get(
            "http://localhost:5000/api/notification",
            { headers }
          );
          setNotifications(response.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError(
          error.response
            ? error.response.data.error
            : "Error fetching notifications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [auth]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          <span>
            <Icon name="heart" color="red" />
            Liked your post.
          </span>
        );
      case "follow":
        return (
          <span>
            <Icon name="add user" color="blue" />
            Followed you.
          </span>
        );
      case "comment":
        return (
          <span>
            <Icon name="comment" color="green" />
            Commented on your post.
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="Container">
      <Sidebar />
      <div className="NotificationsContainer" style={{ padding: '27px 100px' , marginTop:'20px', borderLeft: '2px solid grey', borderRight: '2px solid grey', minHeight:'500px', margin:'8px'}}>
        <Feed className="notifications">
          {notifications.length === 0 && <h1>No Notifications</h1>}
          {notifications.map((notification) => (
            <FeedEvent key={notification._id} className="notification">
              <FeedContent>
                <Feed.Summary>
                  {notification.from.profilePic ? (
                    <img src={notification.from.profilePic} alt="Profile" />
                  ) : (
                    <Icon name="user circle" size="large" />
                  )}
                  <strong>{notification.from.username}</strong>
                  {renderNotificationContent(notification)}
                </Feed.Summary>
                <Feed.Extra text>
                  {notification.type === "comment" && notification.comment}
                </Feed.Extra>
              </FeedContent>
            </FeedEvent>
          ))}
        </Feed>
      </div>
      <PeopleToFollow />
    </div>
  );
};

export default Notifications;
