import React from 'react';
import { Link } from 'react-router-dom';
import { Edit3 } from 'lucide-react';

const ProfileHeaderCard = ({ profile }) => {
    if (!profile) return null;

    const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Doctor';
    const firstName = profile.first_name || 'Doctor';
    const avatarUrl = profile.profile_image_url || `https://ui-avatars.com/api/?name=${firstName}&background=F3F4F6&color=4A7C59&size=400`;

    return (
        // h-auto on mobile stack, strictly h-64 on desktop to perfectly match ConsultationFeeCard
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-stretch gap-6 lg:gap-10 relative h-auto lg:h-64">
            
            {/* Profile Photo - Fixed sizing to prevent stretching the container */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-2xl bg-gray-100 overflow-hidden border border-gray-100 flex-shrink-0">
                <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col relative w-full h-full justify-between">
                
                {/* Top Right Desktop Edit Button */}
                <div className="absolute top-0 right-0 hidden sm:block">
                    <Link
                        to="/doctor/settings"
                        className="bg-[#4A7C59] hover:bg-[#3a6146] text-white px-6 py-2.5 rounded-full font-bold transition-colors flex items-center gap-2 shadow-sm text-sm"
                    >
                        <Edit3 size={16} />
                        <span>Edit</span>
                    </Link>
                </div>

                {/* Mobile Edit Button */}
                <div className="sm:hidden flex justify-end mb-2">
                    <Link
                        to="/doctor/settings"
                        className="bg-[#4A7C59] text-white px-5 py-2 rounded-full font-bold flex items-center gap-2 shadow-sm text-xs"
                    >
                        <Edit3 size={14} />
                        <span>Edit Profile</span>
                    </Link>
                </div>

                {/* Name & Title - Tighter margin (mb-4) to ensure it fits inside h-64 */}
                <div className="mb-4 sm:pr-32">
                    <h1 className="text-2xl lg:text-3xl leading-tight font-extrabold text-gray-900 mb-2 text-center sm:text-left truncate">
                        Dr. {fullName}
                    </h1>

                    <div className="flex items-center justify-center sm:justify-start gap-2 text-green-700 font-bold text-base lg:text-lg">
                        <span className="w-2 h-2 rounded-full bg-gray-400 mx-1 sm:mx-2"></span>
                        <span className="truncate">{profile.specialization || 'Specialist'}</span>
                    </div>
                </div>

                {/* Bottom Stats Row - Pushed to the bottom using mt-auto */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 lg:gap-14 mt-auto pt-2">
                    <div className="text-center sm:text-left">
                        <p className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase tracking-widest mb-1.5">Status</p>
                        <p className="font-extrabold text-xs text-center bg-[#d6e3da] rounded-3xl text-[#4A7C59] px-3 py-1 inline-block">
                            Active
                        </p>
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase tracking-widest mb-1.5">Experience</p>
                        <p className="font-extrabold text-xs text-center bg-blue-50 rounded-3xl text-blue-600 px-3 py-1 inline-block">
                            {profile.experience_years ? `${profile.experience_years} Years` : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeaderCard;