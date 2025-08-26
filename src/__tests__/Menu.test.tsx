import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Menu from '../components/Menu';

// Mock context
const mockSetSearchedLocation = jest.fn();

jest.mock('../context/GeoLocationContext', () => ({
    useGeoLocation: () => ({
        searchedLocation: undefined,
        setSearchedLocation: mockSetSearchedLocation,
    }),
}));

// Mock child components
jest.mock('../components/Search', () => () => <div>SearchMock</div>);
jest.mock('../components/Favorite', () => () => <div>FavoriteMock</div>);

describe('Menu', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders Search when there is no searchedLocation', () => {
        render(<Menu />);
        expect(screen.getByText('SearchMock')).toBeInTheDocument();
        expect(screen.getByText('FavoriteMock')).toBeInTheDocument();
        expect(screen.queryByText(/Back To My Location/i)).not.toBeInTheDocument();
    });

    it('renders Back To My Location button when searchedLocation exists', () => {
        // Override the mock to simulate a searched location
        jest.spyOn(require('../context/GeoLocationContext'), 'useGeoLocation').mockReturnValue({
            searchedLocation: { formatted: 'New York' },
            setSearchedLocation: mockSetSearchedLocation,
        });

        render(<Menu />);
        expect(screen.getByText(/Back To My Location/i)).toBeInTheDocument();
        expect(screen.getByText('FavoriteMock')).toBeInTheDocument();
        expect(screen.queryByText('SearchMock')).not.toBeInTheDocument();
    });

    it('calls setSearchedLocation(undefined) when Back To My Location button is clicked', () => {
        jest.spyOn(require('../context/GeoLocationContext'), 'useGeoLocation').mockReturnValue({
            searchedLocation: { formatted: 'New York, USA' },
            setSearchedLocation: mockSetSearchedLocation,
        });

        render(<Menu />);
        fireEvent.click(screen.getByText(/Back To My Location/i));
        expect(mockSetSearchedLocation).toHaveBeenCalledWith(undefined);
    });
});
