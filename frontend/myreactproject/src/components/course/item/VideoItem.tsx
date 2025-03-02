import React from "react";

interface VideoItemProps {
    url: string;
}

const VideoItem: React.FC<VideoItemProps> = ({ url }) => {
    // Transform URL if it's a YouTube link
    const getEmbedUrl = (url: string) => {
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(youtubeRegex);
        
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return url;
    };

    return (
        <div className="video-container">
            <div className="video-wrapper relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={getEmbedUrl(url)}
                    title="Video content"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
};

export default VideoItem;
