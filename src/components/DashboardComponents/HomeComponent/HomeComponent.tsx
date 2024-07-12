import ShowItems from "../ShowItems/ShowItems";
const HomeComponent = () => {
  const folders = [
    "item1",
    "item2",
    "item3",
    "item4",
    "item5",
    "item6",
    "item7",
    "item8",
    "item9",
    "item10",
  ];
  const files = [
    "file1",
    "file2",
    "file3",
    "file4",
    "file5",
    "file6",
    "file7",
    "file8",
    "file9",
    "file10",
  ];

  return (
    <div className="col-md-12 w-100">
      <ShowItems tittle={"Created Folders"} items={folders} />
      <ShowItems tittle={"Created Files"} items={files} />
    </div>
  );
};

export default HomeComponent;
