import axios from "axios";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getAccessToken } from "../utils";

export const gsheetsRouter = createTRPCRouter({
  /**
   * Get values of first sheet of spreadsheet
   */
  getSpreadsheetValuesById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const accessToken = await getAccessToken(ctx.session.user.id);

      // TODO: Maybe use GApis here?
      const response = await axios.get<SpreadsheetValuesData>(
        `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/A:Z`,
        {
          headers: {
            Authorization: `Bearer ${accessToken as string}`,
          },
        }
      );

      return response.data;
    }),

  /**
   * Get merged status for cells.
   * This will help us determine tables (?)
   */
  getSpreadsheetMetaById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const accessToken = await getAccessToken(ctx.session.user.id);

      const response = await axios.get<SpreadsheetMetaData>(
        `https://sheets.googleapis.com/v4/spreadsheets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken as string}`,
          },
        }
      );

      return response.data.sheets[0].merges;
    }),
});

interface SpreadsheetValuesData {
  values: Array<Array<string>>;
}

interface SpreadsheetMetaData {
  sheets: [
    {
      merges: {
        sheetId: number;
        startRowIndex: number;
        endRowIndex: number;
        startColumnIndex: number;
        endColumnIndex: number;
      }[];
    }
  ];
}
