import { useEffect } from 'react';
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { LocationData, HourForecast } from '../models/forecast.model';
import { getDayForecast } from '../utils/forecastUtils';

type GeoLocationType = {
    searchedLocation?: LocationData;
    setSearchedLocation: (location: LocationData|undefined) => void;
    searchedForecast: HourForecast[];
    searchedDayForecast: HourForecast[];
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    favoriteLocations: LocationData[];
    setFavoriteLocations: (locations: LocationData[] ) => void;
    showContextError: boolean;
    contextLoading: boolean;
};

const GeoLocationContext = createContext<GeoLocationType | undefined>(undefined);

export const GeoLocationProvider = ({ children }: { children: ReactNode }) => {
    const [ searchedLocation, setSearchedLocation ] = useState<LocationData|undefined>();
    const [ searchedForecast, setSearchedForecast ] = useState<HourForecast[]>([]);
    const [ searchedDayForecast, setSearchedDayForecast ] = useState<HourForecast[]>([]);
    const [ selectedDate, setSelectedDate ] = useState<string>(new Date().toLocaleDateString('en-CA'));
    const [ favoriteLocations, setFavoriteLocations ] = useState<LocationData[]>([]);
    const [ contextLoading, setContextLoading ] = useState(false);
    const [ showContextError, setShowContextError ] = useState(false);

    useEffect(() => {
        if(searchedLocation) {
            setContextLoading(true);
            fetch(`https://api.weather.gov/points/${searchedLocation.geometry.lat},${searchedLocation.geometry.lng}`)
                .then((res) => res.json())
                .then((data) => {
                    fetch(data.properties.forecastHourly)
                        .then((res) => res.json())
                        .then((forecastData) => {
                            setSearchedForecast(forecastData.properties.periods);
                            getDayForecast(selectedDate, forecastData.properties.periods, setSearchedDayForecast);
                    })
                    .catch(() => setShowContextError(true))
                    .finally(() => setContextLoading(false))
                }).catch(() => setShowContextError(true))
            }
    }, [ searchedLocation ]);

    useEffect(() =>  {
        if(searchedDayForecast) {
            getDayForecast(selectedDate, searchedForecast, setSearchedDayForecast);
        }
    }, [ selectedDate ])

    return (
        <GeoLocationContext.Provider value={{
                searchedLocation,
                setSearchedLocation,
                searchedForecast,
                searchedDayForecast,
                selectedDate,
                setSelectedDate,
                favoriteLocations,
                setFavoriteLocations,
                showContextError,
                contextLoading,
            }}
        >
            {children}
        </GeoLocationContext.Provider>
    );
};

export const useGeoLocation = () => {
    const context = useContext(GeoLocationContext);
    if (!context) throw new Error('useGeoLocation must be used within a UIProvider');
    return context;
};
