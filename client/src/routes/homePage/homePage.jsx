import SearchBar from '../../components/searchBar/searchBar'
import './homePage.scss'

function HomePage(){
  return (
    <div className='homePage'>
        <div className="textContainer">            
            <div className="wrapper"> 
                <h1 className='title'>Move Wise Lorem ipsum dolor sit amet</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
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