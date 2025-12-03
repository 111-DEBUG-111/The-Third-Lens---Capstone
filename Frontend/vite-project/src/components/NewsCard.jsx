import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewsCard = ({ article }) => {
    const navigate = useNavigate();
    const { title, source, urlToImage, publishedAt, ideology, description } = article;

    const handleReadAnalysis = (e) => {
        e.preventDefault();
        // Use title slug or a random ID if real ID is missing
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        navigate(`/news/${id}`, { state: { article } });
    };

    const getIdeologyColor = (ideology) => {
        switch (ideology) {
            case 'Left': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Right': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'Neutral': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    return (
        <div className="block group cursor-pointer" onClick={handleReadAnalysis}>
            <div className="glass-card h-full p-0 overflow-hidden flex flex-col hover:scale-[1.02] transition-transform duration-300">
                <div className="relative h-48 w-full overflow-hidden">
                    <img
                        src={urlToImage || 'https://via.placeholder.com/800x400?text=No+Image'}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${getIdeologyColor(ideology)}`}>
                            {ideology}
                        </span>
                    </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {source.name}
                        </span>
                        <span className="text-xs text-slate-500">
                            {new Date(publishedAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {title}
                    </h3>

                    <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                        {description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center text-blue-400 text-sm font-medium">
                        Read Analysis <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsCard;
