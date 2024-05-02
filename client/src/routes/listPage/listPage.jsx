import { listData } from "../../lib/dummydata";
import "./listPage.scss";
import Filter from "../../components/filterListing/FilterListing"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";
import FilterListing from "../../components/filterListing/FilterListing";

function ListPage() {
  const data = listData;

  return <div className="listPage">
    <div className="listContainer">
      <div className="wrapper">
        <FilterListing/>
        {data.map(item=>(
          <Card key={item.id} item={item}/>
        ))}
      </div>
    </div>
    <div className="mapContainer">
      <Map items={data} latitude={39.9526} longitude={-75.1652} zoom={14}/>
    </div>
  </div>;
}

export default ListPage;