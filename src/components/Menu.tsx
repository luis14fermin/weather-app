import { useGeoLocation } from "../context/GeoLocationContext";
import Search from "./Search";
import Favorite from "./Favorite";

const Menu = () => {

    const { setSearchedLocation, searchedLocation } = useGeoLocation()

    return (
        <div className='menuWrapper'>
            {searchedLocation
                ? <button onClick={() => setSearchedLocation(undefined)}>
                    Back To My Location
                </button>
                : <Search />
            }
            <Favorite />
        </div>
    )
}

export default Menu