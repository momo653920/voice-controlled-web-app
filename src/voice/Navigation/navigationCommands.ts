import { NavigateFunction } from "react-router-dom";
import fire from "../../config/firebase";
import { getCookie } from "../../components/TrialDashboardComponents/cookieUtils";
import { Commands } from "./commands";

const fetchFileIdByName = async (
  fileName: string,
  userId: string | undefined
): Promise<{ id: string | null; fromCookies: boolean }> => {
  console.log("Fetching file ID for:", fileName);

  if (userId) {
    try {
      const filesSnapshot = await fire
        .firestore()
        .collection("files")
        .where("name", "==", fileName)
        .where("userId", "==", userId)
        .get();

      if (!filesSnapshot.empty) {
        return { id: filesSnapshot.docs[0].id, fromCookies: false };
      } else {
        console.log(`No file found in Firestore with name: ${fileName}`);
      }
    } catch (error) {
      console.error(`Error fetching file ID by name: ${error}`);
    }
  } else {
    const cookies = getCookie("files");
    if (cookies) {
      try {
        const fileList = JSON.parse(cookies) as {
          id: string;
          name: string;
          data: string;
        }[];
        console.log("File list from cookies:", fileList);
        const file = fileList.find((file) => file.name === fileName);
        if (file) {
          return { id: file.id, fromCookies: true };
        } else {
          console.log(`File ${fileName} not found in cookies.`);
        }
      } catch (error) {
        console.error("Error parsing cookies:", error);
      }
    } else {
      console.log("No cookies found for 'files'.");
    }
  }
  return { id: null, fromCookies: false };
};

const fetchFolderIdByName = async (
  folderName: string,
  userId: string | undefined
): Promise<{ id: string | null; fromCookies: boolean }> => {
  if (userId) {
    try {
      const foldersSnapshot = await fire
        .firestore()
        .collection("folders")
        .where("name", "==", folderName)
        .where("userId", "==", userId)
        .get();

      if (!foldersSnapshot.empty) {
        return { id: foldersSnapshot.docs[0].id, fromCookies: false };
      } else {
        console.log(`No folder found with name: ${folderName}`);
      }
    } catch (error) {
      console.error(`Error fetching folder ID by name: ${error}`);
    }
  } else {
    const cookies = getCookie("folders");
    if (cookies) {
      const folderList = JSON.parse(cookies) as { [key: string]: string };
      if (folderList[folderName]) {
        return { id: folderList[folderName], fromCookies: true };
      }
    }
  }
  return { id: null, fromCookies: false };
};

export const navigationCommands = async (
  command: string,
  navigate: NavigateFunction,
  setIsCreateFileModalOpen: (open: boolean) => void,
  setIsCreateFolderModalOpen: (open: boolean) => void,
  setIsTrialCreateFileModalOpen: (open: boolean) => void,
  isTrial: boolean,
  userId: string | undefined
) => {
  console.log("Navigating with command:", command);

  const lowerCaseCommand = command.toLowerCase();

  const isCommandMatch = (commandKey: string): boolean => {
    const phrases = Commands[commandKey];
    if (Array.isArray(phrases)) {
      return phrases.some((phrase) => lowerCaseCommand.startsWith(phrase));
    } else {
      return lowerCaseCommand.startsWith(phrases);
    }
  };

  if (isCommandMatch("OPEN_FILE")) {
    let fileName = lowerCaseCommand.replace(Commands.OPEN_FILE, "").trim();
    if (!fileName.includes(".")) {
      fileName += ".txt";
    }
    const { id: fileId, fromCookies } = await fetchFileIdByName(
      fileName,
      userId
    );
    if (fileId) {
      console.log(`File ID found: ${fileId}`);
      if (fromCookies) {
        navigate(`/trial/file/${fileId}`);
      } else {
        navigate(`/dashboard/file/${fileId}`);
      }
    } else {
      console.error(`File not found: ${fileName}`);
    }
    return;
  }

  if (isCommandMatch("OPEN_FOLDER")) {
    const folderName = lowerCaseCommand
      .replace(Commands.OPEN_FOLDER, "")
      .trim();
    const { id: folderId, fromCookies } = await fetchFolderIdByName(
      folderName,
      userId
    );
    if (folderId) {
      console.log(`Folder ID found: ${folderId}`);
      if (fromCookies) {
        navigate(`/trial/folder/${folderId}`);
      } else {
        navigate(`/dashboard/folder/${folderId}`);
      }
    } else {
      console.error(`Folder not found: ${folderName}`);
    }
    return;
  }

  if (isCommandMatch("HOMEPAGE")) {
    navigate("/");
  } else if (isCommandMatch("GO_BACK")) {
    navigate(-1);
  } else if (isCommandMatch("LOGIN")) {
    navigate("/login");
  } else if (isCommandMatch("REGISTER")) {
    navigate("/register");
  } else if (isCommandMatch("DASHBOARD")) {
    navigate("/dashboard");
  } else if (isCommandMatch("ADMIN")) {
    navigate("/admin");
  } else if (isCommandMatch("CREATE_FILE")) {
    if (isTrial) {
      setIsTrialCreateFileModalOpen(true);
    } else {
      setIsCreateFileModalOpen(true);
    }
  } else if (isCommandMatch("CREATE_FOLDER")) {
    setIsCreateFolderModalOpen(true);
  } else {
    console.error(`Unknown command: ${command}`);
  }
};
