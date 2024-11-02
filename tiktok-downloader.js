const puppeteer = require('puppeteer');

class TikTokDownloader {
    constructor() {
        this.baseUrl = 'https://snaptik.app';
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
    }

    async getDownloadLink(tiktokUrl) {
        try {
            const browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-web-security',
                    '--disable-features=IsolateOrigins,site-per-process'
                ]
            });

            const page = await browser.newPage();
            
            await page.setUserAgent(this.userAgent);

            await page.setExtraHTTPHeaders({
                'accept-language': 'en-US,en;q=0.9',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'sec-fetch-site': 'none',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-user': '?1',
                'sec-fetch-dest': 'document',
                'accept-encoding': 'gzip, deflate, br'
            });
            
            await page.goto(this.baseUrl);

            await page.waitForSelector('.link-input');
            await page.type('.link-input', tiktokUrl);

            await page.click('button[type="submit"]');

            await page.waitForSelector('a.download-file');

            const downloadLink = await page.$eval('a.download-file', el => el.href);

            await browser.close();

            if (!downloadLink) {
                throw new Error('No download link found');
            }

            return {
                success: true,
                message: 'Download link found',
                data: {
                    url: downloadLink
                }
            };

        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
}

module.exports = TikTokDownloader; 