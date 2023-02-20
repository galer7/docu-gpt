import useDrivePicker from "react-google-drive-picker";

import { api } from "~/utils/api";

function GoogleDrivePicker() {
  const [openPicker] = useDrivePicker();
  const accessTokenQuery = api.example.getAccessToken.useQuery();

  const handleOpenPicker = () => {
    openPicker({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      developerKey: process.env.NEXT_PUBLIC_DEVLEOPER_KEY as string,
      viewId: "SPREADSHEETS",
      token: accessTokenQuery.data ?? "",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false,
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
        console.log(data);

        // TODO: Get something like spreadsheetId from this and call fetchSpreadsheetById
      },
    });
  };

  return (
    <div>
      <button onClick={() => handleOpenPicker()}>Open Picker</button>
    </div>
  );
}

export default GoogleDrivePicker;
