import axios from "axios";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getAccessToken } from "../utils";

export const gsheetsRouter = createTRPCRouter({
  getSpreadsheetById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const accessToken = await getAccessToken(ctx.session.user.id);

      // TODO: Maybe use GApis here?
      const spreadsheetRes = await axios.get<Spreadsheet>(
        `https://sheets.googleapis.com/v4/spreadsheets/${id}`,
        {
          params: { includeGridData: true },
          headers: {
            Authorization: `Bearer ${accessToken as string}`,
          },
        }
      );


      return spreadsheetRes.data.sheets[0].data;
    }),
});

interface Spreadsheet {
  sheets: [
    {
      data: Record<string, never>;
    }
  ];
}
