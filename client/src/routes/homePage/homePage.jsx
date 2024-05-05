import SearchBar from '../../components/searchBar/searchBar'
import './homePage.scss'

function HomePage() {
    return (
        <div className='homePage'>
            <div className="textContainer">
                <div className="wrapper">
                    <h1 className='title'>Relocation Assistance with Insights</h1>
                    <p>
                        Explore your ideal home, with information about jobs, cost of living, and more!
                    </p>
                    <SearchBar />
                    <div className="boxes">
                        <div className="box">
                            <h1>377</h1>
                            <h2>U.S Cities</h2>
                        </div>
                        <div className="box">
                            <h1>2 millions +</h1>
                            <h2>Houses for Sale listings</h2>
                        </div>
                        <div className="box">
                            <h1>3 millions +</h1>
                            <h2>Jobs</h2>
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