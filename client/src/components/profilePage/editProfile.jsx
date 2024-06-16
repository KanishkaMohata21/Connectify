import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Message, Header, Image, Icon } from "semantic-ui-react";
import { useAuth } from "../Auth/AuthContext.jsx";
import DefaultProfileImg from '../../assets/defaultImg.jpg'; // Import default profile image

const EditProfile = ({ user, setUser, setIsEditing }) => {
  const { auth } = useAuth();
  const [editProfileData, setEditProfileData] = useState({
    fullname: user.username || "",
    email: user.email || "",
    bio: user.bio || "",
    profileimg: user.profileimg || "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [editProfileMessage, setEditProfileMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData({
      ...editProfileData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.replace(/^data:image\/(jpeg|jpg|png);base64,/, "") || null;
      setProfileImage(base64String); // Set base64 string as profile image without prefix
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();

    const profileData = {
      username: editProfileData.fullname,
      email: editProfileData.email,
      bio: editProfileData.bio,
      profileimg: profileImage, // Send base64 string
    };

    try {
      const headers = {
        Authorization: `${auth.token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        `http://localhost:5000/api/user/update`,
        profileData,
        { headers }
      );
      console.log(profileData)
      setEditProfileMessage({ type: "success", content: response.data.message });
      setUser(response.data.user); // Update user state in parent component
      setIsEditing(false); // Close edit profile modal or navigate back
    } catch (err) {
      setEditProfileMessage({ type: "error", content: err.response?.data?.error || "Error updating profile" });
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <Header as="h3" textAlign="center" style={{ marginBottom: "20px" }}>
        Edit Profile
      </Header>
      <Form onSubmit={handleEditProfileSubmit}>
        <Form.Field>
          <label>Full Name</label>
          <input
            type="text"
            name="fullname"
            value={editProfileData.fullname}
            onChange={handleInputChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={editProfileData.email}
            onChange={handleInputChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Bio</label>
          <textarea
            name="bio"
            value={editProfileData.bio}
            onChange={handleInputChange}
            style={{ height: '30px' }}
          />
        </Form.Field>
        <Form.Field>
          <label>Profile Image</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="file"
              name="profileimg"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="profileImgInput"
            />
            <Button
              type="button"
              icon
              labelPosition="left"
              onClick={() => document.getElementById("profileImgInput").click()}
            >
              <Icon name="image" />
              Choose Image
            </Button>
            {profileImage ? (
              <Image
                src={`data:image/jpeg;base64,${profileImage}`} // Ensure correct image data format
                size="small"
                circular
                centered
                style={{ marginLeft: "20px" }}
              />
            ) : (
              <Image
                src={editProfileData.profileimg || DefaultProfileImg}
                size="small"
                circular
                centered
                style={{ marginLeft: "20px" }}
              />
            )}
          </div>
        </Form.Field>
        <div style={{ margin: '30px 0px' }}>
          <Button type="submit" primary>Update Profile</Button>
          <Button onClick={() => setIsEditing(false)} secondary>Cancel</Button>
        </div>
      </Form>
      {editProfileMessage && (
        <Message
          positive={editProfileMessage.type === "success"}
          negative={editProfileMessage.type === "error"}
          style={{ marginTop: "20px" }}
        >
          {editProfileMessage.content}
        </Message>
      )}
    </div>
  );
};

export default EditProfile;
