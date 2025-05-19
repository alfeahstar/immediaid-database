const express = require('express');
const router = express.Router();
const News = require('../News');

// POST /api/news
router.post('/', async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const news = new News({ title, content, image });
    await news.save();
    res.status(201).json({ message: 'News saved', news });
  } catch (error) {
    console.error('Error saving news:', error);
    res.status(500).json({ error: 'Failed to save news' });
  }
});

// GET /api/news - Fetch all news
router.get('/', async (req, res) => {
  try {
    const allNews = await News.find().sort({ createdAt: -1 });
    res.json(allNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to load news' });
  }
});

// DELETE /api/news/:id
router.delete("/:id", async (req, res) => {
  try {
    const result = await News.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "News not found" });
    res.json({ message: "News deleted" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ error: "Failed to delete news" });
  }
});



module.exports = router;
