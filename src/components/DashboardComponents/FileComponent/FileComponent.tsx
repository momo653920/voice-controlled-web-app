import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import Header from "./Header";
import Editor from "./Editor";
import { updateFileData } from "../../../redux/actionCreators/fileFoldersActionCreator";

const FileComponent = ({ fileName }) => {
  const { fileId } = useParams();
  const [fileData, setFileData] = useState("");
  const [prevFileData, setPrevFileData] = useState("");
  const dispatch = useDispatch();

  const { currentFile } = useSelector(
    (state) => ({
      currentFile: state.filefolders.userFiles.find(
        (file) => file.docId === fileId
      ),
    }),
    shallowEqual
  );

  useEffect(() => {
    if (currentFile) {
      setFileData(currentFile.data.data);
      setPrevFileData(currentFile.data.data);
    }
  }, [currentFile]);

  useEffect(() => {
    if (fileData !== prevFileData) {
      dispatch(updateFileData(fileId, fileData));
      setPrevFileData(fileData); // Update previous data to current data after save
    }
  }, [fileData, prevFileData, dispatch, fileId]);

  return (
    <>
      <div>
        <Header fileName={currentFile?.data.name} />
        <Editor data={fileData} setData={setFileData} />
      </div>
    </>
  );
};

export default FileComponent;
