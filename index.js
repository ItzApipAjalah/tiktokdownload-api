const express = require('express');
const TikTokDownloader = require('./tiktok-downloader');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const downloader = new TikTokDownloader();

app.post('/api/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            success: false,
            message: 'TikTok URL is required',
            data: null
        });
    }

    try {
        const result = await downloader.getDownloadLink(url);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 