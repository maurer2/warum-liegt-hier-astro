import { z, defineCollection } from "astro:content";

const navCategoriesInputSchema = z.record(z.string(), z.string().url());
// type NavCategoriesInput = z.infer<typeof navCategoriesInputSchema>;

const navCategories = defineCollection({
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/");
    const data = await response.json();

    const navData = navCategoriesInputSchema.safeParse(data);
    if (!navData.success) {
      throw Error(navData.error.message);
    }

    const navElements = Object.entries(navData.data).map(([id, url]) => ({
      id,
      url,
    }));

    return navElements;
  },
  schema: z.object({
    id: z.string(),
    url: z.string().url(),
  }),
});

export const collections = {
  navCategories,
};
