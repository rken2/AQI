import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSpring, animated } from 'react-spring';

import {
    SearchMain,
    SearchContainer,
    SearchInput,
    SearchForm,
    SearchSubmit,
    SearchTitle,
    SearchAutoComplete,
    SearchAutoCompleteContainer
} from "./Style";

import {
    setCity,
    setCountry,
    setLat,
    setLong,
    setFormSubmission
} from "../../Slices/AppSlice";

const SearchPage = () => {
    let dispatch = useDispatch();
    let [inputValue, setInputValue] = useState(null);
    let [submission, setSubmission] = useState(false);
    let [error, setError] = useState(false);
    var currentFocus = -1;

    let closeAllLists = (element) => {
        var x = document.getElementsByClassName("autocomplete-items");
        let input = document.getElementById("myInput");

        for (var i = 0; i < x.length; i++) {
            if (element != x[i] && element != input) {
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
        let input = document.getElementById("myInput");

        input.addEventListener("keydown", (e) => {
            let innerItem = document.getElementById(input.id + "autocomplete-list");

            if (innerItem) {
                innerItem = innerItem.getElementsByTagName("div");

                if (innerItem.length) {
                    if (e.keyCode == 40) {
                        currentFocus++;

                        addActive(innerItem);
                    } else if (e.keyCode == 38) {
                        currentFocus--;

                        addActive(innerItem);
                    } else if (e.keyCode == 13) {
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

    // UI Effects
    const slideInDownTitle = useSpring({
        from: {
            transform: !submission ? 'translateY(-50%)' : null,
            opacity: !submission ? 0 : 1,
        },
        to: {
            transform: !submission ? 'translateY(0%)' : null,
            opacity: !submission ? 1 : 0,
        },
        config: {
            tension: 280,
            friction: 100,
            clamp: true,
            precision: 0.001,
            velocity: -0.05,
            duration: 1000
        },
    });

    const slideInDownSearch = useSpring({
        from: {
            transform: !submission ? 'translateY(-50%)' : null,
            opacity: !submission ? 0 : 1,
        },
        to: {
            transform: !submission ? 'translateY(0%)' : null,
            opacity: !submission ? 1 : 0,
        },
        delay: !submission ? 1000 : 0,
        config: {
            tension: 280,
            friction: 100,
            clamp: true,
            precision: 0.001,
            velocity: -0.05,
            duration: 1000
        },
        onRest: async () => { if (submission) { await dispatch(setFormSubmission(true)) } }
    });

    let handleSubmit = async (e) => {
        e.preventDefault();

        if (inputValue == null) {
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
                        await dispatch(setCity(inputValue));
                        await dispatch(setCountry(data[0].country));
                        await dispatch(setLat(data[0].lat));
                        await dispatch(setLong(data[0].lng));
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });

        await setSubmission(true);
    }

    let handleChange = async (e) => {
        if (e.target.value === "") {
            return;
        }

        let enteredCity = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);

        let cityUrl = "https://aqi-city-3125.herokuapp.com/city/" + enteredCity;

        if (e.target.value != "") {
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
                        if (i == 6) { break; }

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

    return (
        <SearchMain>
            <SearchContainer>
                <animated.div style={slideInDownTitle}>
                    <SearchTitle>AQI INDEX</SearchTitle>
                </animated.div>
                <animated.div style={slideInDownSearch}>
                    <SearchInput>
                        {error ? <div style={{ color: "white" }}>Please select a valid city from the dropdown</div> : null}
                        <SearchForm onSubmit={handleSubmit}>
                            <SearchAutoCompleteContainer id="inputContainer">
                                <SearchAutoComplete onChange={handleChange} id="myInput" placeholder="City" autocomplete="off">
                                </SearchAutoComplete>
                            </SearchAutoCompleteContainer>
                            <SearchSubmit type="submit" />
                        </SearchForm>
                    </SearchInput>
                </animated.div>
            </SearchContainer>
        </SearchMain>
    );
}

export default SearchPage;
