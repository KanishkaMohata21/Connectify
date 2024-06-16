import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListHeader, ListContent } from 'semantic-ui-react';
import { CgProfile } from 'react-icons/cg';
import { useAuth } from '../Auth/AuthContext.jsx';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

export default function PeopleToFollow() {
    const { auth } = useAuth();
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    useEffect(() => {
        async function fetchSuggestedUsers() {
            try {
                if (auth && auth.token) {
                    const headers = {
                        Authorization: `${auth.token}`
                    };
                    const response = await axios.get("http://localhost:5000/api/user/suggested", {
                        headers: headers
                    });
                    setSuggestedUsers(response.data.suggestedUsers);
                }
            } catch (error) {
                console.error("Error fetching suggested users:", error);
            }
        }
        fetchSuggestedUsers();
    }, [auth]); // Include auth object in the dependency array

    const handleFollow = async (userId) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/user/follow/${userId}`, {}, {
                headers: {
                    Authorization: `${auth.token}`
                }
            });
            console.log(response.data.message);
            // Optionally, you can refresh the list of suggested users after following
            // fetchSuggestedUsers();
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: "20px", marginBottom: '10px', marginTop: '20px' }}>People To Follow</h2>
            <List selection verticalAlign='middle'>
                {suggestedUsers.map((user) => (
                    <ListItem key={user._id} style={{ display: 'flex', alignItems: 'center' }}>
                        {user.profileimg ? (
                            <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <img
                                    src={`data:${user.profileimg.contentType};base64,${user.profileimg.data}`}
                                    alt="Profile"
                                    className="profile-image"
                                    style={{ borderRadius: '50%', width: '30px', height: '30px', objectFit: 'cover', marginRight: '10px', border: '2px solid black' }}
                                />
                            </Link>
                        ) : (
                            <CgProfile size={30} style={{ marginRight: '10px' }} />
                        )}
                        <ListContent>
                            <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ListHeader><h2 style={{ fontSize: '16px' }}>{user.username}</h2></ListHeader>
                                <p>{user.bio}</p>
                            </Link>
                        </ListContent>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}
