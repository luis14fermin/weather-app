import { useState } from 'react';
import { useGeoLocation } from "../context/GeoLocationContext";
import { FaRegStar, FaStar } from "react-icons/fa";
import LocationsModal from './LocationsModal';

const Favorite = () => {
    
    const { searchedLocation, favoriteLocations, setFavoriteLocations } = useGeoLocation();
    const [ modalOpen, setModalOpen ] = useState(false);

    const favorite = favoriteLocations.filter(location => location.formatted === searchedLocation?.formatted).length > 0;

    const handleFavorite = () => {
        if (searchedLocation) {
            if (favorite) {
                setFavoriteLocations(favoriteLocations.filter(location => location.formatted !== searchedLocation?.formatted));
            } else {
                setFavoriteLocations([ ...favoriteLocations, searchedLocation ])
            }
        }
    }

    return(
        <div className='menuSection'>
            { searchedLocation 
                && <button onClick={handleFavorite} aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}>
                    { favorite ? <FaStar /> : <FaRegStar /> }
                </button>
            }
            <button onClick={() => setModalOpen(true)}>
                View Favorites
            </button>
            <LocationsModal
                title='Favorites'
                isOpen={modalOpen}
                closeModal={() => setModalOpen(false)}
                locations={favoriteLocations}
                loading={false}
            />
        </div>
    )
}

export default Favorite;