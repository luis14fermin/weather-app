import { useState, type ComponentType } from 'react';
import type { HourForecast, LocationData } from "../models/forecast.model";
import { useGeoLocation } from '../context/GeoLocationContext';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getHour } from '../utils/forecastUtils';

type WeatherType = 'temp' | 'prec' | 'hum';
type ChartType = 'line' | 'bar'

type WeatherMenuOption = {
    name: string
    weatherType: WeatherType
}

type ChartTypeOption = {
    name: string
    chartType: ChartType
    chartComponent: ComponentType
    chartElementComponent: ComponentType
}

type WeatherData = {
    time: string,
    value1: {
        temperature: number,
        precipitation: number,
        humidity: number
    },
    value2?: {
        temperature: number,
        precipitation: number,
        humidity: number
    },
}

const Charts = ({ dayForecast, currentLocation } : {
    dayForecast: HourForecast[]
    currentLocation: LocationData
}) => {
    const weatherMenuOptions: WeatherMenuOption[] = [
        { name: 'Temperature', weatherType: 'temp' },
        { name: 'Precipitation', weatherType: 'prec'},
        { name: 'Humidity', weatherType: 'hum' }
    ];

    const chartMenuOptions: ChartTypeOption[] = [
        { name: 'Line', chartType: 'line', chartComponent: LineChart, chartElementComponent: Line },
        { name: 'Bar', chartType: 'bar', chartComponent: BarChart, chartElementComponent: Bar }
    ]

    const chartDataKey = (value: 'value1' | 'value2') => ({
        temp: `${value}.temperature`,
        prec: `${value}.precipitation`,
        hum: `${value}.humidity`
    })

    const [ selectedWeather, setSelectedWeather ] = useState<WeatherType>('temp');
    const [ selectedChart, setSelectedChart ] = useState<ChartType>('line');
    const [ showComparison, setShowComparison ] = useState(false);

    const { searchedDayForecast, searchedLocation } = useGeoLocation()
    const defaultDayForecast = searchedLocation ? searchedDayForecast : dayForecast;

    const ChartComponent = chartMenuOptions.find(option => option.chartType === selectedChart)?.chartComponent || LineChart
    const ChartElementComponent = chartMenuOptions.find(option => option.chartType === selectedChart)?.chartElementComponent || Line

    const weatherData: WeatherData[] = defaultDayForecast
        .map((forecast,index) => ({
            time: getHour(forecast.startTime),
            value1: {
                temperature: forecast.temperature,
                precipitation: forecast.probabilityOfPrecipitation.value,
                humidity: forecast.relativeHumidity.value
            },
            ...(searchedLocation && { value2: {
                temperature: dayForecast[index].temperature,
                precipitation: dayForecast[index].probabilityOfPrecipitation.value,
                humidity: dayForecast[index].relativeHumidity.value
            }})
        }))
        .filter((_period, index) => index % 3 === 0)

    return (
        <section className='forecastWrapper forecastChartWrapper'>
            <div className='chartSelectionMenuWrapper'>
                <div className='chartSelectionMenu'>
                    {weatherMenuOptions.map((option) => (
                        <span
                            key={option.weatherType}
                            className={`${selectedWeather === option.weatherType && 'selectedChartOption'}`}
                            onClick={() => setSelectedWeather(option.weatherType)}
                        >
                            { option.name }
                        </span>
                    ))}
                </div>
                <div className='chartSelectionMenu'>
                    {chartMenuOptions.map((option) => (
                        <span
                            key={option.chartType}
                            className={`${selectedChart === option.chartType && 'selectedChartOption'}`}
                            onClick={() => setSelectedChart(option.chartType)}
                        >
                            { option.name }
                        </span>
                    ))}
                </div>
            </div>
            <ResponsiveContainer width={"100%"} height={300}>
                <ChartComponent
                    width={500}
                    height={300}
                    data={weatherData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <XAxis
                        dataKey='time'
                        label={{value: 'Time', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                        tickFormatter={(value) => `${value}${selectedWeather === 'temp' ? '°' : '%'}`}
                    />
                    <Tooltip />
                    <Legend verticalAlign='top'/>
                    <ChartElementComponent
                        type="monotone"
                        dataKey={chartDataKey('value1')[selectedWeather]}
                        stroke='#4b5b9c'
                        fill='#4b5b9c'
                        activeDot={{ r: 8 }}
                        name={(searchedLocation ? searchedLocation : currentLocation).formatted.replace(', United States of America', '')}
                    />
                    {searchedLocation && showComparison
                        && <ChartElementComponent
                        type="monotone"
                        dataKey={chartDataKey('value2')[selectedWeather]}
                        stroke='#2ca6a4'
                        fill='#2ca6a4'
                        activeDot={{ r: 8 }}
                        name={currentLocation.formatted.replace(', United States of America', '')}
                    />
                    }
                </ChartComponent>
            </ResponsiveContainer>
            {searchedLocation 
                && <button
                    onClick={() => setShowComparison((prev) => !prev)}
                    style={{
                        padding: '.75rem',
                        backgroundColor: showComparison ? '#4b5b9c' : '#2ca6a4' 
                    }}
                >
                    { showComparison ? 'Hide Comparison' : 'Compare With Current Weather' }
                </button>
            }
        </section>
    )
}

export default Charts