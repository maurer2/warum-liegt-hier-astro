import { z, defineCollection, getCollection, getEntry } from "astro:content";

const navCategoriesInputSchema = z.record(z.string(), z.string().url());
// type NavCategoriesInput = z.infer<typeof navCategoriesInputSchema>;

// main nav
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

const peopleCategoryInputSchema = z.object({
  count: z.number().int(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(z.record(z.string().or(z.literal("name")), z.any())),
});
type PeopleCategoryInput = z.infer<typeof peopleCategoryInputSchema>;

// todo: add generic approach for all categories
const peopleCategory = defineCollection({
  loader: async () => {
    const peopleNavCategory = await getEntry("navCategories", "people");

    const peopleResults: PeopleCategoryInput["results"] = [];
    let nextPage: string | null = peopleNavCategory.data.url;

    while (nextPage) {
      console.log(`Fetching ${nextPage}`);
      const response = await fetch(nextPage);
      const data = await response.json();

      const categoryData = peopleCategoryInputSchema.safeParse(data);
      if (!categoryData.success) {
        nextPage = null;
        throw Error(categoryData.error.message);
      }

      nextPage = categoryData.data.next ? categoryData.data.next : null;

      peopleResults.push(...categoryData.data.results);
    }

    const peopleEntries = peopleResults.map((person) => ({
      id: person.name, // todo: add proper typing
      entry: person,
    }));

    return peopleEntries;
  },
  // schema: peopleCategoryInputSchema.pick({ results: true }),
  schema: z.any(),
});

export const collections = {
  navCategories,
  peopleCategory,
};
