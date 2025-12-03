import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import CategoryFilter from '../components/CategoryFilter';
import { getNews } from '../services/newsService';

// Helper function to categorize articles
const categorizeArticle = (article) => {
  const text = `${article.title} ${article.description} ${article.content}`.toLowerCase();

  if (text.match(/economy|economic|market|stock|business|finance|trade|gdp|inflation/)) return 'Economy';
  if (text.match(/government|governance|policy|legislation|congress|senate|president|election|political/)) return 'Governance';
  if (text.match(/international|foreign|global|world|country|nation|diplomat|treaty/)) return 'International';
  if (text.match(/technology|tech|software|ai|digital|cyber|internet|app|data/)) return 'Technology';
  if (text.match(/environment|climate|green|carbon|pollution|renewable|sustainability/)) return 'Environment';
  if (text.match(/social|society|community|people|culture|education|health/)) return 'Social';

  return 'General';
};

function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await getNews(currentPage, pageSize);
        // Add category to each article
        const articles = data.articles || [];
        const totalResults = data.totalResults || 0;

        const categorizedNews = articles.map(article => ({
          ...article,
          category: categorizeArticle(article)
        }));
        setNews(categorizedNews);
        setTotalPages(Math.ceil(totalResults / pageSize));
      } catch (err) {
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter news based on search and category
  const filteredNews = news.filter(article => {
    const matchesSearch = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.source.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Separate the first article for the Hero section
  const heroArticle = filteredNews.length > 0 ? filteredNews[0] : null;
  const otherArticles = filteredNews.length > 0 ? filteredNews.slice(1) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4 tracking-tight">
            The Third Lens
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            See beyond the bias. Explore news from multiple perspectives with AI-driven analysis.
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">
            {error}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20">
            <div className="glass-card inline-block">
              <svg className="mx-auto h-12 w-12 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No articles found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            {heroArticle && (
              <div className="mb-12">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
                  <img
                    src={heroArticle.urlToImage || 'https://via.placeholder.com/1200x600'}
                    alt={heroArticle.title}
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-md">
                      Top Story
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight max-w-4xl group-hover:text-blue-400 transition-colors">
                      {heroArticle.title}
                    </h2>
                    <p className="text-slate-300 text-lg mb-6 max-w-3xl line-clamp-2">
                      {heroArticle.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="font-medium text-white">{heroArticle.source.name}</span>
                      <span>•</span>
                      <span>{new Date(heroArticle.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherArticles.map((article, index) => (
                <NewsCard key={index} article={article} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-12 gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <span className="text-slate-400">
                Page <span className="text-white font-medium">{currentPage}</span> of <span className="text-white font-medium">{totalPages || 1}</span>
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Home;
