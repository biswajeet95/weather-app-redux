import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, Container, Box } from '@mui/material';
import './weather.scss';
import { get5DaysForecast } from '../store/weatherSlice';
import { getCityData } from '../store/weatherSlice';

const WeatherApp = () => {
    const { citySearchLoading, citySearchData, forecastLoading, forecastData, forecastError } = useSelector((state) => state.weather);
    const [loadings, setLoadings] = useState(true);
    const [city, setCity] = useState('');
    const [unit, setUnit] = useState('metric');
    const dispatch = useDispatch();

    const toggleUnit = () => {
        setLoadings(true);
        setUnit(unit === 'metric' ? 'imperial' : 'metric');
    };

    const fetchData = () => {
        dispatch(getCityData({ city, unit })).then((res) => {
            if (res.payload && !res.payload.error) {
                const { lat, lon } = res.payload.data.coord;
                dispatch(get5DaysForecast({ lat, lon, unit }));
            }
        });
    };

    useEffect(() => {
        fetchData();
    }, [unit]);

    useEffect(() => {
        const isAnyChildLoading = [citySearchLoading, forecastLoading].some((state) => state);
        setLoadings(isAnyChildLoading);
    }, [citySearchLoading, forecastLoading]);

    const handleCitySearch = (e) => {
        e.preventDefault();
        setLoadings(true);
        fetchData();
    };

    const filterForecastByFirstObjTime = (forecastData) => {
        const firstObjTime = forecastData?.[0]?.dt_txt?.split(' ')[1];
        return forecastData?.filter((data) => data.dt_txt.endsWith(firstObjTime)) || [];
    };
    const filteredForecast = filterForecastByFirstObjTime(forecastData?.list);

    return (
        <Container maxWidth="xl" className="weather-app">
            <Box className="box">


                {/* city search form */}
                <form autoComplete="off" onSubmit={handleCitySearch}>
                    <label>
                        <SearchIcon />
                    </label>
                    <input
                        type="text"
                        className="city-input"
                        placeholder="Enter City"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        readOnly={loadings}
                    />
                    <button type="submit">GO</button>
                </form>

                {/* current weather details box */}
                <div className="current-weather-details-box">
                    {/* header */}
                    <div className="details-box-header">
                        {/* heading */}
                        <h4>Current Weather</h4>

                        {/* switch */}
                        <div className="switch" onClick={toggleUnit}>
                            <div
                                className={`switch-toggle ${unit === "metric" ? "c" : "f"}`}
                            ></div>
                            <span className="c">C</span>
                            <span className="f">F</span>
                        </div>
                    </div>
                    {loadings ? (
                        <div className="loader">
                            <CircularProgress />
                        </div>
                    ) : (
                        <>
                            {citySearchData && citySearchData.error ? (
                                <div className="error-msg">{citySearchData.error}</div>
                            ) : (
                                <>
                                    {forecastError ? (
                                        <div className="error-msg">{forecastError}</div>
                                    ) : (
                                        <>
                                            {citySearchData && citySearchData.data ? (
                                                <div className="weather-details-container">
                                                    {/* details */}
                                                    <div className="details">
                                                        <h4 className="city-name">
                                                            {citySearchData.data.name}
                                                        </h4>

                                                        <div className="icon-and-temp">
                                                            <img
                                                                src={`https://openweathermap.org/img/wn/${citySearchData.data.weather[0].icon}@2x.png`}
                                                                alt="icon"
                                                            />
                                                            <h1>{citySearchData.data.main.temp}&deg;</h1>
                                                        </div>

                                                        <h4 className="description">
                                                            {citySearchData.data.weather[0].description}
                                                        </h4>
                                                    </div>

                                                    {/* metrices */}
                                                    <div className="metrices">
                                                        {/* feels like */}
                                                        <h4>
                                                            Feels like {citySearchData.data.main.feels_like}
                                                            &deg;C
                                                        </h4>

                                                        {/* min max temp */}
                                                        <div className="key-value-box">
                                                            <div className="key">

                                                                <span className="value">
                                                                    {citySearchData.data.main.temp_max}
                                                                    &deg;C
                                                                </span>
                                                            </div>
                                                            <div className="key">

                                                                <span className="value">
                                                                    {citySearchData.data.main.temp_min}
                                                                    &deg;C
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* humidity */}
                                                        <div className="key-value-box">
                                                            <div className="key">

                                                                <span>Humidity</span>
                                                            </div>
                                                            <div className="value">
                                                                <span>
                                                                    {citySearchData.data.main.humidity}%
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* wind */}
                                                        <div className="key-value-box">
                                                            <div className="key">

                                                                <span>Wind</span>
                                                            </div>
                                                            <div className="value">
                                                                <span>{citySearchData.data.wind.speed}kph</span>
                                                            </div>
                                                        </div>

                                                        {/* pressure */}
                                                        <div className="key-value-box">
                                                            <div className="key">

                                                                <span>Pressure</span>
                                                            </div>
                                                            <div className="value">
                                                                <span>
                                                                    {citySearchData.data.main.pressure}
                                                                    hPa
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="error-msg">No Data Found</div>
                                            )}
                                            {/* extended forecastData */}
                                            <h4 className="extended-forecast-heading">
                                                Extended Forecast
                                            </h4>
                                            {filteredForecast.length > 0 ? (
                                                <div className="extended-forecasts-container">
                                                    {filteredForecast.map((data, index) => {
                                                        const date = new Date(data.dt_txt);
                                                        const day = date.toLocaleDateString("en-US", {
                                                            weekday: "short",
                                                        });
                                                        return (
                                                            <div className="forecast-box" key={index}>
                                                                <h5>{day}</h5>
                                                                <img
                                                                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                                                                    alt="icon"
                                                                />
                                                                <h5>{data.weather[0].description}</h5>
                                                                <h5 className="min-max-temp">
                                                                    {data.main.temp_max}&deg; /{" "}
                                                                    {data.main.temp_min}&deg;
                                                                </h5>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="error-msg">No Data Found</div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>



            </Box>
        </Container>
    );
};

export default WeatherApp;

