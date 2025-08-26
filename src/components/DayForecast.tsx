import type { HourForecast } from "../models/forecast.model";
import { useGeoLocation } from "../context/GeoLocationContext";
import ForecastIcon from "./ForecastIcon"
import { getHour } from "../utils/forecastUtils";

const DayForecast = ({ dayForecast }: { 
    dayForecast: HourForecast[],
}) => {

    const { searchedDayForecast, searchedLocation } = useGeoLocation()
    const defaultDayForecast = searchedLocation ? searchedDayForecast : dayForecast;

    return (
        <section className='forecastWrapper'>
            <div className='forecastScrollWrapper dayForecast'>
                {defaultDayForecast.map((period) => (
                    <div key={period.startTime} className='card'>
                        <span>
                            { getHour(period.startTime) }
                        </span>
                        <ForecastIcon
                            shortForecast={period.shortForecast}
                            style={{ fontSize: '2rem'}}
                        />
                        <span>
                            { period.temperature }
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default DayForecast;