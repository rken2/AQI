import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSpring, animated } from 'react-spring';
import Autocomplete from "react-google-autocomplete";

import {
    SearchMain,
    SearchContainer,
    SearchInput,
    SearchForm,
    SearchSubmit,
    SearchTitle,
    SearchAutoComplete
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
    let [size, setSize] = useState(60);

    useEffect(() => {
        if (window.innerWidth <= 768) {
            setSize(30);
        }
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

        if (inputValue.address_components == null || inputValue.address_components == undefined) {
            setError(true);

            return;
        } else {
            setError(false);
        }

        await setSubmission(true);

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

    return (
        <SearchMain>
            <SearchContainer>
                <animated.div style={slideInDownTitle}>
                    <SearchTitle>AQI INDEX</SearchTitle>
                </animated.div>
                <animated.div style={slideInDownSearch}>
                    <SearchInput>
                        {error ? <div style={{color: "white"}}>Please select a valid city from the dropdown</div> : null}
                        <SearchForm onSubmit={handleSubmit}>
                            <SearchAutoComplete>
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
                                    size={size}
                                    style={{ borderRadius: "5px", height: "3vh" }}
                                />
                            </SearchAutoComplete>
                            <SearchSubmit type="submit" />
                        </SearchForm>
                    </SearchInput>
                </animated.div>
            </SearchContainer>
        </SearchMain>
    );
}

export default SearchPage;
