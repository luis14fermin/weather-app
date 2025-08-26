import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DayForecast from '../components/DayForecast';
import type { HourForecast } from '../models/forecast.model';

// Mock context
jest.mock('../context/GeoLocationContext', () => ({
    useGeoLocation: () => ({
        searchedDayForecast: [],
        searchedLocation: undefined,
    }),
}));

// Mock ForecastIcon
jest.mock('../components/ForecastIcon', () => ({ shortForecast }: { shortForecast: string }) => (
    <div>ForecastIconMock {shortForecast}</div>
));

// Mock getHour
jest.mock('../utils/forecastUtils', () => ({
    getHour: jest.fn((_time: string) => '12:00'),
}));

describe('DayForecast', () => {
    it('renders all periods passed via dayForecast', () => {
        const mockForecast: HourForecast[] = [
            {
                number: 1,
                name: 'Morning',
                startTime: '2025-08-26T06:00:00-04:00',
                endTime: '2025-08-26T12:00:00-04:00',
                isDaytime: true,
                temperature: 75,
                temperatureUnit: 'F',
                temperatureTrend: '',
                probabilityOfPrecipitation: { unitCode: 'percent', value: 10 },
                dewpoint: { unitCode: 'F', value: 60 },
                relativeHumidity: { unitCode: 'percent', value: 50 },
                windSpeed: '5 mph',
                windDirection: 'NW',
                icon: '',
                shortForecast: 'Sunny',
                detailedForecast: 'Sunny with clear skies',
            },
            {
                number: 2,
                name: 'Afternoon',
                startTime: '2025-08-26T12:00:00-04:00',
                endTime: '2025-08-26T18:00:00-04:00',
                isDaytime: true,
                temperature: 80,
                temperatureUnit: 'F',
                temperatureTrend: '',
                probabilityOfPrecipitation: { unitCode: 'percent', value: 20 },
                dewpoint: { unitCode: 'F', value: 65 },
                relativeHumidity: { unitCode: 'percent', value: 45 },
                windSpeed: '10 mph',
                windDirection: 'E',
                icon: '',
                shortForecast: 'Partly Cloudy',
                detailedForecast: 'Partly cloudy skies',
            },
        ];

        render(<DayForecast dayForecast={mockForecast} />);

        // There should be two ForecastIconMock components
        expect(screen.getByText(/ForecastIconMock Sunny/i)).toBeInTheDocument();
        expect(screen.getByText(/ForecastIconMock Partly Cloudy/i)).toBeInTheDocument();

        // There should be two temperature spans
        expect(screen.getByText('75')).toBeInTheDocument();
        expect(screen.getByText('80')).toBeInTheDocument();

        // getHour output should be rendered
        expect(screen.getAllByText('12:00').length).toBe(2);
    });

    it('uses searchedDayForecast if searchedLocation exists', () => {
        const mockForecast: HourForecast[] = [
            {
                number: 1,
                name: 'Morning',
                startTime: '2025-08-26T06:00:00-04:00',
                endTime: '2025-08-26T12:00:00-04:00',
                isDaytime: true,
                temperature: 70,
                temperatureUnit: 'F',
                temperatureTrend: '',
                probabilityOfPrecipitation: { unitCode: 'percent', value: 0 },
                dewpoint: { unitCode: 'F', value: 50 },
                relativeHumidity: { unitCode: 'percent', value: 40 },
                windSpeed: '5 mph',
                windDirection: 'N',
                icon: '',
                shortForecast: 'Cloudy',
                detailedForecast: 'Cloudy skies',
            },
        ];

        // Override context to simulate searchedLocation
        jest.spyOn(require('../context/GeoLocationContext'), 'useGeoLocation').mockReturnValue({
            searchedDayForecast: mockForecast,
            searchedLocation: { formatted: 'Los Angeles, USA' },
            });

            render(<DayForecast dayForecast={[]} />);

            expect(screen.getByText(/ForecastIconMock Cloudy/i)).toBeInTheDocument();
            expect(screen.getByText('70')).toBeInTheDocument();
    });
});
