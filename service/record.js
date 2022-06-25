module.exports = async (req, res) => {
    const { getStream, launch } = require("../dist/PuppeteerStream");
    const puppeteer = require("puppeteer");

    const fs = require("fs");

    const filename = `${process.cwd()}/video/${new Date().getTime()}.webm`;

    const file = fs.createWriteStream(filename);

    const browser = await launch(puppeteer, {
        headless: true,
        defaultViewport: null,
        args: [
            "--no-sandbox",
            "--window-size=1920,1080",
            "--window-position=1921,0",
            "--autoplay-policy=no-user-gesture-required"
        ]
    });

    const page = await browser.newPage();

    const blocked_domains = ["googlesyndication.com", "adservice.google.com"];

    await page.setRequestInterception(true);
    page.on("request", (request) => {
        const url = request.url();
        if (blocked_domains.some((domain) => url.includes(domain))) {
            request.abort();
        } else {
            request.continue();
        }
    });

    await page.goto(req.body.url, {
        waitUntil: "networkidle0"
    });

    const stream = await getStream(page, { video: true });
    stream.pipe(file);

    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 1;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 10);
        });
    });

    await stream.destroy();
    file.close();

    await browser.close();

    res.send({ message: `https://143.244.132.244/video/${filename.split("/")[2]}` });
};
