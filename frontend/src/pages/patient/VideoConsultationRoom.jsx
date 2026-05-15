import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2 } from 'lucide-react';
import { consultationApi } from '../../api/consultationApi';

// ---------------------------------------------------------
// 1. Dedicated Remote Player Component (Fixes Race Conditions)
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
            className="w-full h-full rounded-3xl overflow-hidden bg-black border border-gray-800 shadow-2xl relative"
        >
            {/* Fallback if user turns off their camera */}
            {!user.hasVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500 font-bold text-2xl z-10">
                    Participant Camera Off
                </div>
            )}
        </div>
    );
};

// ---------------------------------------------------------
// 2. Main Consultation Room Component
// ---------------------------------------------------------
const VideoConsultationRoom = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    // 🚨 FIX: Bind client to component lifecycle to prevent global leaks
    const client = useRef(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })).current;

    const [localTracks, setLocalTracks] = useState({ videoTrack: null, audioTrack: null });
    const [remoteUsers, setRemoteUsers] = useState({});
    const [isJoined, setIsJoined] = useState(false);
    const [hasError, setHasError] = useState('');

    const isJoining = useRef(false);
    const localPlayerRef = useRef(null);

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

                // Listeners
                client.on("user-published", async (user, mediaType) => {
                    await client.subscribe(user, mediaType);
                    if (mediaType === "video") {
                        setRemoteUsers(prev => ({ ...prev, [user.uid]: { ...user, hasVideo: true } }));
                    }
                    if (mediaType === "audio") {
                        user.audioTrack?.play();
                    }
                });

                client.on("user-unpublished", (user, mediaType) => {
                    if (mediaType === "video") {
                        setRemoteUsers(prev => ({ ...prev, [user.uid]: { ...user, hasVideo: false } }));
                    }
                });

                client.on("user-left", (user) => {
                    setRemoteUsers(prev => {
                        const newUsers = { ...prev };
                        delete newUsers[user.uid];
                        return newUsers;
                    });
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

    // Attach Local Video safely via Ref
    useEffect(() => {
        if (localTracks.videoTrack && localPlayerRef.current) {
            localTracks.videoTrack.play(localPlayerRef.current);
        }
        return () => {
            if (localTracks.videoTrack) localTracks.videoTrack.stop();
        };
    }, [localTracks.videoTrack]);

    // ---------------------------------------------------------
    // 3. Media Controls (Fixed Privacy LED Bug)
    // ---------------------------------------------------------
    const toggleMic = async () => {
        if (localTracks.audioTrack) {
            // setMuted is perfectly fine for audio, keeps the stream alive but silent
            await localTracks.audioTrack.setMuted(micOn);
            setMicOn(!micOn);
        }
    };

    const toggleVideo = async () => {
        if (localTracks.videoTrack) {
            // 🚨 FIX: setEnabled actually turns off the hardware camera LED
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
        await client.leave();
        navigate('/patient/appointments');
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
                    onClick={() => navigate('/patient/appointments')}
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

            <div className="flex-1 relative flex items-center justify-center p-4">
                {Object.keys(remoteUsers).length === 0 ? (
                    <div className="text-center text-gray-500">
                        <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-600 font-bold text-2xl">Doc</div>
                        <p>Waiting for the other participant to join...</p>
                    </div>
                ) : (
                    Object.values(remoteUsers).map(user => (
                        <RemotePlayer key={user.uid} user={user} />
                    ))
                )}

                <div
                    ref={localPlayerRef}
                    className="absolute bottom-24 right-8 w-32 h-48 md:w-48 md:h-72 bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-700 shadow-2xl z-10"
                >
                    {!videoOn && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500 absolute inset-0 z-20">
                            <VideoOff size={32} />
                        </div>
                    )}
                </div>
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
        </div>
    );
};

export default VideoConsultationRoom;