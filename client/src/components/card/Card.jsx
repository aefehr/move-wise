import './card.scss'
import { Link } from 'react-router-dom'
import UnsplashImageFetcher from '../UnsplashImgFetcher/UnsplashImgFetcher';
import { realEstateDescriptions } from "../../../assets/RealEstateDescriptions"

function Card({ item }) {
    // Function to get a random description
    const getRandomDescription = () => {
        const randomIndex = Math.floor(Math.random() * realEstateDescriptions.length);
        return realEstateDescriptions[randomIndex];
    };

    return (
        <div className='card'>
            <Link to={`/${item.id}`} className='imageContainer'>
                <UnsplashImageFetcher keyword="furniture and appliance" randomize={true} />
            </Link>
            <div className="textContainer">
                <h2 className="title">
                    <Link to={`/${item.id}`}>{getRandomDescription()}</Link>
                </h2>
                <p className="address">
                    <img src="/pin.png" alt="" />
                    <span>{item.address}</span>
                </p>

                <p className="price">$ {item.price}</p>

                <div className="bottom">
                    <div className="features">
                        <div className="feature">
                            <img src="/bed.png" alt="" />
                            <span>{item.bedroom} bedroom</span>
                        </div>

                        <div className="feature">
                            <img src="/bath.png" alt="" />
                            <span>{item.bathroom} bathroom</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card