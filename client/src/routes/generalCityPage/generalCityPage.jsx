import './generalCityPage.scss'
import Filter from "../../components/filterListing/FilterListing"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";

function GeneralCityPage(){
    const handleSearch = (searchTerm) => {
    console.log("Search Term:", searchTerm);
    
  };
  return (
    <div className='generalCityPage'>
      <div className='searchBar'>
        <input type="text" placeholder="Search or filter" onChange={(e) => handleSearch(e.target.value)} />
      </div>
      <div className='mapContainer'>
        <Map items={[]} latitude={39.8283} longitude={-98.5795} zoom={5} />
      </div>
    </div>
  );
}

export default GeneralCityPage