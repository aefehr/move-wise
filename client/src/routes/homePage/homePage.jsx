import SearchBar from '../../components/searchBar/searchBar'
import './homePage.scss'

function HomePage(){
  return (
    <div className='homePage'>
        <div className="textContainer">            
            <div className="wrapper"> 
                <h1 className='title'>Move Wise - Relocation Assistance with Insights</h1>
                <p>
                    This tool simplifies the relocation decision-making process for job seekers by providing a dashboard that combines real estate and rental market insights across different U.S. cities/regions with information about companies located in these regions and job market details
                </p>
                <SearchBar/>
                <div className="boxes">
                    <div className="box">
                        <h1>9234</h1>
                        <h2>Cities</h2>
                    </div>
                      <div className="box">
                        <h1>23942</h1>
                        <h2>Listings</h2>
                    </div>
                      <div className="box">
                        <h1>345823485</h1>
                        <h2>Users</h2>
                    </div>
                </div>
            </div>
        </div>
        <div className="imgContainer">
            <img src='/trans_logo.png' alt='' />
        </div>
    </div>
  )
}

export default HomePage