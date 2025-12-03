import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const data = await response.json();
            setUser({
                name: data.name,
                email: data.email
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('http://localhost:5001/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully' });
                setUser({
                    name: data.name,
                    email: data.email
                });
            } else {
                setMessage({ type: 'error', text: data.message || 'Update failed' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile' });
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and will delete all your articles.')) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:5001/api/users/profile', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    const data = await response.json();
                    setMessage({ type: 'error', text: data.message || 'Delete failed' });
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                setMessage({ type: 'error', text: 'Failed to delete account' });
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Profile Form */}
                        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-8">
                            <h2 className="text-xl font-semibold text-white mb-6">Personal Information</h2>

                            {message.text && (
                                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-900' : 'bg-red-900/50 text-red-400 border border-red-900'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={user.name}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-red-900/10 rounded-xl border border-red-900/30 p-8">
                            <h2 className="text-xl font-semibold text-red-500 mb-4">Danger Zone</h2>
                            <p className="text-slate-400 mb-6">
                                Once you delete your account, there is no going back. Please be certain.
                                All your articles and data will be permanently removed.
                            </p>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Profile;
