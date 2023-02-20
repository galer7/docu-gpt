import { api } from "~/utils/api";

function Page() {
  const spreadsheetData = api.gsheets.getSpreadsheetMetaById.useQuery({
    id: "1315KoUHrK7LkZPqv9X1bNbzmivezStZzkhkb-R5jLvw",
  });

  return <div>{JSON.stringify(spreadsheetData.data, null, 2)}</div>;
}

export default Page;
