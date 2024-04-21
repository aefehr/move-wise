import './singlePage.scss'
import Slider from "../../components/slider/Slider"
import { singlePostData,userData } from '../../lib/dummydata'
import Map from '../../components/map/Map'

// Skipping slider as its not relevant to our usecase
function SinglePage(){
  return (
    <div className='singlePage'>
        <div className="details">
            <div className="wrapper">
                <Slider images={singlePostData.images}/>
                <div className="info">
                    <div className="top">
                        <div className="post">
                            <h1>{singlePostData.title}</h1>
                            <div className="address">
                                <img src="/pin.png" alt=""/>
                                <span>{singlePostData.address}</span>
                            </div>
                            <div className="price">$ {singlePostData.price}</div>
                        </div>
                        <div className="user">
                            <img src={userData.img} alt=""/>
                            <span>{userData.name}</span>
                        </div>
                    </div>
                    <div className="bottom">
                        {singlePostData.description}
                    </div>
                </div>
            </div>
        </div>
        <div className="features">
            <div className="wrapper">
                <p className="title">General</p>
                <div className="listVertical">
                    <div className="feature">
                        <img src="utility.png" alt="" />
                        <div className="featureText">
                            <span>Utilities</span>
                            <p>Renter is responsible</p>
                        </div>
                    </div>
                    <div className="feature">
                        <img src="pet.png" alt="" />
                        <div className="featureText">
                            <span>Pet Policy</span>
                            <p>Allowed</p>
                        </div>
                    </div>
                    <div className="feature">
                        <img src="fee.png" alt="" />
                        <div className="featureText">
                            <span>Fees</span>
                            <p>Must have 3x rent in total household income</p>
                        </div>
                    </div>

                </div>
                <p className="title">Sizes</p>
                <div className="sizes">
                    <div className="size">
                        <img src="/size.png" alt='' />
                        <span>888 sqft</span>
                    </div>
                    <div className="size">
                        <img src="/bed.png" alt='' />
                        <span>2 beds</span>
                    </div><div className="size">
                        <img src="/bath.png" alt='' />
                        <span>1 bath</span>
                    </div>
                </div>
                <p className="title">Near by</p>
                <div className="listHorizontal">
                    <div className="feature">
                        <img src="/school.png" alt='' />
                        <span>1 m away</span>
                    </div>
                    <div className="feature">
                        <img src="/bus.png" alt='' />
                        <span>1 m away</span>
                    </div><div className="feature">
                        <img src="/restaurant.png" alt='' />
                        <span>built in</span>
                    </div>
                </div>
                <p className="title">Locations</p>
                <div className="mapContainer">
                    <Map items={[singlePostData]}/>
                </div>
                <div className="buttons">
                    <button>
                        <img src="/chat.png" alt="" />
                        Send a message
                    </button>

                    <button>
                        <img src="/save.png" alt="" />
                        Save
                    </button>
                </div>

            </div>
        </div>
    </div>
  )
}

export default SinglePage