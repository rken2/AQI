import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";

import SearchPage from "./Components/SearchPage/SearchPage";
import InfoPage from "./Components/InfoPage/InfoPage";

import {
  AppMain,
} from "./Style";

import {
  setWindowWidth,
  setWindowHeight
} from "./Slices/AppSlice";

const App = () => {
  let dispatch = useDispatch();
  let appState = useSelector(state => state.app);

  useEffect(() => {
    dispatch(setWindowWidth(window.innerWidth * 0.90));
    dispatch(setWindowHeight(window.innerHeight * 0.4));

    window.addEventListener("resize", () => {
      dispatch(setWindowWidth(window.innerWidth * 0.90));
      dispatch(setWindowHeight(window.innerHeight * 0.4));
    })
  }, [dispatch]);

  return (
    <AppMain>
      {!appState.submission ? <SearchPage/> : <InfoPage/>}
    </AppMain>
  );
}

export default App;
