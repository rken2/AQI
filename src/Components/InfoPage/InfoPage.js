import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSpring, useSpringRef, useChain, animated, config } from 'react-spring';

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
    SelectionDropDownItem,
    CardContainer,
    Label,
    LabelAQI,
    SearchAutoComplete,
    SearchAutoCompleteContainer
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

    let [legendWidth, setLegendWidth] = useState(300);
    let [cardSize, setCardSize] = useState("15%");

    let [AQIColor, setAQIColor] = useState("unset");
    let [COColor, setCOColor] = useState("unset");
    let [O3Color, setO3Color] = useState("unset");
    let [PM10Color, setPM10Color] = useState("unset");
    let [PM25Color, setPM25Color] = useState("unset");

    let [graphZIndex, setGraphZIndex] = useState(2);

    let [container1Translate, setContainer1Translate] = useState(false);
    let [container1Scale, setContainer1Scale] = useState(false);

    let [container2Translate, setContainer2Translate] = useState(false);
    let [container2Scale, setContainer2Scale] = useState(false);

    let [container3Translate, setContainer3Translate] = useState(false);
    let [container3Scale, setContainer3Scale] = useState(false);

    let [container4Translate, setContainer4Translate] = useState(false);
    let [container4Scale, setContainer4Scale] = useState(false);

    let [container5Translate, setContainer5Translate] = useState(false);
    let [container5Scale, setContainer5Scale] = useState(false);

    let currentFocus = -1;

    let closeAllLists = (element) => {
        var x = document.getElementsByClassName("autocomplete-items");
        let input = document.getElementById("myInput");

        for (var i = 0; i < x.length; i++) {
            if (element !== x[i] && element !== input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    let addActive = (x) => {
        if (!x) { return false; }

        removeActive(x);

        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);

        x[currentFocus].setAttribute("class", "autocomplete-active");
    }

    let removeActive = (x) => {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    useEffect(() => {
        if (window.innerWidth <= 768) {
            setLegendWidth(100);
            setCardSize("5%");
        }

        let input = document.getElementById("myInput");

        input.addEventListener("keydown", (e) => {
            let innerItem = document.getElementById(input.id + "autocomplete-list");

            console.log(currentFocus);

            if (innerItem) {
                innerItem = innerItem.getElementsByTagName("div");

                if (innerItem.length) {
                    if (e.keyCode === 40) {
                        currentFocus++;

                        addActive(innerItem);
                    } else if (e.keyCode === 38) {
                        currentFocus--;

                        addActive(innerItem);
                    } else if (e.keyCode === 13) {
                        e.preventDefault();

                        if (currentFocus > -1) {
                            if (input) { innerItem[currentFocus].click() }
                        }
                    }
                }
            }
        })

        document.addEventListener("click", (e) => {
            closeAllLists(e.target);
        });
    }, []);

    useEffect(() => {
        if (!open && !open2 && !open3 && !open4 && !open5) {
            setGraphZIndex(2);
        } else {
            setGraphZIndex(0);
        }
    }, [open, open2, open3, open4, open5]);

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

    // Fetch AQI data from API
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
                        if (dataArr[i].station.country === appState.country) {
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

                        if (dataArr.aqi <= 50) {
                            await setAQIColor("green");
                        } else if (dataArr.aqi > 50 && dataArr.aqi <= 100) {
                            await setAQIColor("yellow");
                        } else if (dataArr.aqi > 100 && dataArr.aqi <= 150) {
                            await setAQIColor("orange");
                        } else if (dataArr.aqi > 150 && dataArr.aqi <= 200) {
                            await setAQIColor("red");
                        } else if (dataArr.aqi > 200 && dataArr.aqi <= 300) {
                            await setAQIColor("purple");
                        } else {
                            await setAQIColor("maroon");
                        }


                        await setCurrentAQI(temp);
                    } else {
                        await setCurrentAQI(null);
                    }

                    if (dataArr.iaqi.co) {
                        let temp = [];
                        temp.push({ name: "CO", value: dataArr.iaqi.co.v, css: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' });

                        if (dataArr.iaqi.co.v <= 4.4) {
                            await setCOColor("rgb(0,228,0)");
                        } else if (dataArr.iaqi.co.v > 4.4 && dataArr.iaqi.co.v <= 9.4) {
                            await setCOColor("rgb(255,255,0)");
                        } else if (dataArr.iaqi.co.v > 9.4 && dataArr.iaqi.co.v <= 12.4) {
                            await setCOColor("rgb(255,126,0)");
                        } else if (dataArr.iaqi.co.v > 12.4 && dataArr.iaqi.co.v <= 15.4) {
                            await setCOColor("rgb(255,0,0)");
                        } else if (dataArr.iaqi.co.v > 15.4 && dataArr.iaqi.co.v <= 30.4) {
                            await setCOColor("rgb(255,255,0)");
                        } else if (dataArr.iaqi.co.v > 30.4 && dataArr.iaqi.co.v <= 40.4) {
                            await setCOColor("rgb(153,0,76)");
                        } else {
                            await setCOColor("rgb(126,0,35)");
                        }

                        await setCurrentCO(temp);
                    } else {
                        await setCurrentCO(null);
                    }

                    if (dataArr.iaqi.o3) {
                        let temp = [];
                        temp.push({ name: "O3", value: dataArr.iaqi.o3.v, css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' });

                        if (dataArr.iaqi.o3.v <= 33) {
                            await setO3Color("rgb(204,255,204)");
                        } else if (dataArr.iaqi.o3.v > 33 && dataArr.iaqi.o3.v <= 66) {
                            await setO3Color("rgb(102,255,102)");
                        } else if (dataArr.iaqi.o3.v > 66 && dataArr.iaqi.o3.v <= 100) {
                            await setO3Color("rgb(0,255,0)");
                        } else if (dataArr.iaqi.o3.v > 100 && dataArr.iaqi.o3.v <= 120) {
                            await setO3Color("rgb(153,255,0)");
                        } else if (dataArr.iaqi.o3.v > 120 && dataArr.iaqi.o3.v <= 140) {
                            await setO3Color("rgb(255,255,0)");
                        } else if (dataArr.iaqi.o3.v > 140 && dataArr.iaqi.o3.v <= 160) {
                            await setO3Color("rgb(255,204,0)");
                        } else if (dataArr.iaqi.o3.v > 160 && dataArr.iaqi.o3.v <= 187) {
                            await setO3Color("rgb(255,102,0)");
                        } else if (dataArr.iaqi.o3.v > 187 && dataArr.iaqi.o3.v <= 213) {
                            await setO3Color("rgb(255,51,0)");
                        } else if (dataArr.iaqi.o3.v > 213 && dataArr.iaqi.o3.v <= 240) {
                            await setO3Color("rgb(255,0,0)");
                        } else {
                            await setO3Color("rgb(255,0,102)");
                        }

                        await setCurrentO3(temp);
                    } else {
                        await setCurrentO3(null);
                    }

                    if (dataArr.iaqi.pm10) {
                        let temp = [];
                        temp.push({ name: "PM10", value: dataArr.iaqi.pm10.v, css: 'linear-gradient(135deg, #E3FDF5 0%, #FFE6FA 100%)' });

                        if (dataArr.iaqi.pm10.v <= 11) {
                            await setPM10Color("rgb(204,255,204)");
                        } else if (dataArr.iaqi.pm10.v > 11 && dataArr.iaqi.pm10.v <= 23) {
                            await setPM10Color("rgb(102,255,102)");
                        } else if (dataArr.iaqi.pm10.v > 23 && dataArr.iaqi.pm10.v <= 35) {
                            await setPM10Color("rgb(0,255,0)");
                        } else if (dataArr.iaqi.pm10.v > 35 && dataArr.iaqi.pm10.v <= 41) {
                            await setPM10Color("rgb(153,255,0)");
                        } else if (dataArr.iaqi.pm10.v > 41 && dataArr.iaqi.pm10.v <= 47) {
                            await setPM10Color("rgb(255,255,0)");
                        } else if (dataArr.iaqi.pm10.v > 47 && dataArr.iaqi.pm10.v <= 53) {
                            await setPM10Color("rgb(255,204,0)");
                        } else if (dataArr.iaqi.pm10.v > 53 && dataArr.iaqi.pm10.v <= 58) {
                            await setPM10Color("rgb(255,102,0)");
                        } else if (dataArr.iaqi.pm10.v > 58 && dataArr.iaqi.pm10.v <= 64) {
                            await setPM10Color("rgb(255,51,0)");
                        } else if (dataArr.iaqi.pm10.v > 64 && dataArr.iaqi.pm10.v <= 70) {
                            await setPM10Color("rgb(255,0,0)");
                        } else {
                            await setPM10Color("rgb(255,0,102)");
                        }

                        await setCurrentPM10(temp);
                    } else {
                        await setCurrentPM10(null);
                    }

                    if (dataArr.iaqi.pm25) {
                        let temp = [];
                        temp.push({ name: "PM2.5", value: dataArr.iaqi.pm25.v, css: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)' });

                        if (dataArr.iaqi.pm25.v <= 16) {
                            await setPM25Color("rgb(204,255,204)");
                        } else if (dataArr.iaqi.pm25.v > 16 && dataArr.iaqi.pm25.v <= 33) {
                            await setPM25Color("rgb(102,255,102)");
                        } else if (dataArr.iaqi.pm25.v > 33 && dataArr.iaqi.pm25.v <= 50) {
                            await setPM25Color("rgb(0,255,0)");
                        } else if (dataArr.iaqi.pm25.v > 50 && dataArr.iaqi.pm25.v <= 58) {
                            await setPM25Color("rgb(153,255,0)");
                        } else if (dataArr.iaqi.pm25.v > 58 && dataArr.iaqi.pm25.v <= 66) {
                            await setPM25Color("rgb(255,255,0)");
                        } else if (dataArr.iaqi.pm25.v > 66 && dataArr.iaqi.pm25.v <= 75) {
                            await setPM25Color("rgb(255,204,0)");
                        } else if (dataArr.iaqi.pm25.v > 75 && dataArr.iaqi.pm25.v <= 83) {
                            await setPM25Color("rgb(255,102,0)");
                        } else if (dataArr.iaqi.pm25.v > 83 && dataArr.iaqi.pm25.v <= 91) {
                            await setPM25Color("rgb(255,51,0)");
                        } else if (dataArr.iaqi.pm25.v > 91 && dataArr.iaqi.pm25.v <= 100) {
                            await setPM25Color("rgb(255,0,0)");
                        } else {
                            await setPM25Color("rgb(255,0,102)");
                        }

                        await setCurrentPM25(temp);
                    } else {
                        await setCurrentPM25(null);
                    }

                    if (dataArr.forecast === undefined) {
                        await setGraphDataExist(false);
                    } else {
                        await setGraphDataExist(true);

                        if (dataArr.forecast.daily.o3 !== undefined) {
                            await setO3Data(dataArr.forecast.daily.o3);
                        }

                        if (dataArr.forecast.daily.pm10 !== undefined) {
                            await setPM10Data(dataArr.forecast.daily.pm10);
                        }

                        if (dataArr.forecast.daily.pm25 !== undefined) {
                            await setPM25Data(dataArr.forecast.daily.pm25);
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        if (appState.city !== "") {
            fetchAQIData();
        }
    }, [appState.city]);

    // Handle city input
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
        await setAQIColor("unset");
        await setCOColor("unset");
        await setO3Color("unset");
        await setPM10Color("unset");
        await setPM25Color("unset");

        if (inputValue === null || inputValue === undefined) {
            setError(true);

            return;
        } else {
            setError(false);
        }

        let cityUrl = "https://aqi-city-3125.herokuapp.com/city/" + inputValue;

        await fetch(cityUrl)
            .then((resp) => resp.json())
            .then(async (data) => {
                console.log(data);
                if (data.length) {
                    await dispatch(setCountry(data[0].country));
                    await dispatch(setLat(data[0].lat));
                    await dispatch(setLong(data[0].lng));
                    await dispatch(setCity(inputValue));
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    // Handle graph selection
    let handleSelection = (event) => {
        console.log(event.target.value);
        if (event.target.value === "avg") {
            setDataChoice("avg");
        } else if (event.target.value === "max") {
            setDataChoice("max");
        } else {
            setDataChoice("min");
        }
    }

    let handleChange = async (e) => {
        if (e.target.value === "") {
            return;
        }

        let enteredCity = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);

        let cityUrl = "https://aqi-city-3125.herokuapp.com/city/" + enteredCity;

        if (e.target.value !== "") {
            await fetch(cityUrl)
                .then((resp) => resp.json())
                .then(async (data) => {
                    closeAllLists();
                    currentFocus = -1;

                    let itemDiv = document.createElement("div");
                    let input = document.getElementById("myInput");

                    itemDiv.setAttribute("id", input.id + "autocomplete-list");
                    itemDiv.setAttribute("class", "autocomplete-items");

                    let inputContainer = document.getElementById("inputContainer");
                    inputContainer.appendChild(itemDiv);

                    for (var i = 0; i < data.length; i++) {
                        if (i === 6) { break; }

                        if (data[i].name.substring(0, e.target.value.length).toUpperCase() === e.target.value.toUpperCase()) {
                            let innerItemDiv = document.createElement("div");
                            innerItemDiv.innerHTML = "<strong>" + data[i].name.substr(0, e.target.value.length) + "</strong>";
                            innerItemDiv.innerHTML += data[i].name.substr(e.target.value.length);

                            innerItemDiv.innerHTML += "<input type='hidden' value='" + data[i].name + "'>";

                            innerItemDiv.addEventListener("click", (e) => {
                                if (!e) {
                                    return;
                                }

                                input.value = e.target.innerText;
                                setInputValue(e.target.innerText);

                                closeAllLists();
                            });

                            itemDiv.appendChild(innerItemDiv);
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    // UI Effects
    const springApi = useSpringRef()
    const { size, ...rest } = useSpring({
        ref: springApi,
        config: config.stiff,
        from: { size: cardSize, background: 'rgb(0,0,0, 0.2)', transform: !container1Translate ? 'translateY(100%)' : (container1Scale ? "scale(1)" : "scale(1.1)") },
        to: {
            size: open ? '30%' : cardSize,
            background: open ? 'rgb(0,0,0)' : 'rgb(0,0,0,0.2)',
            transform: !container1Translate ? 'translateY(0%)' : (container1Scale ? "scale(1.1)" : "scale(1)"),
        },
        onRest: () => { setAnimationComplete(true); setContainer1Translate(true); }
    })

    const springApi2 = useSpringRef()
    const { size2, ...rest2 } = useSpring({
        ref: springApi2,
        config: config.stiff,
        from: { size2: cardSize, background: 'rgb(0,0,0, 0.2)', transform: !container2Translate ? 'translateY(100%)' : (container2Scale ? "scale(1)" : "scale(1.1)") },
        to: {
            size2: open2 ? '30%' : cardSize,
            background: open2 ? 'rgb(0,0,0)' : 'rgb(0,0,0, 0.2)',
            transform: !container2Translate ? 'translateY(0%)' : (container2Scale ? "scale(1.1)" : "scale(1)"),
        },
        onRest: () => { setAnimationComplete2(true); setContainer2Translate(true); }
    })

    const springApi3 = useSpringRef()
    const { size3, ...rest3 } = useSpring({
        ref: springApi3,
        config: config.stiff,
        from: { size3: cardSize, background: 'rgb(0,0,0, 0.2)', transform: !container3Translate ? 'translateY(100%)' : (container3Scale ? "scale(1)" : "scale(1.1)") },
        to: {
            size3: open3 ? '30%' : cardSize,
            background: open3 ? 'rgb(0,0,0)' : 'rgb(0,0,0, 0.2)',
            transform: !container3Translate ? 'translateY(0%)' : (container3Scale ? "scale(1.1)" : "scale(1)"),
        },
        onRest: () => { setAnimationComplete3(true); setContainer3Translate(true); }
    })

    const springApi4 = useSpringRef()
    const { size4, ...rest4 } = useSpring({
        ref: springApi4,
        config: config.stiff,
        from: { size4: cardSize, background: 'rgb(0,0,0, 0.2)', transform: !container4Translate ? 'translateY(100%)' : (container4Scale ? "scale(1)" : "scale(1.1)") },
        to: {
            size4: open4 ? '30%' : cardSize,
            background: open4 ? 'rgb(0,0,0)' : 'rgb(0,0,0, 0.2)',
            transform: !container4Translate ? 'translateY(0%)' : (container4Scale ? "scale(1.1)" : "scale(1)"),
        },
        onRest: () => { setAnimationComplete4(true); setContainer4Translate(true); }
    })

    const springApi5 = useSpringRef()
    const { size5, ...rest5 } = useSpring({
        ref: springApi5,
        config: config.stiff,
        from: { size5: cardSize, background: 'rgb(0,0,0, 0.2)', transform: !container5Translate ? 'translateY(100%)' : (container5Scale ? "scale(1)" : "scale(1.1)") },
        to: {
            size5: open5 ? '30%' : cardSize,
            background: open5 ? 'rgb(0,0,0)' : 'rgb(0,0,0, 0.2)',
            transform: !container5Translate ? 'translateY(0%)' : (container5Scale ? "scale(1.1)" : "scale(1)"),
        },
        onRest: () => { setAnimationComplete5(true); setContainer5Translate(true); }
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

    useChain(open || container1Scale ? [springApi] : [springApi]);
    useChain(open2 || container2Scale ? [springApi2] : [springApi2]);
    useChain(open3 || container3Scale ? [springApi3] : [springApi3]);
    useChain(open4 || container4Scale ? [springApi4] : [springApi4]);
    useChain(open5 || container5Scale ? [springApi5] : [springApi5]);

    useChain(appState.submission ? [springApi, springApi2, springApi3, springApi4, springApi5] : null);

    useChain(appState.submission ? [springApi6] : null);

    return (
        <InfoMain>
            <SearchContainer>
                <SearchForm onSubmit={handleSubmit}>
                    {error ? <div style={{ color: "white" }}>Please select a valid city from the dropdown</div> : null}
                    <SearchAutoCompleteContainer id="inputContainer">
                        <SearchAutoComplete onChange={handleChange} id="myInput" placeholder="City">
                        </SearchAutoComplete>
                    </SearchAutoCompleteContainer>
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
                                <LineChart width={appState.windowWidth} height={appState.windowHeight} style={{ zIndex: graphZIndex }}>
                                    <XAxis dataKey="day" type="category" allowDuplicatedCategory={false} />
                                    <YAxis dataKey={dataChoice} type="number" />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend width={legendWidth} wrapperStyle={{ top: 0, right: 0, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '20px' }} />
                                    {dataSeries.map(s => (
                                        <Line dataKey={dataChoice} data={s.data} name={s.name} key={s.name} stroke={s.color} />
                                    ))}
                                </LineChart>
                            </GraphContainer>
                        }
                    </div>
                }
            </animated.div>

            <CardContainer>
                <animated.div
                    style={{ ...rest, width: size, height: size }}
                    className="container"
                    onClick={async () => { await set(!open); await setAnimationComplete(false); }}
                    onMouseEnter={async () => { if (!open) { await setContainer1Scale(true) } }}
                    onMouseLeave={async () => { if (!open) { await setContainer1Scale(false) } }}
                >
                    <CurrentAQIContainer>
                        {!open && animationComplete ? <AQIPrompt><AQIPromptValue style={{ color: AQIColor }}>{currentAQI != null ? currentAQI[0].value : "N/A"}</AQIPromptValue>AQI</AQIPrompt> : null}
                        {open ? <CurrentAQIDivTitle>
                            <LabelAQI><p style={{ color: "green" }}>Green</p> - Good</LabelAQI>
                            <LabelAQI><p style={{ color: "yellow" }}>Yellow</p> - Moderate</LabelAQI>
                            <LabelAQI><p style={{ color: "orange" }}>Orange</p> - Unhealthy for Sensitive Groups</LabelAQI>
                            <LabelAQI><p style={{ color: "red" }}>Red</p> - Unhealthy</LabelAQI>
                            <LabelAQI><p style={{ color: "purple" }}>Purple</p> - Very Unhealthy</LabelAQI>
                            <LabelAQI><p style={{ color: "maroon" }}>Maroon</p> - Hazardous</LabelAQI>
                        </CurrentAQIDivTitle> : null}
                    </CurrentAQIContainer>
                </animated.div>

                <animated.div
                    style={{ ...rest2, width: size2, height: size2 }}
                    className="container2"
                    onClick={() => { set2(!open2); setAnimationComplete2(false); }}
                    onMouseEnter={async () => { if (!open2) { await setContainer2Scale(true) } }}
                    onMouseLeave={async () => { if (!open2) { await setContainer2Scale(false) } }}
                >
                    <CurrentAQIContainer>
                        {!open2 && animationComplete2 ? <AQIPrompt><AQIPromptValue style={{ color: COColor }}>{currentCO != null ? currentCO[0].value : "N/A"}</AQIPromptValue>CO</AQIPrompt> : null}
                        {open2 ? <CurrentAQIDivTitle>
                            <LabelAQI><p style={{ color: "rgb(0,228,0)" }}>0.0 - 4.4</p></LabelAQI>
                            <LabelAQI><p style={{ color: "rgb(255,255,0)" }}>4.5 - 9.4</p></LabelAQI>
                            <LabelAQI><p style={{ color: "rgb(255,126,0)" }}>9.5 - 12.4</p></LabelAQI>
                            <LabelAQI><p style={{ color: "rgb(255,0,0)" }}>12.5 - 15.4</p></LabelAQI>
                            <LabelAQI><p style={{ color: "rgb(255,255,0)" }}>15.5 - 30.4</p></LabelAQI>
                            <LabelAQI><p style={{ color: "rgb(153,0,76)" }}>30.5 - 40.4</p></LabelAQI>
                            <LabelAQI><p style={{ color: "rgb(126,0,35)" }}>More than 40.5 </p></LabelAQI>
                        </CurrentAQIDivTitle> : null}
                    </CurrentAQIContainer>
                </animated.div>

                <animated.div
                    style={{ ...rest3, width: size3, height: size3 }}
                    className="container3"
                    onClick={() => { set3(!open3); setAnimationComplete3(false); }}
                    onMouseEnter={async () => { if (!open3) { await setContainer3Scale(true) } }}
                    onMouseLeave={async () => { if (!open3) { await setContainer3Scale(false) } }}
                >
                    <CurrentAQIContainer>
                        {!open3 && animationComplete3 ? <AQIPrompt><AQIPromptValue style={{ color: O3Color }}>{currentO3 != null ? currentO3[0].value : "N/A"}</AQIPromptValue>O3</AQIPrompt> : null}
                        {open3 ? <CurrentAQIDivTitle>
                            <Label><p style={{ color: "rgb(204,255,204)" }}>0 - 33</p></Label>
                            <Label><p style={{ color: "rgb(102,255,102)" }}>34 - 66</p></Label>
                            <Label><p style={{ color: "rgb(0,255,0)" }}>67 - 100</p></Label>
                            <Label><p style={{ color: "rgb(153,255,0)" }}>101 - 120</p></Label>
                            <Label><p style={{ color: "rgb(255,255,0)" }}>121 - 140</p></Label>
                            <Label><p style={{ color: "rgb(255,204,0)" }}>141 - 160</p></Label>
                            <Label><p style={{ color: "rgb(255,102,0)" }}>161 - 187 </p></Label>
                            <Label><p style={{ color: "rgb(255,51,0)" }}>188 - 213 </p></Label>
                            <Label><p style={{ color: "rgb(255,0,0)" }}>214 - 240 </p></Label>
                            <Label><p style={{ color: "rgb(255,0,102)" }}>More than 240 </p></Label>
                        </CurrentAQIDivTitle> : null}
                    </CurrentAQIContainer>
                </animated.div>


                <animated.div
                    style={{ ...rest4, width: size4, height: size4 }}
                    className="container4"
                    onClick={() => { set4(!open4); setAnimationComplete4(false); }}
                    onMouseEnter={async () => { if (!open4) { await setContainer4Scale(true) } }}
                    onMouseLeave={async () => { if (!open4) { await setContainer4Scale(false) } }}
                >
                    <CurrentAQIContainer>
                        {!open4 && animationComplete4 ? <AQIPrompt><AQIPromptValue style={{ color: PM10Color }}>{currentPM10 != null ? currentPM10[0].value : "N/A"}</AQIPromptValue>PM10</AQIPrompt> : null}
                        {open4 ? <CurrentAQIDivTitle>
                            <Label><p style={{ color: "rgb(204,255,204)" }}>0 - 16</p></Label>
                            <Label><p style={{ color: "rgb(102,255,102)" }}>17 - 33</p></Label>
                            <Label><p style={{ color: "rgb(0,255,0)" }}>34 - 50</p></Label>
                            <Label><p style={{ color: "rgb(153,255,0)" }}>51 - 58</p></Label>
                            <Label><p style={{ color: "rgb(255,255,0)" }}>59 - 66</p></Label>
                            <Label><p style={{ color: "rgb(255,204,0)" }}>67 - 75</p></Label>
                            <Label><p style={{ color: "rgb(255,102,0)" }}>76 - 83 </p></Label>
                            <Label><p style={{ color: "rgb(255,51,0)" }}>84 - 91</p></Label>
                            <Label><p style={{ color: "rgb(255,0,0)" }}>92 - 100</p></Label>
                            <Label><p style={{ color: "rgb(255,0,102)" }}>More than 100</p></Label>
                        </CurrentAQIDivTitle> : null}
                    </CurrentAQIContainer>
                </animated.div>


                <animated.div
                    style={{ ...rest5, width: size5, height: size5 }}
                    className="container5"
                    onClick={() => { set5(!open5); setAnimationComplete5(false); }}
                    onMouseEnter={async () => { if (!open5) { await setContainer5Scale(true) } }}
                    onMouseLeave={async () => { if (!open5) { await setContainer5Scale(false) } }}
                >
                    <CurrentAQIContainer>
                        {!open5 && animationComplete5 ? <AQIPrompt><AQIPromptValue style={{ color: PM25Color }}>{currentPM25 != null ? currentPM25[0].value : "N/A"}</AQIPromptValue>PM2.5</AQIPrompt> : null}
                        {open5 ? <CurrentAQIDivTitle>
                            <Label><p style={{ color: "rgb(204,255,204)" }}>0 - 11</p></Label>
                            <Label><p style={{ color: "rgb(102,255,102)" }}>12 - 23</p></Label>
                            <Label><p style={{ color: "rgb(0,255,0)" }}>24 - 35</p></Label>
                            <Label><p style={{ color: "rgb(153,255,0)" }}>36 - 41</p></Label>
                            <Label><p style={{ color: "rgb(255,255,0)" }}>42 - 47</p></Label>
                            <Label><p style={{ color: "rgb(255,204,0)" }}>48 - 53</p></Label>
                            <Label><p style={{ color: "rgb(255,102,0)" }}>54 - 58</p></Label>
                            <Label><p style={{ color: "rgb(255,51,0)" }}>59 - 64</p></Label>
                            <Label><p style={{ color: "rgb(255,0,0)" }}>65 - 70</p></Label>
                            <Label><p style={{ color: "rgb(255,0,102)" }}>More than 70</p></Label>
                        </CurrentAQIDivTitle> : null}
                    </CurrentAQIContainer>
                </animated.div>
            </CardContainer>

            <GeoContainer>
                <GeoCity>{appState.city}</GeoCity>
                <GeoCord>({appState.lat}, {appState.long})</GeoCord>
            </GeoContainer>
        </InfoMain>
    );
}

export default InfoPage;