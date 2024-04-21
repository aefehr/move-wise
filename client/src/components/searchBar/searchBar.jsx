import './searchBar.scss';
import { useState } from 'react';

const types = ["city", "job"]

function SearchBar(){
    const [query, setQuery] = useState({
        type: "City",
        location: "",
        minPrice: 0,
        maxPrice: 0,
    })

    const switchType = (val) => {
        setQuery((prev) => ({...prev, type:val}));
    };
  return (
    <div className='searchBar'>
        <div className="type">
            {types.map((type) => (
                <button key={type} onClick={() => switchType(type)} className={query.type === type ? "active" : ""} > {type}</button>
            )
            
            )}
        </div>
        <form>
            <input type="text" name="location" placeholder='City'/>
            <input type="number" name="minPrice" min={0} max={100000}  placeholder='Min Price'/>
            <input type="text" name="maxPrice" min={0} max={1000000} placeholder='Max Price'/>
            <button>
                <img src="/search.png" alt=''/>
            </button>
        </form>
    </div>
  )
}

export default SearchBar