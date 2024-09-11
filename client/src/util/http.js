import { QueryClient } from "@tanstack/react-query";
import * as contentful from "contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

export const queryClient = new QueryClient();

export const contentfulClient = contentful.createClient({
  space: "txuxa7flpqcr",
  environment: "master", // defaults to 'master' if not set
  accessToken: "hcOyfOg4L-jMO3T57kAN2jB5PcEn70tYq4EZImKEuwc",
});

export async function getWeeklyPost(entryID) {
  try {
    const entry = await contentfulClient.getEntry(entryID);
    const rawRichTextField = entry.fields.body;
    const renderedHtml = documentToHtmlString(rawRichTextField);
    document.getElementById("weeklyRecap").innerHTML = renderedHtml;
  } catch (error) {}
}
