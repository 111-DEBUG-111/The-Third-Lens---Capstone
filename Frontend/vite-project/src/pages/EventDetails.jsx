import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function EventDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const article = location.state?.article;

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!article) {
            navigate('/home');
            return;
        }

        const fetchAnalysis = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/news/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: article.title,
                        description: article.description,
                        content: article.content,
                        source: article.source.name
                    }),
                });

                if (!response.ok) throw new Error('Analysis failed');

                const data = await response.json();
                setAnalysis(data);
            } catch (error) {
                console.error("Analysis error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [article, navigate]);

    if (!article) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to News
                </button>

                {/* Original Article Header */}
                <article className="mb-12">
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full">
                            {article.source.name}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex items-center text-slate-400 text-sm">
                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                Read Original Article
                            </a>
                        </div>
                    </div>

                    <img
                        src={article.urlToImage || 'https://via.placeholder.com/1200x600'}
                        alt={article.title}
                        className="w-full h-[400px] object-cover rounded-2xl shadow-2xl mb-8"
                    />

                    <p className="text-lg text-slate-300 leading-relaxed mb-8">
                        {article.description}
                    </p>
                </article>

                {/* AI Analysis Section */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">AI Analysis</h2>
                    </div>

                    {loading ? (
                        <div className="glass-card animate-pulse">
                            <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-slate-700 rounded w-1/2 mb-8"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="h-32 bg-slate-700 rounded"></div>
                                <div className="h-32 bg-slate-700 rounded"></div>
                            </div>
                        </div>
                    ) : analysis ? (
                        <div className="space-y-6">
                            {/* Neutral Summary */}
                            <div className="glass-card border-l-4 border-l-purple-500">
                                <h3 className="text-lg font-semibold text-purple-400 mb-2">Neutral Summary</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    {analysis.neutralSummary}
                                </p>
                            </div>

                            {/* Perspectives Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Perspective */}
                                <div className="glass-card border-t-4 border-t-blue-500">
                                    <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                        Left-Wing Perspective
                                    </h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        {analysis.leftPerspective}
                                    </p>
                                </div>

                                {/* Right Perspective */}
                                <div className="glass-card border-t-4 border-t-red-500">
                                    <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                                        Right-Wing Perspective
                                    </h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        {analysis.rightPerspective}
                                    </p>
                                </div>
                            </div>

                            {/* Bias Meter */}
                            <div className="glass-card">
                                <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Article Bias Score</h3>
                                <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-slate-500 to-red-500 opacity-50"></div>
                                    <div
                                        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-1000"
                                        style={{ left: `${((analysis.biasScore + 10) / 20) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                                    <span>Left (-10)</span>
                                    <span>Neutral (0)</span>
                                    <span>Right (+10)</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-red-400 p-8 glass-card">
                            Failed to load analysis. Please try again later.
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default EventDetails;
