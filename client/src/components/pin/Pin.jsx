import './pin.scss'
import { Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import UnsplashImageFetcher from '../UnsplashImgFetcher/UnsplashImgFetcher';
import capitalizeFirstLetter from '../../../assets/helper';

function Pin({ item, pin_city = false }) { // Added pin_city as a prop
    console.log("Pin item:", item); // Check the item data

    return (
        <Marker position={[item.latitude, item.longitude]}>
            <Popup>
                {pin_city ? (
                    <div className="popupContainer">
                        <img src={item.img} alt="" />
                        <div className="textContainer">
                            <Link to={`/${item.id}`}>{item.city}</Link>
                            <span>{item.bedroom}</span>
                            <b>$ {item.price}</b>
                        </div>
                    </div> // Display "Hello world" if pin_city is true
                ) : (
                    <div className="popupContainer">
                        <UnsplashImageFetcher keyword={`city ${item.city}`} alt="" />
                        <div className="textContainer">
                            <Link to={`/city_specific/${item.id}`}>{item.city}</Link>
                            <div>
                                <p>{item.state}</p>
                                <p>Employers: {item.employer_count}</p>
                                <p>Houses: {item.housing_count}</p>
                            </div>

                        </div>
                    </div>
                )}
            </Popup>
        </Marker >
    )
}

export default Pin;
