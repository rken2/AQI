import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSpring, useSpringRef, useChain, useTransition, animated, config } from 'react-spring';
import Autocomplete from "react-google-autocomplete";

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

import { token } from "../../token";
import "./styles.css";

import {
    InfoMain,
    SearchContainer,
    SearchForm,
    SearchSubmit,
    GraphContainer,
    AQIPrompt,
    AQIPromptValue,
    CurrentAQIContainer,
    CurrentAQIDivTitle,
    GeoContainer,
    GeoCity,
    GeoCord,
    InfoTitle,
    GraphErrorTitle,
    Selection,
    SelectionDropDown,
    SelectionDropDownItem
} from "./Style";

import {
    setCity,
    setCountry,
    setLat,
    setLong,
} from "../../Slices/AppSlice";

const InfoPage = () => {
    let dispatch = useDispatch();
    let appState = useSelector(state => state.app);
    let [inputValue, setInputValue] = useState(null);
    let [animationComplete, setAnimationComplete] = useState(true);
    let [animationComplete2, setAnimationComplete2] = useState(true);
    let [animationComplete3, setAnimationComplete3] = useState(true);
    let [animationComplete4, setAnimationComplete4] = useState(true);
    let [animationComplete5, setAnimationComplete5] = useState(true);
    let [graphDataExist, setGraphDataExist] = useState(null);
    let [PM25Data, setPM25Data] = useState([]);
    let [PM10Data, setPM10Data] = useState([]);
    let [O3Data, setO3Data] = useState([]);
    let [dataSeries, setDataSeries] = useState([]);
    let [dataChoice, setDataChoice] = useState("avg");
    let [error, setError] = useState(false);
    let [currentAQI, setCurrentAQI] = useState(null);
    let [currentCO, setCurrentCO] = useState(null);
    let [currentO3, setCurrentO3] = useState(null);
    let [currentPM10, setCurrentPM10] = useState(null);
    let [currentPM25, setCurrentPM25] = useState(null);
    let [open, set] = useState(false);
    let [open2, set2] = useState(false);
    let [open3, set3] = useState(false);
    let [open4, set4] = useState(false);
    let [open5, set5] = useState(false);

    useEffect(() => {
        let series = [];

        if (O3Data.length !== 0) {
            let O3DataObj = { name: 'o3', color: "red", data: O3Data };

            series.push(O3DataObj);
        }

        if (PM10Data.length !== 0) {
            let PM10DataObj = { name: 'PM10', color: "blue", data: PM10Data };

            series.push(PM10DataObj);
        }

        if (PM25Data.length !== 0) {
            let PM25DataObj = { name: 'PM25', color: "green", data: PM25Data };

            series.push(PM25DataObj);
        }

        if (series.length !== 0) {
            setDataSeries(series);
        }
    }, [O3Data, PM10Data, PM25Data]);

    useEffect(() => {
        let fetchAQIData = async () => {
            // get AQI City information
            let stationID = "";

            let Station_URL = "https://api.waqi.info/search/?token=" + token + "&keyword=" + appState.city;

            await fetch(Station_URL)
                .then((resp) => resp.json())
                .then(async (data) => {
                    console.log(data);
                    let dataArr = data.data;

                    for (var i = 0; i < dataArr.length; i++) {
                        if (dataArr[i].station.country == appState.country) {
                            stationID = dataArr[i].uid;

                            break;
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });

            let AQI_URL = "https://api.waqi.info/feed/@" + stationID + "/?token=" + token;

            await fetch(AQI_URL)
                .then((resp) => resp.json())
                .then(async (data) => {
                    console.log(data);
                    let dataArr = data.data;

                    if (data.status === "error") {
                        alert("Error with city: " + dataArr + ". Please Select another city.");
                        setGraphDataExist(false);

                        return;
                    }

                    // Grab Current AQI information
                    if (dataArr.aqi) {
                        let temp = [];
                        temp.push({ name: "AQI", value: dataArr.aqi, css: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' });

                        setCurrentAQI(temp);
                    } else {
                        setCurrentAQI(null);
                    }

                    if (dataArr.iaqi.co) {
                        let temp = [];
                        temp.push({ name: "CO", value: dataArr.iaqi.co.v, css: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' });

                        setCurrentCO(temp);
                    } else {
                        setCurrentCO(null);
                    }

                    if (dataArr.iaqi.o3) {
                        let temp = [];
                        temp.push({ name: "O3", value: dataArr.iaqi.o3.v, css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' });

                        setCurrentO3(temp);
                    } else {
                        setCurrentO3(null);
                    }

                    if (dataArr.iaqi.pm10) {
                        let temp = [];
                        temp.push({ name: "PM10", value: dataArr.iaqi.pm10.v, css: 'linear-gradient(135deg, #E3FDF5 0%, #FFE6FA 100%)' });

                        setCurrentPM10(temp);
                    } else {
                        setCurrentPM10(null);
                    }

                    if (dataArr.iaqi.pm25) {
                        let temp = [];
                        temp.push({ name: "PM25", value: dataArr.iaqi.pm25.v, css: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)' });

                        setCurrentPM25(temp);
                    } else {
                        setCurrentPM25(null);
                    }

                    if (dataArr.forecast == undefined) {
                        await setGraphDataExist(false);
                    } else {
                        await setGraphDataExist(true);

                        if (dataArr.forecast.daily.o3 != undefined) {
                            await setO3Data(dataArr.forecast.daily.o3);
                        }

                        if (dataArr.forecast.daily.pm10 != undefined) {
                            await setPM10Data(dataArr.forecast.daily.pm10);
                        }

                        if (dataArr.forecast.daily.pm25 != undefined) {
                            await setPM25Data(dataArr.forecast.daily.pm25);
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        if (appState.city != "") {
            fetchAQIData();
        }
    }, [appState.city]);

    let handleSubmit = async (e) => {
        e.preventDefault();

        console.log(inputValue);

        // reset values
        await setCurrentAQI(null);
        await setCurrentCO(null);
        await setCurrentO3(null);
        await setCurrentPM10(null);
        await setCurrentPM25(null);
        await setGraphDataExist(null);

        if (inputValue == null || inputValue == undefined) {
            setError(true);

            return;
        } else {
            setError(false);
        }

        if (inputValue.address_components == null || inputValue.address_components == undefined) {
            setError(true);

            return;
        } else {
            setError(false);
        }

        if (inputValue != null || inputValue != undefined) {
            let city = inputValue.address_components[0].long_name;

            for (var i = 0; i < inputValue.address_components.length; i++) {
                if (inputValue.address_components[i].types.includes("country")) {
                    let country = inputValue.address_components[i].short_name;

                    await dispatch(setCountry(country));

                    break;
                }
            }

            await dispatch(setLat(inputValue.geometry.location.lat()));
            await dispatch(setLong(inputValue.geometry.location.lng()));
            await dispatch(setCity(city));
        }
    }

    let handleSelection = (event) => {
        console.log(event.target.value);
        if (event.target.value == "avg") {
            setDataChoice("avg");
        } else if (event.target.value == "max") {
            setDataChoice("max");
        } else {
            setDataChoice("min");
        }
    }

    const springApi = useSpringRef()
    const { size, ...rest } = useSpring({
        ref: springApi,
        config: config.stiff,
        from: { size: '15%', background: 'rgb(0,0,0, 0.2)', transform: 'translateY(100%)' },
        to: {
            size: open ? '30%' : '15%',
            background: open ? 'rgb(0,0,0, 0.5)' : 'rgb(0,0,0, 0.2)',
            transform: 'translateY(0%)'
        },
        onRest: () => { setAnimationComplete(true) }
    })

    const springApi2 = useSpringRef()
    const { size2, ...rest2 } = useSpring({
        ref: springApi2,
        config: config.stiff,
        from: { size2: '15%', background: 'rgb(0,0,0, 0.2)', transform: 'translateY(100%)' },
        to: {
            size2: open2 ? '30%' : '15%',
            background: open2 ? 'rgb(0,0,0, 0.5)' : 'rgb(0,0,0, 0.2)',
            transform: 'translateY(0%)'
        },
        onRest: () => { setAnimationComplete2(true) }
    })

    const springApi3 = useSpringRef()
    const { size3, ...rest3 } = useSpring({
        ref: springApi3,
        config: config.stiff,
        from: { size3: '15%', background: 'rgb(0,0,0, 0.2)', transform: 'translateY(100%)' },
        to: {
            size3: open3 ? '30%' : '15%',
            background: open3 ? 'rgb(0,0,0, 0.5)' : 'rgb(0,0,0, 0.2)',
            transform: 'translateY(0%)'
        },
        onRest: () => { setAnimationComplete3(true) }
    })

    const springApi4 = useSpringRef()
    const { size4, ...rest4 } = useSpring({
        ref: springApi4,
        config: config.stiff,
        from: { size4: '15%', background: 'rgb(0,0,0, 0.2)', transform: 'translateY(100%)' },
        to: {
            size4: open4 ? '30%' : '15%',
            background: open4 ? 'rgb(0,0,0, 0.5)' : 'rgb(0,0,0, 0.2)',
            transform: 'translateY(0%)'
        },
        onRest: () => { setAnimationComplete4(true) }
    })

    const springApi5 = useSpringRef()
    const { size5, ...rest5 } = useSpring({
        ref: springApi5,
        config: config.stiff,
        from: { size5: '15%', background: 'rgb(0,0,0, 0.2)', transform: 'translateY(100%)' },
        to: {
            size5: open5 ? '30%' : '15%',
            background: open5 ? 'rgb(0,0,0, 0.5)' : 'rgb(0,0,0, 0.2)',
            transform: 'translateY(0%)'
        },
        onRest: () => { setAnimationComplete5(true) }
    })

    const springApi6 = useSpringRef()
    const graphFade = useSpring({
        ref: springApi6,
        config: { tension: 280, friction: 120, duration: 2000 },
        from: { opacity: 0 },
        to: {
            opacity: 1
        },
    })

    useChain(open ? [springApi] : [springApi]);

    useChain(open2 ? [springApi2] : [springApi2]);

    useChain(open3 ? [springApi3] : [springApi3]);

    useChain(open4 ? [springApi4] : [springApi4]);

    useChain(open5 ? [springApi5] : [springApi5]);

    useChain(appState.submission ? [springApi, springApi2, springApi3, springApi4, springApi5] : null);

    useChain(appState.submission ? [springApi6] : null);

    return (
        <InfoMain>
            <SearchContainer>
                <SearchForm onSubmit={handleSubmit}>
                    {error ? <div style={{ color: "white" }}>Please select a valid city from the dropdown</div> : null}
                    <Autocomplete
                        id="searchInput"
                        placeholder="Enter a City"
                        apiKey={'AIzaSyBwzZ4Rd9vyA918srpcnfl_uY8uF5O_I3A'}
                        options={{
                            types: ["(cities)"],
                        }}
                        onPlaceSelected={async (place) => {
                            await setInputValue(place);
                        }}
                        size="40"
                        style={{ borderRadius: "5px", border: "0", boxSizing: "border-box", outlin: "none", backgroundColor: "rgb(31,31,31)", color: "white", height: "25px", padding: "2% 2.5%" }}
                    />
                    <SearchSubmit type="submit" />
                </SearchForm>
            </SearchContainer>
            <animated.div style={graphFade}>
                {graphDataExist == null ? <GraphErrorTitle>Loading...</GraphErrorTitle> :
                    <div>
                        {!graphDataExist ?
                            <GraphErrorTitle>No Forecast data available</GraphErrorTitle>
                            :
                            <GraphContainer>
                                <Selection>
                                    <InfoTitle>Air Quality Index Forecast</InfoTitle>
                                    <SelectionDropDown onChange={e => handleSelection(e)}>
                                        <SelectionDropDownItem id="avg" value="avg">Average</SelectionDropDownItem>
                                        <SelectionDropDownItem id="max" value="max">Maximum</SelectionDropDownItem>
                                        <SelectionDropDownItem id="min" value="min">Minimum</SelectionDropDownItem>
                                    </SelectionDropDown>
                                </Selection>
                                <LineChart width={appState.windowWidth} height={appState.windowHeight}>
                                    <XAxis dataKey="day" type="category" allowDuplicatedCategory={false} />
                                    <YAxis dataKey={dataChoice} type="number" />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend width={300} wrapperStyle={{ top: 0, right: 0, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '20px' }} />
                                    {dataSeries.map(s => (
                                        <Line dataKey={dataChoice} data={s.data} name={s.name} key={s.name} stroke={s.color} />
                                    ))}
                                </LineChart>
                            </GraphContainer>
                        }
                    </div>
                }
            </animated.div>

            <animated.div
                style={{ ...rest, width: size, height: size }}
                className="container"
                onClick={() => { set(!open); setAnimationComplete(false); }}>
                <CurrentAQIContainer>
                    {!open && animationComplete ? <AQIPrompt>AQI<AQIPromptValue>{currentAQI != null ? currentAQI[0].value : "N/A"}</AQIPromptValue></AQIPrompt> : null}
                    {open ? <CurrentAQIDivTitle>Placeholder</CurrentAQIDivTitle> : null}
                </CurrentAQIContainer>
            </animated.div>

            <animated.div
                style={{ ...rest2, width: size2, height: size2 }}
                className="container2"
                onClick={() => { set2(!open2); setAnimationComplete2(false); }}>
                <CurrentAQIContainer>
                    {!open2 && animationComplete2 ? <AQIPrompt>CO<AQIPromptValue>{currentCO != null ? currentCO[0].value : "N/A"}</AQIPromptValue></AQIPrompt> : null}
                    {open2 ? <CurrentAQIDivTitle>Placeholder</CurrentAQIDivTitle> : null}
                </CurrentAQIContainer>
            </animated.div>

            <animated.div
                style={{ ...rest3, width: size3, height: size3 }}
                className="container3"
                onClick={() => { set3(!open3); setAnimationComplete3(false); }}>
                <CurrentAQIContainer>
                    {!open3 && animationComplete3 ? <AQIPrompt>O3<AQIPromptValue>{currentO3 != null ? currentO3[0].value : "N/A"}</AQIPromptValue></AQIPrompt> : null}
                    {open3 ? <CurrentAQIDivTitle>Placeholder</CurrentAQIDivTitle> : null}
                </CurrentAQIContainer>
            </animated.div>


            <animated.div
                style={{ ...rest4, width: size4, height: size4 }}
                className="container4"
                onClick={() => { set4(!open4); setAnimationComplete4(false); }}>
                <CurrentAQIContainer>
                    {!open4 && animationComplete4 ? <AQIPrompt>PM10<AQIPromptValue>{currentPM10 != null ? currentPM10[0].value : "N/A"}</AQIPromptValue></AQIPrompt> : null}
                    {open4 ? <CurrentAQIDivTitle>Placeholder</CurrentAQIDivTitle> : null}
                </CurrentAQIContainer>
            </animated.div>


            <animated.div
                style={{ ...rest5, width: size5, height: size5 }}
                className="container5"
                onClick={() => { set5(!open5); setAnimationComplete5(false); }}>
                <CurrentAQIContainer>
                    {!open5 && animationComplete5 ? <AQIPrompt>PM25<AQIPromptValue>{currentPM25 != null ? currentPM25[0].value : "N/A"}</AQIPromptValue></AQIPrompt> : null}
                    {open5 ? <CurrentAQIDivTitle>Placeholder</CurrentAQIDivTitle> : null}
                </CurrentAQIContainer>
            </animated.div>

            <GeoContainer>
                <GeoCity>{appState.city}</GeoCity>
                <GeoCord>Latitude: {appState.lat} Longitude: {appState.long}</GeoCord>
            </GeoContainer>
        </InfoMain>
    );
}

export default InfoPage;
