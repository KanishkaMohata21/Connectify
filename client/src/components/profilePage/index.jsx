import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Segment, Image, Header, Icon, Button } from "semantic-ui-react";
import { useAuth } from "../Auth/AuthContext.jsx";
import { CgProfile } from "react-icons/cg";
import Sidebar from "../common/sidebar.jsx";
import PeopleToFollow from "../common/peopletofollow.jsx";
import DefaultProfileImg from '../../assets/defaultImg.jpg'; // Import default profile image
import EditProfile from "./editProfile.jsx"; // Import EditProfile component

const ProfilePage = () => {
  const { auth } = useAuth();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to control editing mode

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const headers = {
          Authorization: `${auth.token}`,
        };

        const response = await axios.get(
          `http://localhost:5000/api/user/profile/${username}`,
          { headers }
        );
        setUser(response.data.user);
        setIsFollowing(response.data.user.followers.includes(auth.user._id));
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching user profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const headers = {
          Authorization: `${auth.token}`,
        };

        const response = await axios.get(
          `http://localhost:5000/api/post/userpost/${username}`,
          { headers }
        );
        setPosts(response.data.posts);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching user posts");
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchUserProfile();
      await fetchUserPosts();
      setLoading(false);
    };

    if (username) {
      fetchData();
    }
  }, [username, auth.token]);

  const handleFollowUnfollow = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/user/follow/${user._id}`,
        {},
        {
          headers: { Authorization: `${auth.token}` },
        }
      );

      if (response.data.follow) {
        setIsFollowing(true);
        setUser((prevUser) => ({
          ...prevUser,
          followers: [...prevUser.followers, auth.user._id],
        }));
      } else if (response.data.unfollow) {
        setIsFollowing(false);
        setUser((prevUser) => ({
          ...prevUser,
          followers: prevUser.followers.filter(
            (followerId) => followerId !== auth.user._id
          ),
        }));
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error following/unfollowing user");
    }
  };

  const isOwnProfile = user && user._id === auth.user._id;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="Container" style={{ display: "flex", justifyContent: "center" }}>
      <Sidebar />
      <div style={{ margin: "10px" }}>
        {user && !isEditing && (
          <div style={{ margin: '20px' }}>
            <Segment>
              <Image
                src={user.profileimg ? `data:${user.profileimg.contentType};base64,${user.profileimg.data}` : DefaultProfileImg}
                size="small"
                circular
                centered
              />
              <Header as="h2" textAlign="center">
                {user.username}
              </Header>
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <p>
                  <strong>Followers:</strong> {user.followers.length}
                </p>
                <p>
                  <strong>Following:</strong> {user.following.length}
                </p>
              </div>
              <p style={{ textAlign: "center", fontStyle: "italic" }}>
                {user.bio}
              </p>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                {isOwnProfile ? (
                  <Button primary onClick={() => setIsEditing(true)}>
                    <Icon name="edit" /> Edit Profile
                  </Button>
                ) : (
                  <Button primary onClick={handleFollowUnfollow}>
                    <Icon name={isFollowing ? "user times" : "user plus"} /> 
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
                <Button color="blue">
                  <Icon name="comment" /> Message
                </Button>
              </div>
            </Segment>
          </div>
        )}
        {isEditing && (
          <EditProfile
            user={user}
            setUser={setUser}
            setIsEditing={setIsEditing}
          />
        )}
        {posts.length > 0 && (
          <div style={{ marginTop: '20px', padding: '10px', borderRadius: '5px' }}>
            <Header as="h2" textAlign="center">
              {user.username}'s Posts
            </Header>
            {posts.map(post => (
              <Segment key={post._id} className="post" style={{}}>
                <div className="post-header">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {post.user.profileimg ? (
                      <img
                        src={`data:${post.user.profileimg.contentType};base64,${post.user.profileimg.data}`}
                        alt="Profile"
                        className="profile-image"
                      />
                    ) : (
                      <CgProfile size={30} />
                    )}
                    <span className="username">{post.user.username}</span>
                  </div>
                </div>
                <p className="post-text">{post.text}</p>
                {post.image && (
                  <img
                    src={`data:${post.image.contentType};base64,${post.image.data}`}
                    alt="Post"
                    className="post-image"
                  />
                )}
              </Segment>
            ))}
          </div>
        )}
        {posts.length === 0 && (
          <div style={{ marginTop: '20px', padding: '10px', borderRadius: '5px' }}>
            <Header as="h2" textAlign="center">
              No posts found
            </Header>
          </div>
        )}
      </div>
      <PeopleToFollow />
    </div>
  );
};

export default ProfilePage;
