import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2, CheckCircle } from 'lucide-react';
import { consultationApi } from '../../api/consultationApi';

// ---------------------------------------------------------
// 1. Dedicated Remote Player Component
// ---------------------------------------------------------
const RemotePlayer = ({ user }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (user.videoTrack && containerRef.current) {
            user.videoTrack.play(containerRef.current);
        }
        return () => {
            if (user.videoTrack) {
                user.videoTrack.stop();
            }
        };
    }, [user.videoTrack]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full max-w-6xl max-h-[80vh] rounded-3xl overflow-hidden bg-black border border-gray-800 shadow-2xl relative flex items-center justify-center"
        >
            {/* Fallback if user doesn't have a video track */}
            {!user.videoTrack && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500 font-bold text-xl md:text-2xl z-10">
                    <VideoOff size={40} className="mr-4"/> Camera Off
                </div>
            )}
        </div>
    );
};

// ---------------------------------------------------------
// 2. Dedicated Local Player Component (Fixes DOM Race Condition)
// ---------------------------------------------------------
const LocalPlayer = ({ track, isVideoOn }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (track && containerRef.current) {
            track.play(containerRef.current);
        }
        return () => {
            if (track) track.stop();
        };
    }, [track]);

    return (
        <div
            ref={containerRef}
            className="absolute bottom-24 right-8 w-32 h-48 md:w-48 md:h-72 bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-700 shadow-2xl z-10"
        >
            {!isVideoOn && (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500 absolute inset-0 z-20">
                    <VideoOff size={32} />
                </div>
            )}
        </div>
    );
};

// ---------------------------------------------------------
// 3. Main Consultation Room Component
// ---------------------------------------------------------
const VideoConsultationRoom = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const client = useRef(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })).current;

    const [localTracks, setLocalTracks] = useState({ videoTrack: null, audioTrack: null });
    const [remoteUsers, setRemoteUsers] = useState([]); 
    const [isJoined, setIsJoined] = useState(false);
    const [hasError, setHasError] = useState('');
    
    // THE FIX: Moved popup state inside the component
    const [showEndPopup, setShowEndPopup] = useState(false);

    const isJoining = useRef(false);

    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);

    useEffect(() => {
        let isUnmounted = false;
        let audioTrack = null;
        let videoTrack = null;

        const initAgora = async () => {
            if (isJoining.current || client.connectionState !== 'DISCONNECTED') return;
            isJoining.current = true;

            try {
                const response = await consultationApi.getCallToken(appointmentId);
                const { rtcToken, channelName, rtcUid, appId } = response.data || response;

                client.on("user-published", async (user, mediaType) => {
                    await client.subscribe(user, mediaType);
                    if (mediaType === "video") {
                        setRemoteUsers(Array.from(client.remoteUsers));
                    }
                    if (mediaType === "audio") {
                        user.audioTrack?.play();
                    }
                });

                client.on("user-unpublished", (user, mediaType) => {
                    setRemoteUsers(Array.from(client.remoteUsers));
                });

                client.on("user-left", (user) => {
                    setRemoteUsers(Array.from(client.remoteUsers));
                });

                await client.join(appId, channelName, rtcToken, rtcUid);

                // Hardware initialization
                try {
                    const [aTrack, vTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                    audioTrack = aTrack;
                    videoTrack = vTrack;
                } catch (deviceError) {
                    console.warn("Camera/Mic combo failed. Attempting Audio-only...", deviceError);
                    try {
                        audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                        if (!isUnmounted) setVideoOn(false);
                    } catch (audioError) {
                        throw new Error('No camera or microphone detected. Please check permissions.');
                    }
                }

                if (!isUnmounted) {
                    setLocalTracks({ audioTrack, videoTrack });
                    const tracksToPublish = [audioTrack, videoTrack].filter(Boolean);
                    if (tracksToPublish.length > 0) {
                        await client.publish(tracksToPublish);
                    }
                    setIsJoined(true);
                }

            } catch (error) {
                console.error("Agora Initialization Failed:", error);
                if (!isUnmounted) setHasError(error.message || 'Failed to connect to the secure consultation room.');
                isJoining.current = false;
            }
        };

        initAgora();

        return () => {
            isUnmounted = true;
            isJoining.current = false;

            // Safe Cleanup
            if (audioTrack) {
                audioTrack.stop();
                audioTrack.close();
            }
            if (videoTrack) {
                videoTrack.stop();
                videoTrack.close();
            }

            client.removeAllListeners();
            if (client.connectionState === 'CONNECTED' || client.connectionState === 'CONNECTING') {
                client.leave();
            }
        };
    }, [appointmentId, client]);

    // ---------------------------------------------------------
    // Media Controls
    // ---------------------------------------------------------
    const toggleMic = async () => {
        if (localTracks.audioTrack) {
            await localTracks.audioTrack.setMuted(micOn);
            setMicOn(!micOn);
        }
    };

    const toggleVideo = async () => {
        if (localTracks.videoTrack) {
            await localTracks.videoTrack.setEnabled(!videoOn);
            setVideoOn(!videoOn);
        }
    };

    const handleEndCall = async () => {
        if (localTracks.audioTrack) {
            localTracks.audioTrack.stop();
            localTracks.audioTrack.close();
        }
        if (localTracks.videoTrack) {
            localTracks.videoTrack.stop();
            localTracks.videoTrack.close();
        }
        if (client.connectionState === 'CONNECTED') {
            await client.leave();
        }
        
        // Route doctor to prescription, but show popup for patient!
        if (window.location.pathname.includes('/doctor/')) {
            navigate(`/doctor/appointments/${appointmentId}/prescription`);
        } else {
            setShowEndPopup(true);
        }
    };

    // ---------------------------------------------------------
    // UI Rendering
    // ---------------------------------------------------------
    if (hasError) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white font-sans p-6 text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                    <VideoOff className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">Connection Error</h2>
                <p className="text-gray-400 max-w-md">{hasError}</p>
                <button
                    onClick={handleEndCall}
                    className="mt-8 px-6 py-2 bg-[#52735B] hover:bg-[#3f5a46] transition-colors rounded-full font-bold text-sm"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    if (!isJoined) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white font-sans">
                <Loader2 className="w-12 h-12 text-[#52735B] animate-spin mb-4" />
                <h2 className="text-xl font-bold tracking-wide">Connecting to Secure Room...</h2>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-950 flex flex-col relative font-sans overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
                <h1 className="text-white text-xl font-bold tracking-wide">Clinical Consultation</h1>
                <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-extrabold tracking-widest border border-red-500/30 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> SECURE
                </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center p-4 pb-28">
                {remoteUsers.length === 0 ? (
                    <div className="text-center text-gray-500">
                        <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-600 font-bold text-2xl animate-pulse">Wait</div>
                        <p>Waiting for the other participant to join...</p>
                    </div>
                ) : (
                    remoteUsers.map(user => (
                        <RemotePlayer key={user.uid} user={user} />
                    ))
                )}

                {localTracks.videoTrack && (
                    <LocalPlayer track={localTracks.videoTrack} isVideoOn={videoOn} />
                )}
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 pb-8 z-20 flex justify-center items-center gap-6 bg-gradient-to-t from-black/80 to-transparent">
                <button
                    onClick={toggleMic}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}
                >
                    {micOn ? <Mic size={24} /> : <MicOff size={24} />}
                </button>

                <button
                    onClick={handleEndCall}
                    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all transform hover:scale-105"
                >
                    <PhoneOff size={28} />
                </button>

                <button
                    onClick={toggleVideo}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${videoOn ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}
                >
                    {videoOn ? <Video size={24} /> : <VideoOff size={24} />}
                </button>
            </div>

            {/* THE FIX: Added Patient Popup UI */}
            {showEndPopup && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                    <div className="bg-white p-8 md:p-10 rounded-[32px] max-w-md text-center shadow-2xl transform transition-all scale-100">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Consultation Complete!</h2>
                        <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                            Your doctor is preparing your notes. You will see the prescription in your appointment details within 30 minutes.
                        </p>
                        <button 
                            onClick={() => navigate('/patient/appointments')} 
                            className="w-full bg-[#4A7C59] hover:bg-[#3a6146] text-white px-6 py-4 rounded-full font-bold transition-colors shadow-sm"
                        >
                            Return to Appointments
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoConsultationRoom;