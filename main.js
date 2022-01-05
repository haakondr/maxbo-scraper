const puppeteer = require("puppeteer");
const fs = require("fs");

const findAndWaitFor = async (page, selector) => {
  await page.waitForSelector(selector);
  return await page.$(selector);
};

const findAndWaitForXpath = async (page, xpath) => {
  await page.waitForXPath(xpath);
  return await page.$x(xpath);
};

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.maxbo.no/bjorkeved-15-kg-ca-40l-p2259774/");

  const cookieButton = await findAndWaitFor(
    page,
    '[aria-label="Godkjenn alle"]'
  );
  await cookieButton.click();

  const [availabilityButton] = await findAndWaitForXpath(
    page,
    "//button[contains(., 'butikker')]"
  );
  await availabilityButton.click();

  await page.waitForSelector("[city=Oslo]");

  const stores = await page.$$eval("[city=Oslo]", (els) =>
    els.map((el) => el.innerHTML)
  );
  const inStock = stores.filter((s) => !s.includes("Ikke på lager"));
  console.log(`::set-output name=INSTOCK::${inStock.length > 0}`);
  await browser.close();
})();
