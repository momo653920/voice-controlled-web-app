import { useSelector } from "react-redux";
import ShowItems from "../ShowItems/ShowItems";
import { selectRootFolders, selectRootFiles } from "../selectors";
import "./HomeComponent.css";

const HomeComponent = () => {
  const isLoading = useSelector((state) => state.filefolders.isLoading);
  const userFolders = useSelector(selectRootFolders);
  const userFiles = useSelector(selectRootFiles);

  return (
    <div className="home-container">
      {isLoading ? (
        <h1 className="display-1 my-5 text-center">Loading...</h1>
      ) : (
        <>
          <ShowItems title="Папки" type="folder" items={userFolders} />
          <ShowItems title="Файлове" type="files" items={userFiles} />
        </>
      )}
    </div>
  );
};

export default HomeComponent;
