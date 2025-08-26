import { IoClose } from "react-icons/io5";
import type { LocationData } from "../models/forecast.model";
import Loading from "./Loading";
import { useGeoLocation } from "../context/GeoLocationContext";

const LocationsModal = ({ title, isOpen, closeModal, locations, loading } : {
    title: string
    isOpen: boolean,
    closeModal: () => void,
    locations: LocationData[],
    loading?: boolean
}) => {
    const { setSearchedLocation } = useGeoLocation();

    const handleSelection = (location: LocationData) => {
        setSearchedLocation(location);
        closeModal();
    }

    return (
        <>
            {isOpen && <div className='modalWrapper' onClick={() => !loading && closeModal()}>
                <div className='modal'>
                    {!loading 
                        && <button>
                            <IoClose className='modalCloseButton' onClick={() => closeModal()}/>
                        </button>
                    }
                    {!loading
                        ? <>
                            <h2 style={{ color: '#1c1c1c'}}>
                                { title }
                            </h2>
                            { locations.length !== 0 
                                ? <div className='modalLocationList'>
                                    {locations.map((location, index) => (
                                        <span
                                            key={location.formatted}
                                            style={{ borderBottom: index !== locations.length - 1 ? '1px solid #eaeaea' : ''}}
                                            onClick={() => handleSelection(location)}
                                        >
                                            { location.formatted.replace(', United States of America', '') }
                                        </span>
                                    ))}
                                </div>
                                : <h3 style={{ color: '#1c1c1c'}}>
                                    No Results
                                </h3>
                            }
                            </>
                        : <Loading />
                    }
                </div>
            </div>}
        </>
    )
}

export default LocationsModal