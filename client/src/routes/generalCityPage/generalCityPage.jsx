import './generalCityPage.scss'
import Filter from "../../components/FilterListing/FilterListing"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";
import FilterCity from '../../components/FilterCity/FilterCity';
function GeneralCityPage() {
  const handleCityFilter = (filterTerm) => {
    console.log("Filter Term:", filterTerm);
    // Add functionality to modify what is displayed on the map based on the filter
  };

  return (
    <div className='generalCityPage'>
      <FilterCity onFilterChange={handleCityFilter} />
      <div className='mapContainer'>
        <Map items={[]} latitude={39.8283} longitude={-98.5795} zoom={5} />
      </div>
    </div>
  );
}

export default GeneralCityPage;