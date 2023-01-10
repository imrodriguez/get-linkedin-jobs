'use strict';
const puppeteer = require('puppeteer');
const login = require('./utils/login');
const getJobsList = require('./utils/getJobsList');
require('dotenv').config()

const getJobs = async (username, password, search) => {
    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();
    await page.setViewport({"width":1350,"height":976});

    await login(username, password, page);

    await page.goto("https://www.linkedin.com/jobs/");
    await page.waitForSelector(".jobs-job-board-list__footer");
    await page.click(".jobs-job-board-list__footer > .app-aware-link");

    if (search) {
        await page.waitForSelector(".jobs-search-box__text-input");
        await page.type(".jobs-search-box__text-input", search, {delay: 100});
        await page.keyboard.press('Enter');
        await page.waitForTimeout(5000);
    }

    const jobs = await getJobsList(page);

    await browser.close();

    return JSON.stringify(jobs);
};

const init = async () => {
    const username = process.argv[2];
    const password = process.argv[3];
    const search = process.argv[4];

    if (!username || !password) {
        console.log("Please provide username and password");
        return;
    }

    const jobs = await getJobs(username, password, search);

    console.log(jobs);
};

init();