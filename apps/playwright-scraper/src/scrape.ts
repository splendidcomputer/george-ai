import playwright, { Page } from "playwright-chromium";
import { franc } from "franc-min";

export interface ScrapeResult {
  title: string;
  url: string;
  content: string;
  links: string[];
  language: string;
}

const acceptCookies = async (page: playwright.Page) => {
  try {
    const acceptCookies = await page
      .getByText(/alle akzeptieren/i)
      .getByRole("button");
    const buttons = await acceptCookies.all();
    if (buttons.length > 0) {
      const isVisible = await buttons[0].isVisible();
      if (isVisible) {
        await buttons[0].click();
      }
    }
  } catch (e) {
    console.error("Error accepting cookies", e);
  }
};

const isValidLink = (link: string | null): link is string => {
  return link !== null && link.length > 0 && !link.startsWith("#");
};

const extractLinks = async (page: Page): Promise<string[]> => {
  const linkLocators = await page.locator("a").all();
  const links = await Promise.all(
    linkLocators.map((ll) => ll.getAttribute("href"))
  );
  return Array.from(new Set(links.filter(isValidLink)));
};

export const scrapePage = async (
  url: string,
  context: playwright.BrowserContext
): Promise<ScrapeResult> => {
  const page = await context.newPage();
  await page.goto(url, { timeout: 60_000 });
  await acceptCookies(page);
  const pageTitle = await page.title();
  const body = await page.locator("main");
  const texts =
    pageTitle +
    "\n\n" +
    (await body.allTextContents())
      .map((text) => text.replace(/\s\s+/g, " "))
      .join("\n");
  const language = franc(texts);
  console.log("language: ", language);
  const links = await extractLinks(page);
  await page.close();
  return {
    title: pageTitle,
    url,
    content: texts,
    links,
    language,
  };
};
