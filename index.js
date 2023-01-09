
const puppeteer = require('puppeteer');

const getJobs = async (username, password) => {
    const browser = await puppeteer.launch({ headless: true, });
    const page = await browser.newPage();
    await page.setViewport({"width":1350,"height":976})
  
    await page.goto('https://www.linkedin.com');
    await page.click("input[autocomplete='username']");

    await page.type("input[autocomplete='username']", username, {delay: 100});
    await page.type("input[autocomplete='current-password']", password, {delay: 100});
    await page.click("button[type='submit']");

    await page.waitForSelector(".global-nav");
    await page.goto("https://www.linkedin.com/jobs/");
    await page.waitForSelector(".jobs-job-board-list__footer");
    await page.click(".jobs-job-board-list__footer > .app-aware-link");

    await page.waitForSelector(".jobs-search-results-list");
    const jobsList = await page.$$(".jobs-search-results-list > ul > li");

    const jobs =[];

    for (let i = 0; i < jobsList.length; i++) {
        const job = jobsList[i];

        await job.click();
        await page.waitForSelector(".jobs-unified-top-card__job-title");
        const title = await page.$eval(".jobs-unified-top-card__job-title", (el) => el.innerText);
        await page.waitForSelector(".jobs-unified-top-card__subtitle-primary-grouping");
        const company = await page.$eval(".jobs-unified-top-card__subtitle-primary-grouping", (el) => el.innerText);
        jobs.push({
            title,
            company,
            url: page.url()
        });
        await page.waitForTimeout(1000);
    }

    console.log(JSON.stringify(jobs));

    await browser.close();
}

const init = () => {
    const username = process.argv[2];
    const password = process.argv[3];

    if (!username || !password) {
        console.log("Please provide username and password");
        return;
    }

    getJobs(username, password);
}

init()