const puppeteer = require('puppeteer');
const fs = require('fs');
const imgur = require('imgur');

imgur.setClientId('4777e903cbb1acf');

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

    await page.goto("https://rw.pitpath.net/render/index.html?car=bmw_m4_gt3&liveryId=667359f242e4f748f5aaf41e&baseRoughness=0.3&clearCoat=1.0&clearCoatRoughness=0.3&metallic=1.0");

    // Wait for the renderer to draw at least one frame
    await delay(4000);

    // Take a screenshot of the canvas
    const screenshotBuffer = await page.screenshot({encoding: 'binary'});

    // Save the screenshot
    fs.writeFileSync('thumbnail.png', screenshotBuffer);

    imgur.uploadFile('thumbnail.png')
        .then((json) => {
            console.log(json.data.link);
        })
        .catch((err) => {
            console.error(err.message);
        });

    await browser.close();

    process.stdin.resume();
})();

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
