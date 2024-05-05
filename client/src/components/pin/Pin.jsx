import './pin.scss'
import { Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import UnsplashImageFetcher from '../UnsplashImgFetcher/UnsplashImgFetcher';
import capitalizeFirstLetter from '../../../assets/helper';
function Pin({ item, pin_house = false }) { // Added pin_house as a prop
    return (
        <Marker position={[item.latitude, item.longitude]}>
            <Popup>
                {pin_house ? (
                    <div className="popupContainer">
                        <img src={item.img} alt="" />
                        <div className="textContainer">
                            <Link to={`${item.id}`}>{item.city}</Link>
                            <span>{item.bedroom}</span>
                            <b>$ {item.price}</b>
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
