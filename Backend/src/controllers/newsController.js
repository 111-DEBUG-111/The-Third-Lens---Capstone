const axios = require('axios');

// Simple ideological classification based on source name
// In a real app, this would be a more comprehensive database or AI-driven
const sourceBiasMap = {
    'CNN': 'Left',
    'MSNBC': 'Left',
    'The New York Times': 'Left',
    'The Washington Post': 'Left',
    'Fox News': 'Right',
    'Breitbart News': 'Right',
    'The Wall Street Journal': 'Right',
    'New York Post': 'Right',
    'BBC News': 'Neutral',
    'Reuters': 'Neutral',
    'Associated Press': 'Neutral',
    'USA Today': 'Neutral',
    'Bloomberg': 'Neutral'
};

const classifySource = (sourceName) => {
    return sourceBiasMap[sourceName] || 'Neutral';
};

exports.getNews = async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) {
            // Fallback to mock data if no key is provided, to prevent app crash during dev
            console.warn("NEWS_API_KEY not found. Returning mock data.");
            return res.json({
                articles: [
                    {
                        source: { name: "Mock News Source" },
                        title: "Please add NEWS_API_KEY to Backend/.env to fetch real news",
                        description: "This is a placeholder article because the API key is missing.",
                        url: "#",
                        urlToImage: "https://via.placeholder.com/800x400?text=No+API+Key",
                        publishedAt: new Date().toISOString(),
                        content: "Please sign up at newsapi.org to get a free API key."
                    }
                ].map(article => ({
                    ...article,
                    ideology: classifySource(article.source.name)
                }))
            });
        }

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;

        const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
            params: {
                country: 'us',
                apiKey: apiKey,
                pageSize: pageSize,
                page: page
            }
        });

        const articlesWithIdeology = response.data.articles.map(article => ({
            ...article,
            ideology: classifySource(article.source.name)
        }));

        res.json({
            articles: articlesWithIdeology,
            totalResults: response.data.totalResults
        });
    } catch (error) {
        console.error('Error fetching news:', error.message);
        res.status(500).json({ message: 'Server Error fetching news' });
    }
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.analyzeNews = async (req, res) => {
    try {
        const { title, description, content, source } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: "GEMINI_API_KEY not configured" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
      Analyze the following news article:
      Title: ${title}
      Source: ${source}
      Description: ${description}
      Content: ${content}

      Please provide a JSON response with the following fields:
      1. "neutralSummary": A balanced, objective summary of the event (2-3 sentences).
      2. "leftPerspective": How a left-wing/progressive viewpoint might interpret this event.
      3. "rightPerspective": How a right-wing/conservative viewpoint might interpret this event.
      4. "biasScore": A number from -10 (Far Left) to +10 (Far Right), with 0 being Neutral, representing the likely bias of the input article.
      
      Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown formatting if Gemini adds it despite instructions
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const analysis = JSON.parse(cleanText);
        res.json(analysis);

    } catch (error) {
        console.error('Error analyzing news:', error);
        res.status(500).json({
            message: 'Error generating analysis',
            neutralSummary: "AI Analysis unavailable at the moment.",
            leftPerspective: "Unavailable",
            rightPerspective: "Unavailable",
            biasScore: 0
        });
    }
};
