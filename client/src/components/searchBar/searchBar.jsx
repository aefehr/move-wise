import './searchBar.scss';
import { useEffect, useState } from 'react';

const types = ["Cities", "Companies"];

function SearchBar() {
    const [states, setStates] = useState([]);
    const [query, setQuery] = useState({
        type: "Cities",
        input: "",
        state: "",
    });

    const switchType = (val) => {
        setQuery((prev) => ({ ...prev, type: val }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuery((prev) => ({ ...prev, [name]: value }));
    };

    const cleanInput = (input) => {
        return input.trim().replace(/[^a-zA-Z0-9\s]/g, "");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const input = cleanInput(query.input);
        if (query.type === "Cities") {
            if (!query.state) {
                alert('Please select a state.');
                return; // Stop the form submission
            }
            if (!query.input) {
                alert('Please enter a city.');
                return; // Stop the form submission
            }
            const lowerCaseInput = input.toLowerCase();
            const searchUrl = `/city_info/${lowerCaseInput}/${query.state}`;
            window.location.href = searchUrl;
        } else if (query.type === "Companies") {
            const searchUrl = `/companies/${input}`;
            if (!query.input) {
                alert('Please enter a company name.');
                return; // Stop the form submission
            }
            window.location.href = searchUrl;
        }
    };

    useEffect(() => {
        fetch("http://localhost:8000/api/cities/all_states")
        .then((res) => res.json())
        .then((data) => {
            if (data && Array.isArray(data)) {
                setStates(data);
            }
        })
        .catch((error) => {
            console.error('Error fetching states:', error);
            alert('An error occurred while fetching states. Redirecting to another page.');
            window.location.href = '/';
        });
    }, []);

    return (
        <div className='searchBar'>
            <div className="type">
                {types.map((type) => (
                    <button key={type} onClick={() => switchType(type)} className={query.type === type ? "active" : ""}>{type}</button>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="input" placeholder='Search here...' onChange={handleInputChange} value={query.input}/>
                {query.type === "Cities" && (
                    <select name="state" onChange={handleInputChange} value={query.state}>
                        <option value="">Select State</option>
                        {states.length > 0 && states.map((state) => (
                            <option key={state.state} value={state.state}>{state.state}</option>
                        ))}
                    </select>
                )}
                <button type="submit">
                    <img src="/search.png" alt="Search"/>
                </button>
            </form>
        </div>
    );
}

export default SearchBar;
