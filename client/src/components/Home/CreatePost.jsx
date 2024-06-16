import React, { useState } from 'react';
import { Button, Form, TextArea } from 'semantic-ui-react';
import { FaRegImage } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../Auth/AuthContext.jsx';
import axios from "axios";

const CreatePost = () => {
    const { auth } = useAuth();
    const [postContent, setPostContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Handle change in post content
    const handlePostChange = (e) => {
        setPostContent(e.target.value);
    };

    // Handle change in selected image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);

        // Preview the selected image
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    // Convert image file to base64
    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Handle post submission
    const handlePostSubmit = async (e) => {
        e.preventDefault();

        try {
            const imageBase64 = selectedImage ? await toBase64(selectedImage) : null;

            const postData = {
                text: postContent,
                img: imageBase64 ? imageBase64.split(',')[1] : null // Remove base64 prefix
            };

            const config = {
                headers: {
                    Authorization: `${auth.token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.post('http://localhost:5000/api/post/create', postData, config);

            console.log(response.data.message); // Log success message
            setPostContent(''); // Clear post content
            setSelectedImage(null); // Clear selected image
            setImagePreview(null); // Clear image preview
            toast.success('Post created successfully'); // Display success toast notification
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error('Failed to create post'); // Display error toast notification
        }
    };

    return (
        <Form style={{ background: 'white', padding: '20px', borderRadius: '15px' }}>
            <div style={{ position: 'relative' }}>
                <TextArea
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={handlePostChange}
                    style={{ 
                        fontSize: '1.3rem', 
                        height: '100px', 
                        background: 'white', 
                        borderRadius: '10px', 
                        padding: '10px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageChange} 
                    style={{ display: 'none' }}
                />
                <label 
                    htmlFor="imageUpload" 
                    style={{ 
                        position: 'absolute', 
                        bottom: '10px', 
                        left: '10px', 
                        cursor: 'pointer' 
                    }}
                >
                    <FaRegImage size={20} />
                </label>
                <Button 
                    primary 
                    onClick={handlePostSubmit}
                    style={{ 
                        position: 'absolute', 
                        bottom: '10px', 
                        right: '10px',
                        borderRadius: '10px',
                        fontSize: '1rem'
                    }}
                >
                    Post
                </Button>
                {imagePreview && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <img
                            src={imagePreview}
                            alt="Selected preview"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                                borderRadius: '5px',
                                boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                    </div>
                )}
            </div>
            <ToastContainer /> {/* Toast container for displaying notifications */}
        </Form>
    );
};

export default CreatePost;
