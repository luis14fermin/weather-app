import type { CSSProperties } from 'react';
import type { IconType } from 'react-icons';
import {
    WiDaySunny,
    WiDayCloudy,
    WiCloudy,
    WiRain,
    WiShowers,
    WiThunderstorm,
    WiSnow,
    WiSleet,
    WiFog,
    WiDaySunnyOvercast,
    WiDayHaze,
    WiRaindrop,
    WiSnowflakeCold,
    WiHot,
    WiStrongWind,
} from 'react-icons/wi';

const forecastIconMap: Record<string, IconType> = {
    "Severe storm": WiThunderstorm,
    "Showers storms": WiShowers,
    "Thunder storm": WiThunderstorm,
    "Rain Sleet": WiSleet,
    "FrzgRn Snow": WiSnowflakeCold,
    "Chance Snow/Rain": WiSleet,
    "Rain and Snow": WiSleet,
    "Rain or Snow": WiSleet,
    "Freezing Rain": WiSnowflakeCold,
    "Rain likely": WiRain,
    "Snow showers": WiSnow,
    "Showers likely": WiShowers,
    "Chance showers": WiShowers,
    "Isolated showers": WiShowers,
    "Scattered showers": WiShowers,
    "Chance rain": WiRaindrop,
    "Rain": WiRain,
    "Mix": WiSleet,
    "Sleet": WiSleet,
    "Snow": WiSnow,
    "Fog a.m.": WiFog,
    "Fog late": WiFog,
    "Fog": WiFog,
    "Very Cold": WiStrongWind,
    "Very Hot": WiHot,
    "Hot": WiHot,
    "Overcast": WiCloudy,
    "Mostly Cloudy": WiDayCloudy,
    "Partly Cloudy": WiDayCloudy,
    "Cloudy": WiCloudy,
    "Partly Sunny": WiDaySunnyOvercast,
    "Mostly Sunny": WiDaySunnyOvercast,
    "Mostly Clear": WiDaySunnyOvercast,
    "Sunny": WiDaySunny,
    "Clear": WiDaySunny,
    "Fair": WiDaySunny,
    "Variable Clouds": WiCloudy,
    "Windy": WiStrongWind,
    "Hazy": WiDayHaze
};

const ForecastIcon = ({ shortForecast, className, style }: {
    shortForecast: string,
    className?: string,
    style?: CSSProperties
}) => {
    const IconComponent = forecastIconMap[shortForecast] || WiDaySunny;
    return <IconComponent className={className} style={style} />;
}

export default ForecastIcon