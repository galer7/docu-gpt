import Spreadsheet, { createEmptyMatrix } from "react-spreadsheet";

import { api } from "~/utils/api";

function Page() {
  const { isLoading, isError, error, data } =
    api.gsheets.getSpreadsheetValuesById.useQuery({
      id: "1315KoUHrK7LkZPqv9X1bNbzmivezStZzkhkb-R5jLvw",
    });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const { rawData, height, width } = data;
  const matrix = createEmptyMatrix<{ value: string }>(height, width);

  const rows = rawData.values;
  rows.forEach((cols, i) =>
    cols.forEach((value, j) => {
      matrix[i][j] = { value };
    })
  );

  return (
    <div>
      <Spreadsheet data={matrix} />
      <div>{JSON.stringify(matrix, null, 2)}</div>
    </div>
  );
}

export default Page;
