# Weather Tracker

[Live Demo](https://app-weather-tracker.netlify.app)  

---

## Overview
A simple weather app built with React + TypeScript.  
Users can view current weather information or search for a location's weather using the OpenCage Geocoding API and the weather.gov API.

---

## Setup & Running Instructions

1. Clone the repository:
```bash
git clone https://github.com/luis14fermin/weather-app.git
cd weather-app
```

2. Install dependencies:
```bash
npm install
# or
npm i
```

3. Create a .env file in the root directory and add an API key:
- You can get a free API key from [OpenCage](https://opencagedata.com/api)
```env
VITE_OPEN_CAGE_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

## **Implementation Overview**
- Main Content is initialized in AppContent.tsx
  - Uses Built in React geolocation tools to get user coordinates
  - Uses fetch with promises to call APIs for geocoding and weather data in the user's current location.
  - Divided the page into 4 main child components
    - Menu: Renders searching and favorites functionality
    - DayForecast: Renders the 24 hour forecast for the selected date. Defaults to today's date when initialized.
    - WeekForecast: Renders forecast for the 7 days in the upcoming week
    - Charts: Maps the forecast data (Temperature, Precipitation, Humidity) to a line or bar graph.
      - If users are viewing a searched location they have the option to compare the data with their current location
- App.tsx is the root component wrapped by a context provider mainly for searched forecast data, favorites and date selection
  - Using the shared context, if a searched location is selected then it takes priority rendering over the current location's forecast until the user returns
  - Favorite locations are stored in an array for easy access when searching forecasts
  - Date selection is shared across logic for both current and searched location
- Included models for incoming objects from APIs for type checking expected values
- Utils file for reusable functions/logic
- Error fallbacks and Loading logic included where necessary
- Tests are included for main child components using Jest and RTL
- Deployed in Netlify 

## **Assumptions & Design Decisions**
- To hit all requirements, I created 2 main states: 
  - The state for the current location: Lives in AppContent.tsx
  - The state for the searched location: Lives in Context
  - This setup allowed me to manage two separate datasets using the same interfaces, enabling reusing component and easy comparison between location forecasts
- Added the OpenCageData API into the functionality:
  - The Weather.gov API provides good forecast data but only works with coordinates, which limited the search feature if a user wanted to look up a forecast by name. To address this, I looked for an API that could provide coordinates for multiple locations by name
  - OpenCageData API supports forward and reverse geocoding for accurate location names
  - It can return a list of locations with the same name, making it easy to integrate with the Weather.gov API for searching forecasts by different locations
- Made a reusable modal for Search results and favorites
  - Allowed me to reuse the component for displaying a list of similar selectable items without reinventing the wheel
- Used Rechart library for charts and graphs
  - Chose it since it's very customizable and has good documentation
  - Leveraged ComponentType for easy abstraction when showing which graph to render
  - Allowed comparisons between a searched location and the current location, the only case with more than one dataset
- Forecast renders a 24hour view and 7 day view
  - If viewing today's forecast it shows the 24 hours starting from current time
  - If viewing a different date it shows the 24 hours starting from midnight
  - Mapped Icons to Forecast strings as an easy way to access visuals when mapping data
  - The week forecast captures the high and low temperatures and the most frequent weather condition to determine the icon
- Went with a mobile first design so responsiveness is baked into my structure
  - Resulted in only one media query needed to tweak the responsiveness
- Used vanilla CSS for styling (personal preference for fun)
  - Chose a blue gradient background to fit the weather theme as it looks like a sky
  - Selected contrasting complementary secondary colors
- Error and Loading logic are mostly centralized since it's a SPA with no routes
  - Accounted for potential errors in child components with user friendly fallbacks

## **Features Implemented**
- Display hourly forecast
- Display 7 day forecast
- Search other US locations and view forecast data
- Favorites Feature
  - NOTE: Search a location and press the star icon at the top to add or remove it from favorites
- Weather comparison with current location vs another location
  - NOTE: Only available when viewing a searched location, a button will render in the bottom of the graph giving the option to add current location data to compare
- 2 different types of data visualization graphs

## **Future Improvements**
- Option to switch between Fahrenheit and Celsius
- Option to switch between 12 hour and 24 hour clocks
- Current time adjusting to other timezones when viewing other locations
- Buttons on the sides of the day and week forecast views for better UX with the mouse
- Better responsiveness for the charts in mobile view
- Better implementation for accessability: More names, labels and aria-labels
- Additional abstraction for missed reusable logic and similar component containers
- Adding a Service Layer to handle API calls separately from components
- Caching favorites so they persist on refresh
- Router logic so users can go to a location's forecast with a unique URL path instead of having to search it every time
- Breaking the context provider different providers
- Breaking up the CSS into different files for better maintainability
- Combining similar CSS classes into one
- More customized error states and messages
- End-to-End test coverage
