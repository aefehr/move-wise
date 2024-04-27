import './singlePage.scss'
import Slider from "../../components/slider/Slider"
import { singlePostData,userData } from '../../lib/dummydata'
import Map from '../../components/map/Map'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
// Skipping slider as its not relevant to our usecase
function SinglePage(){
     // Dummy data for the radar charts
    const dataJob = [
        { name: 'Engineering', value: 0.7 },
        { name: 'Marketing', value: 0.8 },
        { name: 'Design', value: 0.9 },
        { name: 'Sales', value: 0.85 },
        { name: 'Support', value: 0.65 },
    ];

    const dataCostOfLiving = [
        { name: 'Rent', value: 0.4 },
        { name: 'Food', value: 0.8 },
        { name: 'Transportation', value: 0.9 },
        { name: 'Utilities', value: 0.5 },
        { name: 'Misc', value: 0.7 },
    ];

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
                <p className="title">Area Information Overview</p>
                 <div className="charts">
                        <ResponsiveContainer width="45%" height="45%" aspect={1}>
                            <RadarChart outerRadius={50} data={dataJob}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="name" />
                                <PolarRadiusAxis angle={30} domain={[0, 1]} />
                                <Radar name="Job" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                        <ResponsiveContainer width="45%" height="45%" aspect={1}>
                            <RadarChart outerRadius={50} data={dataCostOfLiving}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="name" />
                                <PolarRadiusAxis angle={30} domain={[0, 1]} />
                                <Radar name="Cost of Living" dataKey="value" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
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