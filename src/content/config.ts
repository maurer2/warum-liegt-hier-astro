import { z, defineCollection } from "astro:content";

const navCategories = defineCollection({
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/");
    const data = (await response.json()) as Record<string, string>;

    const navElements = Object.entries(data);

    return navElements.map(([id, url]) => ({
      id,
      url,
    }));
  },
  // schema: z.record(z.string(), z.string().url())
  schema: z.object({
    id: z.string(),
    url: z.string().url(),
  }),
});

export const collections = {
  navCategories,
};
