import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from '../components/Search';

// Mock LocationsModal so we don't render the real modal
jest.mock('../components/LocationsModal', () => ({ title, isOpen, locations, loading }: any) => (
    <div data-testid="LocationsModal">
        <span>{title}</span>
        <span>{isOpen ? 'Open' : 'Closed'}</span>
        <span>{locations.length} locations</span>
        <span>{loading ? 'Loading' : 'Not Loading'}</span>
    </div>
));

describe('Search component', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders input and search button', () => {
        render(<Search />);
        const input = screen.getByPlaceholderText(/search location/i);
        expect(input).toBeInTheDocument();
        
        // Button only shows when there is input
        expect(screen.queryByRole('button')).not.toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'New York' } });
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('opens modal and fetches locations on search', async () => {
        const mockResults = [
        { components: {}, formatted: 'New York, USA', geometry: { lat: 40.7, lng: -74 } }
        ];

        // @ts-ignore
        global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ results: mockResults }),
        })
        );

        render(<Search />);
        const input = screen.getByPlaceholderText(/search location/i);
        fireEvent.change(input, { target: { value: 'New York' } });
        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(screen.getByText(/Search Results/i)).toBeInTheDocument();
            expect(screen.getByText(/Open/i)).toBeInTheDocument();
            expect(screen.getByText(/1 locations/i)).toBeInTheDocument();
            expect(screen.getByText(/Not Loading/i)).toBeInTheDocument();
            });

            expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('New York')
        );
    });

    it('handles fetch error gracefully', async () => {
        // @ts-ignore
        global.fetch = jest.fn(() => Promise.reject('API error'));

        render(<Search />);
        const input = screen.getByPlaceholderText(/search location/i);
        fireEvent.change(input, { target: { value: 'Nowhere' } });
        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
                expect(screen.getByText(/0 locations/i)).toBeInTheDocument();
                expect(screen.getByText(/Not Loading/i)).toBeInTheDocument();
            });
    });
});
