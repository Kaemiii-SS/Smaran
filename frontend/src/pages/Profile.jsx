import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Camera, Save, Award, Activity, Users, FileText, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState('');
    const [degree, setDegree] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { user, ...additionalData } = res.data;
            setProfile(user);
            setStats(additionalData);
            setBio(user.bio || '');
            setDegree(user.degree || '');
            setSpeciality(user.speciality || '');
            setPreviewUrl(user.profilePicUrl || '');
        } catch (error) {
            console.error("Error fetching profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('bio', bio);
            if (profile.role === 'Caretaker') {
                formData.append('degree', degree);
                formData.append('speciality', speciality);
            }
            if (selectedFile) {
                formData.append('profilePic', selectedFile);
            }

            const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/profile`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // Update local storage user data slightly
            const currentUserStr = localStorage.getItem('user');
            if (currentUserStr) {
                const currentUser = JSON.parse(currentUserStr);
                currentUser.profilePicUrl = res.data.profilePicUrl;
                localStorage.setItem('user', JSON.stringify(currentUser));
                window.dispatchEvent(new Event('storage'));
            }

            setProfile(res.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800"></div></div>;
    }

    if (!profile) return null;

    const isPatient = profile.role === 'Patient';

    return (
        <div className="w-full max-w-4xl mx-auto pb-12 mt-8">
            <button 
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-[#1a2e22]/70 hover:text-emerald-800 font-bold transition-colors"
            >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
            </button>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 border border-white/50 rounded-[2rem] shadow-xl overflow-hidden"
            >
                <div className="h-48 bg-gradient-to-r from-emerald-800 to-emerald-600 relative">
                    <div className="absolute -bottom-16 left-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-12 h-12 text-gray-400" />
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 p-2 bg-[#0f1912] hover:bg-emerald-800 text-white rounded-full cursor-pointer shadow-md transition-colors">
                                    <Camera className="w-5 h-5" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-20 px-8 pb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-extrabold text-[#0f1912]">{profile.name}</h1>
                            <p className="text-emerald-700 font-bold mt-1">{profile.role}</p>
                        </div>
                        {!isEditing ? (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-[#0f1912] font-bold rounded-full transition-colors border border-gray-200"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setBio(profile.bio || '');
                                        setDegree(profile.degree || '');
                                        setSpeciality(profile.speciality || '');
                                        setPreviewUrl(profile.profilePicUrl || '');
                                        setSelectedFile(null);
                                    }}
                                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-full transition-colors border border-gray-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2 bg-[#0f1912] hover:bg-emerald-800 text-white font-bold rounded-full transition-colors shadow-md disabled:bg-gray-400"
                                >
                                    {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save</>}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                        {/* Info Column */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-lg font-extrabold text-[#0f1912] flex items-center gap-2 mb-3">
                                    <FileText className="w-5 h-5 text-emerald-700" /> About
                                </h3>
                                {isEditing ? (
                                    <textarea 
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Write a short bio about yourself..."
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-[#0f1912] font-medium"
                                        rows="4"
                                    />
                                ) : (
                                    <p className="text-gray-600 font-medium leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        {profile.bio || "No bio added yet."}
                                    </p>
                                )}
                            </div>

                            {!isPatient && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-extrabold text-[#0f1912] flex items-center gap-2 mb-3">
                                            <Award className="w-5 h-5 text-emerald-700" /> Qualifications
                                        </h3>
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                value={degree}
                                                onChange={(e) => setDegree(e.target.value)}
                                                placeholder="e.g. MS in Gerontology, Registered Nurse"
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-[#0f1912] font-medium"
                                            />
                                        ) : (
                                            <p className="text-gray-600 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                {profile.degree || "No qualifications listed."}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-extrabold text-[#0f1912] flex items-center gap-2 mb-3">
                                            <FileText className="w-5 h-5 text-emerald-700" /> Speciality
                                        </h3>
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                value={speciality}
                                                onChange={(e) => setSpeciality(e.target.value)}
                                                placeholder="e.g. Memory Care, Physical Therapy"
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-[#0f1912] font-medium"
                                            />
                                        ) : (
                                            <p className="text-gray-600 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                {profile.speciality || "No speciality listed."}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-extrabold text-[#0f1912] flex items-center gap-2 mb-3">
                                    Account Info
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-bold text-sm">Username</span>
                                        <span className="text-[#0f1912] font-extrabold">{profile.username}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-bold text-sm">Email</span>
                                        <span className="text-[#0f1912] font-extrabold">{profile.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-bold text-sm">Member Since</span>
                                        <span className="text-[#0f1912] font-extrabold">{new Date(profile.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Column */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-extrabold text-[#0f1912] flex items-center gap-2 mb-3">
                                <Activity className="w-5 h-5 text-emerald-700" /> Statistics
                            </h3>
                            
                            {isPatient ? (
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center">
                                        <p className="text-emerald-800 font-bold mb-1 text-sm">Current Streak</p>
                                        <p className="text-4xl font-extrabold text-emerald-600">{stats.streak || 0} <span className="text-xl">days</span></p>
                                    </div>
                                    <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 text-center">
                                        <p className="text-blue-800 font-bold mb-1 text-sm">Games Played</p>
                                        <p className="text-4xl font-extrabold text-blue-600">{stats.gamesPlayed || 0}</p>
                                    </div>
                                    <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 text-center">
                                        <p className="text-purple-800 font-bold mb-1 text-sm">Average Score</p>
                                        <p className="text-4xl font-extrabold text-purple-600">{stats.averageScore || 0}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center">
                                        <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                                        <p className="text-emerald-800 font-bold mb-1 text-sm">Assigned Patients</p>
                                        <p className="text-4xl font-extrabold text-emerald-600">{stats.patientCount || 0}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
