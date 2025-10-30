import React, { useRef, useEffect, useState, useCallback } from 'react';
import Spinner from './common/Spinner';

interface CameraCaptureProps {
    onCapture: (file: File) => void;
    onBack: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onBack }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access the camera. Please check permissions and try again.");
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                canvas.toBlob(blob => {
                    if (blob) {
                        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
                        onCapture(file);
                        stopCamera();
                    }
                }, 'image/jpeg', 0.9);
            }
        }
    };
    
    if (error) {
        return (
            <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-4">
                <p className="text-red-500 text-center mb-4">{error}</p>
                 <button onClick={onBack} className="bg-gray-700 text-white px-6 py-2 rounded-lg">Go Back</button>
            </div>
        );
    }

    if (!stream) {
        return (
             <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center">
                <Spinner />
                <p className="mt-4">Starting camera...</p>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 flex justify-around items-center">
                 <button onClick={onBack} className="text-white text-sm font-semibold">
                    Cancel
                </button>
                <button onClick={handleCapture} className="w-20 h-20 bg-white rounded-full border-4 border-gray-400 focus:outline-none focus:ring-2 focus:ring-white"></button>
                <div className="w-12"></div>
            </div>
        </div>
    );
};

export default CameraCapture;