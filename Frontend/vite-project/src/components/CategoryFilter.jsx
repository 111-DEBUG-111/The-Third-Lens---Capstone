import React from 'react';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
    const categories = [
        { name: 'All', icon: '🌐', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30 hover:bg-slate-500/30' },
        { name: 'Economy', icon: '💰', color: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30' },
        { name: 'Governance', icon: '🏛️', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30' },
        { name: 'International', icon: '🌍', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30' },
        { name: 'Technology', icon: '💻', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30' },
        { name: 'Environment', icon: '🌱', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30' },
        { name: 'Social', icon: '👥', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/30' },
    ];

    return (
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <span className="text-slate-400 text-sm font-medium whitespace-nowrap">Filter by:</span>
            <div className="flex gap-2">
                {categories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => onCategoryChange(category.name)}
                        className={`
              px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-md 
              transition-all duration-200 whitespace-nowrap flex items-center gap-2
              ${selectedCategory === category.name
                                ? category.color + ' ring-2 ring-offset-2 ring-offset-slate-950'
                                : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700/50'}
            `}
                    >
                        <span className="text-base">{category.icon}</span>
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;
