import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Charts from '../components/Charts';
import type { HourForecast, LocationData } from '../models/forecast.model';

// Mock context
jest.mock('../context/GeoLocationContext', () => ({
    useGeoLocation: () => ({
        searchedDayForecast: [],
        searchedLocation: undefined,
    }),
}));

// Mock recharts components so we don't render actual charts
jest.mock('recharts', () => {
    return {
        LineChart: (props: any) => <div data-testid="LineChart">{props.children}</div>,
        BarChart: (props: any) => <div data-testid="BarChart">{props.children}</div>,
        Line: () => <div>LineMock</div>,
        Bar: () => <div>BarMock</div>,
        XAxis: () => <div>XAxisMock</div>,
        YAxis: () => <div>YAxisMock</div>,
        Tooltip: () => <div>TooltipMock</div>,
        Legend: () => <div>LegendMock</div>,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    };
});

describe('Charts', () => {
    const mockDayForecast: HourForecast[] = [
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
        shortForecast: 'Sunny',
        detailedForecast: 'Partly cloudy skies',
        },
    ];

    const mockLocation: LocationData = {
        components: {
        "ISO_3166-1_alpha-2": "US",
        "ISO_3166-1_alpha-3": "USA",
        "ISO_3166-2": [],
        _category: '',
        _type: '',
        continent: 'North America',
        country: 'United States of America',
        country_code: 'US',
        county: '',
        state: 'NY',
        state_code: 'NY',
        },
        formatted: 'New York, USA',
        geometry: { lat: 40.7128, lng: -74.006 },
    };

    it('renders chart and menu options', () => {
        render(<Charts dayForecast={mockDayForecast} currentLocation={mockLocation} />);

        // Weather menu
        expect(screen.getByText('Temperature')).toBeInTheDocument();
        expect(screen.getByText('Precipitation')).toBeInTheDocument();
        expect(screen.getByText('Humidity')).toBeInTheDocument();

        // Chart type menu
        expect(screen.getByText('Line')).toBeInTheDocument();
        expect(screen.getByText('Bar')).toBeInTheDocument();

        // Chart rendered
        expect(screen.getByTestId('LineChart')).toBeInTheDocument();
    });

    it('changes selected weather when menu option is clicked', () => {
        render(<Charts dayForecast={mockDayForecast} currentLocation={mockLocation} />);

        const precButton = screen.getByText('Precipitation');
        fireEvent.click(precButton);
        expect(precButton).toHaveClass('selectedChartOption');
    });

    it('changes chart type when chart menu option is clicked', () => {
        render(<Charts dayForecast={mockDayForecast} currentLocation={mockLocation} />);

        const barButton = screen.getByText('Bar');
        fireEvent.click(barButton);
        expect(barButton).toHaveClass('selectedChartOption');
        expect(screen.getByTestId('BarChart')).toBeInTheDocument();
    });
});
