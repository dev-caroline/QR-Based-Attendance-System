import { useState, useEffect, useRef } from 'react';
import { User, Mail, Lock, Bell, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/apiService';
import '../styles/Settings.css';

const Settings = () => {
    const { user } = useAuth();
    const fileInputRef = useRef(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    const [profile, setProfile] = useState({
        fullName: '',
        email: ''
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    useEffect(() => {
        if (user) {
            setProfile({
                fullName: user.fullName,
                email: user.email
            });
            if (user.profileImage) {
                setImagePreview(user.profileImage);
            }
        }
    }, [user]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Image size should be less than 5MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setProfileImage(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const updateData = { ...profile };
            if (imagePreview) {
                updateData.profileImage = imagePreview;
            }
            await updateProfile(updateData);
            setSuccess('Profile updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwords.new !== passwords.confirm) {
            setError('New passwords do not match');
            return;
        }

        if (passwords.new.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            await changePassword({
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            setSuccess('Password changed successfully');
            setPasswords({ current: '', new: '', confirm: '' });
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to change password');
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1 className="settings-title">Settings</h1>
                <p className="settings-subtitle">Manage your account and notification preferences</p>
            </div>

            <div className="settings-layout">
                {/* Sidebar Tabs */}
                <div className="settings-sidebar">
                    <div className="settings-tabs">
                        <button
                            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <User size={20} />
                            <span>Profile</span>
                        </button>
                        <button
                            className={`settings-tab ${activeTab === 'password' ? 'active' : ''}`}
                            onClick={() => setActiveTab('password')}
                        >
                            <Lock size={20} />
                            <span>Password</span>
                        </button>
                        <button
                            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            <Bell size={20} />
                            <span>Notifications</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="settings-content">
                    <div className="settings-card">
                        {success && (
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#d4edda',
                                border: '1px solid #c3e6cb',
                                borderRadius: '6px',
                                color: '#155724',
                                marginBottom: '20px',
                                fontSize: '14px'
                            }}>
                                {success}
                            </div>
                        )}
                        
                        {error && (
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#fee',
                                border: '1px solid #fcc',
                                borderRadius: '6px',
                                color: '#c33',
                                marginBottom: '20px',
                                fontSize: '14px'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Profile Settings */}
                        {activeTab === 'profile' && (
                            <div className="settings-section">
                                <div className="section-header">
                                    <h2 className="section-title">Profile</h2>
                                    <p className="section-subtitle">Update your profile and personal details</p>
                                </div>

                                <div className="settings-profile-section">
                                    <div className="profile-avatar">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Profile" className="avatar-image" />
                                        ) : (
                                            <User size={40} />
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handlePhotoChange}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                        <button 
                                            type="button"
                                            className="change-photo-button"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            Change Photo
                                        </button>
                                        {imagePreview && (
                                            <button
                                                type="button"
                                                className="remove-photo-button"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setProfileImage(null);
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = '';
                                                    }
                                                }}
                                                style={{ marginLeft: '8px' }}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <form onSubmit={handleProfileUpdate} className="settings-form">
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            value={profile.fullName}
                                            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                            className="settings-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="settings-input"
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="save-button">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Password Settings */}
                        {activeTab === 'password' && (
                            <div className="settings-section">
                                <div className="section-header">
                                    <h2 className="section-title">Password</h2>
                                    <p className="section-subtitle">Change your password here</p>
                                </div>

                                <form onSubmit={handlePasswordChange} className="settings-form">
                                    <div className="form-group">
                                        <label className="form-label">Current Password</label>
                                        <div className="password-input-wrapper">
                                            <input
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                value={passwords.current}
                                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                className="settings-input password-input"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="password-toggle"
                                            >
                                                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">New Password</label>
                                        <div className="password-input-wrapper">
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                className="settings-input password-input"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="password-toggle"
                                            >
                                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Confirm New Password</label>
                                        <div className="password-input-wrapper">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                className="settings-input password-input"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="password-toggle"
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="save-button">
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Notifications Settings */}
                        {activeTab === 'notifications' && (
                            <div className="settings-section">
                                <div className="section-header">
                                    <h2 className="section-title">Notifications</h2>
                                    <p className="section-subtitle">Manage how you receive notifications</p>
                                </div>

                                <div className="notifications-list">
                                    <div className="notification-item">
                                        <div>
                                            <h3 className="notification-title">Session Reminders</h3>
                                            <p className="notification-subtitle">Receive notifications when class starts</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={notifications.sessionReminders}
                                                onChange={(e) => setNotifications({ ...notifications, sessionReminders: e.target.checked })}
                                                className="toggle-input"
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="notification-item">
                                        <div>
                                            <h3 className="notification-title">Manual Approval Requests</h3>
                                            <p className="notification-subtitle">Notify me of requests when class starts</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={notifications.manualRequests}
                                                onChange={(e) => setNotifications({ ...notifications, manualRequests: e.target.checked })}
                                                className="toggle-input"
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
