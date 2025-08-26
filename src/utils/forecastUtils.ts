import type { HourForecast } from "../models/forecast.model";

const getHour = (time: string) => {
    const date = new Date(time);
    return `${String(date.getHours())}:00`; 
}

const getDayForecast = (selectedDate: string, forecast: HourForecast[], setDayForecast: (forecast: HourForecast[]) => void) => {
    const now = new Date();
        now.setMinutes(0, 0, 0);

        const today = new Date().toLocaleDateString('en-CA'); // "YYYY-MM-DD"

        if (selectedDate === today) {
            // Show next 24 hours starting from current hour
            const startIndex = forecast.findIndex(period => {
                return new Date(period.startTime) >= now;
            });

            setDayForecast(startIndex !== -1
                ? forecast.slice(startIndex, startIndex + 24)
                : [])
        } else {
            // Show 24 hours for the selected date
            const forecastsForSelectedDate = forecast.filter(period => {
            const date = new Date(period.startTime).toLocaleDateString('en-CA');
            return date === selectedDate;
            });
    
            setDayForecast(forecastsForSelectedDate.slice(0, 24));
        }
}

export {
    getHour,
    getDayForecast
}