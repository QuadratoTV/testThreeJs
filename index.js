const puppeteer = require('puppeteer');
const fs = require('fs');
const express = require('express')
const app = express()
const port = 3000
const { Semaphore } = require('async-mutex'); // You need to install this package

const semaphore = new Semaphore(3); // Only allow 3 concurrent requests

app.get('/screenshot', (req, res) => {
    semaphore.runExclusive(async () => {
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

        await browser.close();
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})