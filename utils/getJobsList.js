'use strict';
const getJobsList = async (page) => {
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

    return jobs;
};

module.exports = getJobsList;