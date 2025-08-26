import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeekForecast from '../components/WeekForecast';
import type { HourForecast } from '../models/forecast.model';

// Mock context
const mockSetSelectedDate = jest.fn();

jest.mock('../context/GeoLocationContext', () => ({
    useGeoLocation: () => ({
        selectedDate: '',
        setSelectedDate: mockSetSelectedDate,
        searchedForecast: [],
        searchedLocation: undefined,
    }),
}));

// Mock ForecastIcon
jest.mock('../components/ForecastIcon', () => ({ shortForecast }: { shortForecast: string }) => (
    <div>ForecastIconMock {shortForecast}</div>
));

describe('WeekForecast', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correct daily summaries from forecast', () => {
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
                startTime: '2025-08-27T12:00:00-04:00',
                endTime: '2025-08-27T18:00:00-04:00',
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
                shortForecast: 'Sunny',
                detailedForecast: 'Partly cloudy skies',
            },
            {
                number: 3,
                name: 'Morning',
                startTime: '2025-08-28T06:00:00-04:00',
                endTime: '2025-08-28T12:00:00-04:00',
                isDaytime: true,
                temperature: 70,
                temperatureUnit: 'F',
                temperatureTrend: '',
                probabilityOfPrecipitation: { unitCode: 'percent', value: 5 },
                dewpoint: { unitCode: 'F', value: 55 },
                relativeHumidity: { unitCode: 'percent', value: 40 },
                windSpeed: '5 mph',
                windDirection: 'N',
                icon: '',
                shortForecast: 'Cloudy',
                detailedForecast: 'Cloudy skies',
            },
        ];

    render(<WeekForecast forecast={mockForecast} />);

    // Today should appear for the first day
    expect(screen.getByText(/Today/i)).toBeInTheDocument();
    // Second day label
    expect(screen.getByText(/Tuesday|Wednesday/i)).toBeInTheDocument();

    // ForecastIcon rendered
    const sunnyIcons = screen.getAllByText(/ForecastIconMock Sunny/i);
    expect(sunnyIcons).toHaveLength(2);
    expect(screen.getByText(/ForecastIconMock Cloudy/i)).toBeInTheDocument();

    // Temperatures rendered
    // Temperatures rendered
    const temp75 = screen.getAllByText(/75°/i);
    expect(temp75).toHaveLength(2);

    const temp80 = screen.getAllByText(/80°/i);
    expect(temp80).toHaveLength(2);

    const temp70 = screen.getAllByText(/70°/i);
    expect(temp70).toHaveLength(2);
});

    it('calls setSelectedDate when a day is clicked', () => {
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
        ];

        render(<WeekForecast forecast={mockForecast} />);
        fireEvent.click(screen.getByText(/Today/i));
        expect(mockSetSelectedDate).toHaveBeenCalledWith('2025-08-26');
    });
});
