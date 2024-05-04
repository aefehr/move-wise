import './FilterListing.scss'
// Top would be the result
// Bottom would be the filter
function FilterListing() {
    return (
        <div className='filter'>
            <h1>Search results for <b>Philadelphia</b></h1>

            <div className="bottom">

                <div className="item">
                    <label htmlFor="Price">Price</label>
                    <input type="number" id="Price" name="Price" placeholder="any" />
                </div>

                <div className="item">
                    <label htmlFor="bathroom">Bath</label>
                    <input type="number" id="bathroom" name="bathroom" placeholder="any" />
                </div>

                <div className="item">
                    <label htmlFor="bedroom">Bed</label>
                    <input type="number" id="bedroom" name="bedroom" placeholder="any" />
                </div>

                <div className="item">
                    <label htmlFor="size">Size</label>
                    <input type="number" id="size" name="size" placeholder="any" />
                </div>

                <button>
                    <img src='/search.png' alt='' />
                </button>
            </div>
        </div>
    )
}

export default FilterListing;