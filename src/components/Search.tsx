import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import LocationsModal from "./LocationsModal";
import type { LocationData } from "../models/forecast.model";

const Search = () => {

    const [ modalOpen, setModalOpen ] = useState(false);
    const [ search, setSearch ] = useState('');
    const [ locations, setLocations ] = useState<LocationData[]>([]);
    const [ loading, setLoading ] = useState(false);

    const getLocations = async () => {
        setModalOpen(true)
        setLoading(true);

        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${search}&key=${process.env.REACT_APP_OPEN_CAGE_API_KEY}&countrycode=us`)
            .then((res) => res.json())
            .then((data) => setLocations(
                data.results.map((result:LocationData) => ({ 
                    components: result.components,
                    formatted: result.formatted,
                    geometry: result.geometry
                })
            )))
            .catch(() => setLocations([]))
            .finally(() => {
                setLoading(false)
            })
    }

    return(
        <div className='menuSection'>
            <input placeholder="Search location..." value={search} onChange={(e) => setSearch(e.target.value)} />
            {search && <button onClick={getLocations}>
                <CiSearch />
            </button>}
            <LocationsModal
                title='Search Results'
                isOpen={modalOpen}
                closeModal={() => setModalOpen(false)}
                locations={locations}
                loading={loading}
            />
        </div>
    )
}

export default Search;