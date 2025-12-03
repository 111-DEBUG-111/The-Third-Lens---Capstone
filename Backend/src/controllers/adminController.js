const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all news (filtered by user)
exports.getAllNews = async (req, res) => {
    try {
        const news = await prisma.news.findMany({
            where: { userId: req.user.id },
            orderBy: { publishedAt: 'desc' }
        });
        res.json(news);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Error fetching news' });
    }
};

// Create new article
exports.createNews = async (req, res) => {
    try {
        const { title, description, content, url, urlToImage, source, category, ideology } = req.body;

        const newArticle = await prisma.news.create({
            data: {
                title,
                description,
                content,
                url,
                urlToImage,
                source,
                category: category || 'General',
                ideology: ideology || 'Neutral',
                publishedAt: new Date(),
                userId: req.user.id
            }
        });

        res.status(201).json(newArticle);
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({ message: 'Error creating news' });
    }
};

// Update article
exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, content, url, urlToImage, source, category, ideology } = req.body;

        const article = await prisma.news.findUnique({ where: { id: parseInt(id) } });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        if (article.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this article' });
        }

        const updatedArticle = await prisma.news.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                content,
                url,
                urlToImage,
                source,
                category,
                ideology
            }
        });

        res.json(updatedArticle);
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ message: 'Error updating news' });
    }
};

// Delete article
exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        const article = await prisma.news.findUnique({ where: { id: parseInt(id) } });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        if (article.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this article' });
        }

        await prisma.news.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ message: 'Error deleting news' });
    }
};
