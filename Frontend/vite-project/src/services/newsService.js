// Mock data for initial development
const MOCK_NEWS = [
    {
        id: 1,
        title: "Global Economic Summit 2025: Key Takeaways",
        category: "Economy",
        timestamp: "2 hours ago",
        image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        neutralSummary: "World leaders gathered to discuss inflation control and sustainable growth. The summit concluded with a joint agreement on carbon tax implementation, though opinions on immediate enforcement varied.",
        perspectives: {
            left: "Focuses on the necessity of the carbon tax for environmental justice and criticizes the delay in implementation.",
            right: "Highlights concerns about the economic burden on businesses and argues for market-driven solutions instead of heavy regulation.",
            neutral: "The agreement marks a significant step, but implementation details remain a point of contention among member nations."
        },
        bias: {
            left: 30,
            center: 40,
            right: 30
        }
    },
    {
        id: 2,
        title: "New Tech Regulation Bill Proposed",
        category: "Governance",
        timestamp: "4 hours ago",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        neutralSummary: "A new bill aims to regulate AI development and data privacy. It proposes stricter audits for large tech companies and new rights for user data control.",
        perspectives: {
            left: "Praises the bill as a long-overdue protection of consumer rights and a check on corporate power.",
            right: "Warns that over-regulation could stifle innovation and put the country at a disadvantage in the global tech race.",
            neutral: "The bill balances safety concerns with innovation needs, though experts disagree on the potential impact on startups."
        },
        bias: {
            left: 45,
            center: 20,
            right: 35
        }
    },
    {
        id: 3,
        title: "International Trade Deal Signed",
        category: "International",
        timestamp: "6 hours ago",
        image: "https://images.unsplash.com/photo-1526304640152-d4619684e484?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        neutralSummary: "Two major powers have signed a trade deal reducing tariffs on agriculture and technology goods, aiming to boost cross-border commerce.",
        perspectives: {
            left: "Expresses concern over potential job losses in local manufacturing and environmental standards.",
            right: "Celebrates the deal as a victory for free markets and a boost for export-driven industries.",
            neutral: "The deal is expected to lower consumer prices, but the long-term effect on domestic labor markets remains to be seen."
        },
        bias: {
            left: 20,
            center: 50,
            right: 30
        }
    }
];

export const getNews = async (page = 1, pageSize = 20) => {
    try {
        const response = await fetch(`http://localhost:5001/api/news?page=${page}&pageSize=${pageSize}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data; // Returns { articles, totalResults }
    } catch (error) {
        console.error("Failed to fetch news:", error);
        return { articles: MOCK_NEWS, totalResults: MOCK_NEWS.length }; // Fallback to mock data on error
    }
};

export const getNewsByCategory = async (category) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (category === "All") {
                resolve(MOCK_NEWS);
            } else {
                resolve(MOCK_NEWS.filter(item => item.category === category));
            }
        }, 500);
    });
};
