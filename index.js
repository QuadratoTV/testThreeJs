const puppeteer = require('puppeteer');
const fs = require('fs');
const express = require('express')
const app = express()
const port = 3000

app.get('/screenshot', (req, res) => {
    (async () => {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
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

        // Wait for the renderer to draw at least one frame
        await delay(6000);

        // Take a screenshot of the canvas
        const screenshotBuffer = await page.screenshot({encoding: 'binary'});

        // Send the screenshot as a response
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': screenshotBuffer.length
        });

        res.end(screenshotBuffer);

        await browser.close();
    })();

    function delay(time) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
