import { shallowEqual, useSelector } from "react-redux";
import ShowItems from "../ShowItems/ShowItems";
const HomeComponent = () => {
  const files = [{ name: "file1" }, { name: "file2" }];

  const { isLoading, userFolders } = useSelector(
    (state) => ({
      isLoading: state.filefolders.isLoading,
      userFolders: state.filefolders.userFolders,
    }),
    shallowEqual
  );
  return (
    <div className="col-md-12 w-100">
      {isLoading ? (
        <h1 className="display-1 my-5 text-center">Loading...</h1>
      ) : (
        <>
          <ShowItems
            tittle={"Created Folders"}
            type={"folder"}
            items={userFolders}
          />
          <ShowItems tittle={"Created Files"} type={"files"} items={files} />
        </>
      )}
    </div>
  );
};

export default HomeComponent;
