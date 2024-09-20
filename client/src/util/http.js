import { QueryClient } from "@tanstack/react-query";
import * as contentful from "contentful";

export const queryClient = new QueryClient();

export const contentfulClient = contentful.createClient({
  space: "txuxa7flpqcr",
  environment: "master", // defaults to 'master' if not set
  accessToken: "hcOyfOg4L-jMO3T57kAN2jB5PcEn70tYq4EZImKEuwc",
});

export async function getWeeklyRecaps() {
  try {
    // const entry = await contentfulClient.getEntry(entryID);
    const response = await contentfulClient.getEntries();
;
    return response.items;
  } catch (error) {}
}
