import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../common/sidebar";
import PeopleToFollow from "../common/peopletofollow.jsx";
import { useAuth } from '../Auth/AuthContext.jsx';
import { CgProfile } from 'react-icons/cg';
import { MenuItem, Menu, Segment, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './styles.css';
import CreatePost from "./CreatePost.jsx";

export default function Home() {
    const { auth } = useAuth();
    const [allPost, setAllPost] = useState([]);
    const [activeItem, setActiveItem] = useState('feed');

    // Define fetchPosts function
    const fetchPosts = async () => {
        try {
            if (auth && auth.token) {
                const headers = {
                    Authorization: `${auth.token}`
                };
                let response;
                if (activeItem === 'feed') {
                    response = await axios.get("http://localhost:5000/api/post/allpost", {
                        headers: headers
                    });
                } else if (activeItem === 'following') {
                    response = await axios.get("http://localhost:5000/api/post/allfollowingpost", {
                        headers: headers
                    });
                }
                setAllPost(response.data.posts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            setAllPost([]);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [auth, activeItem]);

    const handleItemClick = (name) => {
        setActiveItem(name);
    };

    const handleLike = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/post/like/${postId}`, {}, {
                headers: {
                    Authorization: `${auth.token}`
                }
            });
            console.log(response.data.message);
            // Refresh posts after like/unlike
            fetchPosts();
        } catch (error) {
            console.error("Error liking/unliking post:", error);
        }
    };

    const handleComment = async (postId) => {
        try {
            const commentText = prompt("Enter your comment:");
            if (commentText) {
                const response = await axios.post(`http://localhost:5000/api/post/comment/${postId}`, { text: commentText }, {
                    headers: {
                        Authorization: `${auth.token}`
                    }
                });
                console.log(response.data.message);
                // Refresh posts after commenting
                fetchPosts();
            }
        } catch (error) {
            console.error("Error commenting on post:", error);
        }
    };

    const handleShare = (postId) => {
        // Implement share functionality
    };

    return (
        <div className="Home">
            <div className="Container">
                <Sidebar />
                <div className="contentContainer" style={{ marginTop: '20px', borderLeft: '2px solid grey', borderRight: '2px solid grey', minHeight: '500px', margin: '8px' }}>
                    <div className="topMenu">
                        <Menu secondary fluid>
                            <div className="halfMenuItem">
                                <MenuItem
                                    name='feed'
                                    active={activeItem === 'feed'}
                                    onClick={() => handleItemClick('feed')}
                                    style={{ textAlign: 'center', width: '100%' }}
                                />
                            </div>
                            <div className="halfMenuItem">
                                <MenuItem
                                    name='following'
                                    active={activeItem === 'following'}
                                    onClick={() => handleItemClick('following')}
                                    style={{ textAlign: 'center', width: '100%' }}
                                />
                            </div>
                        </Menu>
                    </div>
                    <div className="mainContainer">
                        {activeItem === 'feed' && (
                            <div>
                                <CreatePost />
                                {allPost.map(post => (
                                    <Segment key={post._id} className="post">
                                        <div className="post-header">
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                {post.user.profileimg ? (
                                                    <img src={`data:${post.user.profileimg.contentType};base64,${post.user.profileimg.data}`} alt="Profile" className="profile-image" />
                                                ) : (
                                                    <CgProfile size={30} />
                                                )}
                                                <Link to={`/profile/${post.user.username}`} className="username-link">
                                                    <span className="username">{post.user.username}</span>
                                                </Link>
                                            </div>
                                        </div>
                                        <p className="post-text">{post.text}</p>
                                        {post.image && (
                                            <img src={`data:${post.image.contentType};base64,${post.image.data}`} alt="Post" className="post-image" />
                                        )}
                                        <div className="post-actions">
                                            <Button color='red' size='small' onClick={() => handleLike(post._id)}>
                                                <Icon name='heart' /> Like
                                            </Button>
                                            <Button color='blue' size='small' onClick={() => handleComment(post._id)}>
                                                <Icon name='comment' /> Comment
                                            </Button>
                                            <Button color='green' size='small' onClick={() => handleShare(post._id)}>
                                                <Icon name='share' /> Share
                                            </Button>
                                        </div>
                                    </Segment>
                                ))}
                            </div>
                        )}
                        {activeItem === 'following' && (
                            <div>
                                {allPost.map(post => (
                                    <Segment key={post._id} className="post">
                                        <div className="post-header">
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                {post.user.profileimg ? (
                                                    <img src={`data:${post.user.profileimg.contentType};base64,${post.user.profileimg.data}`} alt="Profile" className="profile-image" />
                                                ) : (
                                                    <CgProfile size={30} />
                                                )}
                                                <Link to={`/profile/${post.user.username}`} className="username-link">
                                                    <span className="username">{post.user.username}</span>
                                                </Link>
                                            </div>
                                        </div>
                                        <p className="post-text">{post.text}</p>
                                        {post.image && (
                                            <img src={`data:${post.image.contentType};base64,${post.image.data}`} alt="Post" className="post-image" />
                                        )}
                                        <div className="post-actions">
                                            <Button color='red' size='small' onClick={() => handleLike(post._id)}>
                                                <Icon name='heart' /> Like
                                            </Button>
                                            <Button color='blue' size='small' onClick={() => handleComment(post._id)}>
                                                <Icon name='comment' /> Comment
                                            </Button>
                                            <Button color='green' size='small' onClick={() => handleShare(post._id)}>
                                                <Icon name='share' /> Share
                                            </Button>
                                        </div>
                                    </Segment>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <PeopleToFollow />
            </div>
        </div>
    );
}
