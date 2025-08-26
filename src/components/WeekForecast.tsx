import type { HourForecast} from "../models/forecast.model";
import { useGeoLocation } from '../context/GeoLocationContext';
import ForecastIcon from "./ForecastIcon"


type DailyDataEntry = {
    day: string;
    max: number;
    min: number;
    forecastCounts: Record<string, number>;
};

type DailySummary = {
    date: string;
    day: string;
    max: number;
    min: number;
    shortForecast: string;
};

const WeekForecast = ({ forecast }: { 
    forecast: HourForecast[],
}) => {

    const {
        selectedDate,
        setSelectedDate,
        searchedForecast,
        searchedLocation
    } = useGeoLocation();

    const defaultForecast = searchedLocation ? searchedForecast : forecast;

    const getDailyHighsAndLows = (periods: HourForecast[]): DailySummary[] => {
        const dailyData: Record<string, DailyDataEntry> = {};

        periods.forEach((period) => {
            const dateObj = new Date(period.startTime);
            const date = dateObj.toLocaleDateString('en-CA');
            const day = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        
            const temp = period.temperature;
            const forecast = period.shortForecast;
        
            if (!dailyData[date]) {
                dailyData[date] = {
                    day,
                    max: temp,
                    min: temp,
                    forecastCounts: { [forecast]: 1 },
                };
            } else {
                dailyData[date].max = Math.max(dailyData[date].max, temp);
                dailyData[date].min = Math.min(dailyData[date].min, temp);
                dailyData[date].forecastCounts[forecast] =
                    (dailyData[date].forecastCounts[forecast] || 0) + 1;
            }
        });
        
        return Object.entries(dailyData).map(([date, data]: [string, DailyDataEntry]) => {
            const mostCommonForecast = Object.entries(data.forecastCounts)
            .sort((a, b) => b[1] - a[1])[0][0];
        
            return {
                date,
                day: data.day,
                max: data.max,
                min: data.min,
                shortForecast: mostCommonForecast,
            };
        });
    }

    return (
        <section className='forecastWrapper'>
            <div className='forecastScrollWrapper weekForecast'>
                {getDailyHighsAndLows(defaultForecast).map((period, index) => (
                    <div
                        key={period.date}
                        onClick={() => setSelectedDate(period.date)}
                        className={`card ${period.date === selectedDate && 'selectedDate'}`}
                        style={{ cursor: period.date === selectedDate ? 'auto' : 'pointer', transition: 'background-color 0.3s ease'}}
                    >
                        <span>
                            { index === 0 ? 'Today' : period.day }
                        </span>
                        <ForecastIcon
                            shortForecast={period.shortForecast}
                            style={{ fontSize: '2rem'}}
                        />
                        <div style={{ display: 'flex', gap: '.5rem'}}>
                            <span>
                                { period.min }°
                            </span>
                            <span>
                                -
                            </span>
                            <span>
                                { period.max }°
                            </span>
                        </div>
                    </div>
                    ))
                }
            </div>
        </section>
    )
}

export default WeekForecast