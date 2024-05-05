import './pin.scss'
import { Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import UnsplashImageFetcher from '../UnsplashImgFetcher/UnsplashImgFetcher';
import capitalizeFirstLetter from '../../../assets/helper';

function randomizeCoordinates(latitude, longitude, range = 0.15) {
    // range determines how far the coordinates can vary (in degrees)
    const lat = latitude + (Math.random() - 0.5) * range;
    const lng = longitude + (Math.random() - 0.5) * range;
    return [lat, lng];
}

function Pin({ item, pin_house = false }) {
    // Utility function to randomize coordinates
    const [latitude, longitude] = pin_house
        ? randomizeCoordinates(item.latitude, item.longitude)
        : [item.latitude, item.longitude];

    // Added pin_house as a prop
    // console.log("Pin item", item)
    return (
        <Marker position={[latitude, longitude]}>
            <Popup>
                {pin_house ? (
                    <div className="popupContainer">
                        <div className="textContainer">
                            <UnsplashImageFetcher keyword={`inside luxurious apartment`} randomize={true} alt="" />
                            <Link to={`http://localhost:5173/1`}>Apartment</Link>
                            <span>Beds: {item.bed}</span>
                            <span>Baths: {item.bath}</span>
                            <b>Price: $ {item.price}</b>
                        </div>
                    </div> // Display "Hello world" if pin_house is true
                ) : (
                    <div className="popupContainer">
                        <UnsplashImageFetcher keyword={`city ${item.city}`} alt="" />
                        <div className="textContainer">
                            <Link to={`/city_info/${item.city}/${item.state}`}>{capitalizeFirstLetter(item.city)}</Link>
                            <div>
                                <h3>{capitalizeFirstLetter(item.state)}</h3>
                                <p>Major employers: {item.employer_count}</p>
                                <p>Houses: {item.housing_count}</p>
                                <p>Jobs: {item.jobs}</p>
                                <p>Average house price: $ {Math.round(item.average_house_price)}</p>
                            </div>

                        </div>
                    </div>
                )}
            </Popup>
        </Marker >
    )
}

export default Pin;
