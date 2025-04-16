import React from "react";

interface TextItemProps {
    text: string;
}

const TextItem: React.FC<TextItemProps> = ({ text }) => {
    return (
        <div className="text-container">
            <div className="prose max-w-none">
                {text.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                        {paragraph}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default TextItem;
