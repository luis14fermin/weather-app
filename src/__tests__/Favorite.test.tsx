import { render, screen, fireEvent } from '@testing-library/react';
import Favorite from '../components/Favorite';
import { useGeoLocation } from '../context/GeoLocationContext';

// Mock the context
jest.mock('../context/GeoLocationContext', () => ({
    useGeoLocation: jest.fn(),
}));

// Mock LocationsModal so we don't test its internals
jest.mock('../components/LocationsModal', () => (props: any) => (
    <div>
        LocationsModalMock
        {props.locations.map((loc: any) => <span key={loc.formatted}>{loc.formatted}</span>)}
    </div>
));

describe('Favorite component', () => {
    let mockSetFavoriteLocations: jest.Mock;

    beforeEach(() => {
        mockSetFavoriteLocations = jest.fn();
    });

    it('renders favorite button as empty star when location is not favorited', () => {
        (useGeoLocation as jest.Mock).mockReturnValue({
            searchedLocation: { formatted: 'New York, USA' },
            favoriteLocations: [],
            setFavoriteLocations: mockSetFavoriteLocations,
        });

        render(<Favorite />);
        expect(screen.getByRole('button', { name: /add to favorites/i })).toBeInTheDocument();
    });

    it('adds location to favorites when button is clicked', () => {
        (useGeoLocation as jest.Mock).mockReturnValue({
            searchedLocation: { formatted: 'New York, USA' },
            favoriteLocations: [],
            setFavoriteLocations: mockSetFavoriteLocations,
        });

        render(<Favorite />);
        const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
        fireEvent.click(favoriteButton);

        expect(mockSetFavoriteLocations).toHaveBeenCalledWith([{ formatted: 'New York, USA' }]);
    });

    it('removes location from favorites when button is clicked again', () => {
        (useGeoLocation as jest.Mock).mockReturnValue({
        searchedLocation: { formatted: 'New York, USA' },
        favoriteLocations: [{ formatted: 'New York, USA' }],
        setFavoriteLocations: mockSetFavoriteLocations,
        });

        render(<Favorite />);
        const favoriteButton = screen.getByRole('button', { name: /remove from favorites/i });
        fireEvent.click(favoriteButton);

        expect(mockSetFavoriteLocations).toHaveBeenCalledWith([]);
    });

    it('opens LocationsModal when "View Favorites" button is clicked', () => {
        (useGeoLocation as jest.Mock).mockReturnValue({
            searchedLocation: { formatted: 'New York, USA' },
            favoriteLocations: [{ formatted: 'New York, USA' }],
            setFavoriteLocations: mockSetFavoriteLocations,
        });

        render(<Favorite />);
        const viewButton = screen.getByText(/View Favorites/i);
        fireEvent.click(viewButton);

        // The mock modal renders LocationsModalMock text
        expect(screen.getByText(/LocationsModalMock/i)).toBeInTheDocument();
        expect(screen.getByText(/New York, USA/i)).toBeInTheDocument();
    });
});
