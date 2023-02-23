import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

export const openAiRouter = createTRPCRouter({
  fillSpreadsheet: protectedProcedure
    .input(z.object({ asciiTable: z.string() }))
    .query(async ({ input: { asciiTable } }) => {
      const prompt = `Can you fill in this table for me?

      ${asciiTable}`;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0,
        max_tokens: 7,
      });

      return response.data;
    }),
});
