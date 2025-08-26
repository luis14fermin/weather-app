import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationsModal from '../components/LocationsModal';
import type { LocationData } from '../models/forecast.model';

const mockSetSearchedLocation = jest.fn();
const mockCloseModal = jest.fn();

// Mock useGeoLocation
jest.mock('../context/GeoLocationContext', () => ({
    useGeoLocation: () => ({
        setSearchedLocation: mockSetSearchedLocation,
    }),
}));

describe('LocationsModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockLocations: LocationData[] = [
        { 
            components: {} as any, 
            formatted: 'New York, United States of America', 
            geometry: { lat: 40.7128, lng: -74.006 } 
        },
        { 
            components: {} as any, 
            formatted: 'Boston, United States of America', 
            geometry: { lat: 42.36, lng: -71.06 } 
        },
    ];

    it('does not render if isOpen is false', () => {
        render(<LocationsModal title="Test" isOpen={false} closeModal={mockCloseModal} locations={mockLocations} />);
        expect(screen.queryByText(/Test/i)).not.toBeInTheDocument();
    });

    it('renders title and locations when open', () => {
        render(<LocationsModal title="Search Results" isOpen={true} closeModal={mockCloseModal} locations={mockLocations} />);
        
        expect(screen.getByText(/Search Results/i)).toBeInTheDocument();
        expect(screen.getByText('New York')).toBeInTheDocument();
        expect(screen.getByText('Boston')).toBeInTheDocument();
    });

    it('renders "No Results" if locations array is empty', () => {
        render(<LocationsModal title="Search Results" isOpen={true} closeModal={mockCloseModal} locations={[]} />);
        
        expect(screen.getByText(/No Results/i)).toBeInTheDocument();
    });

    it('renders Loading when loading is true', () => {
        render(<LocationsModal title="Search Results" isOpen={true} closeModal={mockCloseModal} locations={[]} loading />);
        
        expect(document.querySelector('.spinner')).toBeInTheDocument();
    });

    it('calls setSearchedLocation and closeModal when a location is clicked', () => {
        render(<LocationsModal title="Search Results" isOpen={true} closeModal={mockCloseModal} locations={mockLocations} />);
        
        fireEvent.click(screen.getByText('New York'));
        expect(mockSetSearchedLocation).toHaveBeenCalledWith(mockLocations[0]);
        expect(mockCloseModal).toHaveBeenCalled();
    });

    it('calls closeModal when modal background is clicked', () => {
        render(<LocationsModal title="Search Results" isOpen={true} closeModal={mockCloseModal} locations={mockLocations} />);
        
        const modalWrapper = screen.getByText('Search Results').closest('.modalWrapper');
        if (modalWrapper) fireEvent.click(modalWrapper);
        
        expect(mockCloseModal).toHaveBeenCalled();
    });

    it('does not call closeModal when modal background is clicked while loading', () => {
        render(<LocationsModal title="Search Results" isOpen={true} closeModal={mockCloseModal} locations={mockLocations} loading />);
        
        const modalWrapper = document.querySelector('.modalWrapper');
        if (modalWrapper) fireEvent.click(modalWrapper);
        
        expect(mockCloseModal).not.toHaveBeenCalled();
    });
});
