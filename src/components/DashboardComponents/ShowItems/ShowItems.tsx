import "./ShowItems.css";

const ShowItems = ({ tittle, items }) => {
  return (
    <div className="w-100">
      <h4 className="text-center border-bottom py-2">{tittle}</h4>
      <div className="row gap-2 p-4 flex-wrap">
        {items.map((item, index) => {
          return (
            <p key={index * 55} className="col-md-2 p-2 text-centre border">
              {item}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default ShowItems;
