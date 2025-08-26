import { useState, useEffect } from 'react'
import { useGeoLocation } from './context/GeoLocationContext';
import type { HourForecast, LocationData } from './models/forecast.model';
import { getDayForecast } from './utils/forecastUtils';
import Menu from './components/Menu';
import DayForecast from './components/DayForecast';
import WeekForecast from './components/WeekForecast';
import Charts from './components/Charts';
import Loading from './components/Loading';

const AppContent = () => {
    const {
        searchedLocation,
        showContextError,
        selectedDate,
        contextLoading
    } = useGeoLocation();

    const [ forecast, setForecast ] = useState([]);
    const [ dayForecast, setDayForecast ] = useState<HourForecast[]>([]);
    const [ currentLocation, setCurrentLocation ] = useState<LocationData>();
    const [ showErrorMessage, setShowErrorMessage ] = useState(false);

    const defaultLocation = searchedLocation ? searchedLocation : currentLocation;

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            fetch(`https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude},+${position.coords.longitude}&key=${process.env.REACT_APP_OPEN_CAGE_API_KEY}`)
                .then((res) => res.json())
                .then((data) => {
                    setCurrentLocation({
                        components: data.results[0].components,
                        formatted: data.results[0].formatted,
                        geometry: data.results[0].geometry
                    })
                }).catch(() => setShowErrorMessage(true))
            fetch(`https://api.weather.gov/points/${position.coords.latitude},${position.coords.longitude}`)
                .then((res) => res.json())
                .then((data) => {
                    fetch(data.properties.forecastHourly)
                        .then((res) => res.json())
                        .then((forecastData) => {
                            setForecast(forecastData.properties.periods);
                            getDayForecast(selectedDate, forecastData.properties.periods, setDayForecast);
                        }).catch(() => setShowErrorMessage(true))
                }).catch(() => setShowErrorMessage(true))
            
        },
        () => setShowErrorMessage(true));
    }, []);

    useEffect(() =>  {
        if(forecast) {
            getDayForecast(selectedDate, forecast, setDayForecast);
        }
    }, [ selectedDate ])

    if(showErrorMessage || showContextError){
        return <header>
            <h1>
                Sorry, there was an error
            </h1>
            <h2>
                Please Refresh
            </h2>
        </header>
    }

    if (forecast.length === 0 || !currentLocation || contextLoading) {
        return <Loading />
    }

    return (
        <>
            <header>
                <Menu />
                <h1>
                    { defaultLocation?.formatted.replace(', United States of America', '') }
                </h1>
            </header>
            <main>
                <DayForecast dayForecast={dayForecast} />
                <WeekForecast forecast={forecast} />
                <Charts
                    dayForecast={dayForecast}
                    currentLocation={currentLocation}
                />
            </main>
        </>
    )
}

export default AppContent
