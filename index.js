const puppeteer = require('puppeteer');
const fs = require('fs');
const express = require('express')
const app = express()
const port = 3000

let browser;

app.get('/screenshot', (req, res) => {
    (async () => {
        const page = await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
        });

        // Navigate to the page
        const url = decodeURIComponent(req.query.url);

        console.log(url)

        await page.goto(url);

        // Wait for the spinner to disappear
        await page.waitForFunction(
            "document.querySelector('div.spinner') && document.querySelector('div.spinner').style.display === 'none'"
        );

        // Take a screenshot of the canvas
        const screenshotBuffer = await page.screenshot({encoding: 'binary'});

        // Send the screenshot as a response
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': screenshotBuffer.length
        });

        res.end(screenshotBuffer);

        await page.close();
    })();
});

puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
}).then(browserInstance => {
    browser = browserInstance;

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
});

