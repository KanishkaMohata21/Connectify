import React from 'react';
import { MenuItem, Menu } from 'semantic-ui-react';
import { useAuth } from '../Auth/AuthContext.jsx';

export default function MergedMenu() {
    const { auth, setAuth } = useAuth();

    const handleLogout = () => {
        // Clear auth state and localStorage
        setAuth({ user: null, token: '' });
        localStorage.removeItem('auth');
    };

    return (
        <div className="Sidebar">
            <h2 style={{ fontSize: "32px", marginBottom: '40px', marginTop: '20px' }}>Connectify</h2>
            <Menu secondary vertical>
                <MenuItem
                    name='home'
                    active={window.location.pathname === '/'}
                    onClick={() => window.location.pathname = '/'}
                    style={{ fontSize: '16px' }}
                >
                    Home
                </MenuItem>
                <MenuItem
                    name='notification'
                    active={window.location.pathname === '/notification'}
                    onClick={() => window.location.pathname = '/notification'}
                    style={{ fontSize: '16px' }}
                >
                    Notification
                </MenuItem>
                {auth.user ? (
                    <MenuItem
                        name='profile'
                        active={window.location.pathname === `/profile/${auth.user.username}`}
                        onClick={() => window.location.pathname = `/profile/${auth.user.username}`}
                        style={{ fontSize: '16px' }}
                    >
                        My Profile
                    </MenuItem>
                ) : null}
                {/* <MenuItem
                    name='message'
                    active={window.location.pathname === '/chat'}
                    onClick={() => window.location.pathname = '/chat'}
                    style={{ fontSize: '16px' }}
                >
                    Message
                </MenuItem> */}
                {auth.user ? (
                    <MenuItem
                        name='logout'
                        onClick={handleLogout}
                        style={{ fontSize: '16px' }}
                    >
                        Logout
                    </MenuItem>
                ) : (
                    <MenuItem
                        name='login'
                        onClick={() => window.location.pathname = '/login'}
                        style={{ fontSize: '16px' }}
                    >
                        Login
                    </MenuItem>
                )}
            </Menu>
        </div>
    );
}
