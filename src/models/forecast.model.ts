interface HourForecast {
    number: number,
    name: string,
    startTime: string,
    endTime: string,
    isDaytime: boolean,
    temperature: number,
    temperatureUnit: string,
    temperatureTrend: string,
    probabilityOfPrecipitation: {
        unitCode: string,
        value: number
    },
    dewpoint: {
        unitCode: string,
        value: number
    },
    relativeHumidity: {
        unitCode: string,
        value: number
    },
    windSpeed: string,
    windDirection: string,
    icon: string,
    shortForecast: string,
    detailedForecast: string
}

interface LocationData {
    components: {
        "ISO_3166-1_alpha-2": string;
        "ISO_3166-1_alpha-3": string;
        "ISO_3166-2": string[];
        _category: string;
        _type: string;
        continent: string;
        country: string;
        country_code: string;
        county: string;
        state: string;
        state_code: string;
    };
    formatted: string;
    geometry: {
        lat: number;
        lng: number;
    };
}

export type {
    HourForecast,
    LocationData
}