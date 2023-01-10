'use strict';
const login = async (username, password,page) => {
    await page.goto('https://www.linkedin.com');
    await page.click("input[autocomplete='username']");

    await page.type("input[autocomplete='username']", username, {delay: 100});
    await page.type("input[autocomplete='current-password']", password, {delay: 100});
    await page.click("button[type='submit']");

    await page.waitForSelector(".global-nav");
};

module.exports = login;