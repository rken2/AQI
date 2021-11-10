import React, { useEffect, useState } from "react";
import "./App.css";
import { token } from "./token";

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import * as _ from 'lodash';

import {
  AppMain,
  AutoComplete,
  Input,
  InfoContainer,
  CityInfoContainer,
  InfoTitle,
  CityInfoName,
  CityInfoGeo,
  CityInfoAQI,
  GraphContainer,
  Graph,
  Selection,
  SelectionAvg,
  SelectionMax,
  SelectionMin
} from "./Style";

const App = () => {
  let [cities, setCities] = useState([]);
  let [inputValue, setInputValue] = useState("");
  let [selectedCity, setSelectedCity] = useState("");
  let [longitude, setlongitude] = useState("");
  let [latitude, setlatitude] = useState("");
  let [currentAQI, setCurrentAQI] = useState(0);
  let [graphDataExist, setGraphDataExist] = useState(false);
  let [PM25Data, setPM25Data] = useState([]);
  let [PM10Data, setPM10Data] = useState([]);
  let [O3Data, setO3Data] = useState([]);
  let [dataSeries, setDataSeries] = useState([]);
  let [avgColor, setAvgColor] = useState("rgb(0,0,0,0.5)");
  let [maxColor, setMaxColor] = useState("none");
  let [minColor, setMinColor] = useState("none");
  let [dataChoice, setDataChoice] = useState("avg");

  // Create auto-complete text box
  useEffect(() => {
    let inputElement = document.getElementById("myInput");

    let closeAllLists = (elmnt) => {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inputElement) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }

    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });

    if (cities.length != 0) {
      if (inputValue.length == 0) {
        return;
      }
      closeAllLists();

      let itemDiv = document.createElement("DIV");
      itemDiv.setAttribute("id", inputElement.id + "autocomplete-list");
      itemDiv.setAttribute("class", "autocomplete-items");

      inputElement.parentElement.appendChild(itemDiv);

      for (var i = 0; i < cities.length; i++) {
        if (cities[i].substr(0, inputValue.length).toUpperCase() == inputValue.toUpperCase()) {
          let b = document.createElement("DIV");
          b.innerHTML = "<strong>" + cities[i].substr(0, inputValue.length) + "</strong>";
          b.innerHTML += cities[i].substr(inputValue.length);
          b.innerHTML += "<input type='hidden' value='" + cities[i] + "'>";

          b.addEventListener("click", function (e) {

            inputElement.value = this.getElementsByTagName("input")[0].value;

            closeAllLists();
          });

          itemDiv.appendChild(b);
        }
      }
    }
  }, [cities, inputValue]);

  useEffect(() => {
    let series = [];

    if (O3Data.length != 0) {
      let O3DataObj = { name: 'o3', color: "red", data: O3Data };

      series.push(O3DataObj);
    }

    if (PM10Data.length != 0) {
      let PM10DataObj = { name: 'PM10', color: "blue", data: PM10Data };

      series.push(PM10DataObj);
    }

    if (PM25Data.length != 0) {
      let PM25DataObj = { name: 'PM25', color: "green", data: PM25Data };

      series.push(PM25DataObj);
    }

    if (series.length != 0) {
      setDataSeries(series);
    }
  }, [O3Data, PM10Data, PM25Data]);

  let inputChange = async (value) => {
    // fetch city names
    let cityAPIURL = "http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&offset=0&namePrefix=" + value;

    await fetch(cityAPIURL)
      .then((resp) => resp.json())
      .then(function (data) {
        let dataArr = data.data;
        let cityArr = [];

        for (var i = 0; i < dataArr.length; i++) {
          cityArr.push(dataArr[i].city);
        }

        setCities(cityArr);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  let handleSubmit = async (e) => {
    e.preventDefault();

    let value = document.getElementById("myInput").value;
    setSelectedCity(value);

    // get AQI City information
    let AQI_URL = "https://api.waqi.info/feed/" + value + "/?token=" + token;

    await fetch(AQI_URL)
      .then((resp) => resp.json())
      .then(async (data) => {
        let dataArr = data.data;

        console.log(data);

        if (data.status === "error") {
          alert("Error with city: " + dataArr + ". Please Select another city.");

          return;
        }

        await setlatitude(dataArr.city.geo[0]);
        await setlongitude(dataArr.city.geo[1]);

        await setCurrentAQI(dataArr.aqi);

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

  let handleSelection = (event) => {
    if (event.target.id == "avg") {
      setAvgColor("rgb(0,0,0,0.5)");
      setMaxColor("unset");
      setMinColor("unset");
      setDataChoice("avg");
    } else if (event.target.id == "max") {
      setAvgColor("unset");
      setMaxColor("rgb(0,0,0,0.5)");
      setMinColor("unset");
      setDataChoice("max");
    } else {
      setAvgColor("unset");
      setMaxColor("unset");
      setMinColor("rgb(0,0,0,0.5)");
      setDataChoice("min");
    }
  }

  return (
    <AppMain>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <AutoComplete className="autocomplete" style={{ marginRight: "10px" }}>
          <Input id="myInput" type="text" name="City" placeholder="City" onChange={async event => { await inputChange(event.target.value); await setInputValue(event.target.value) }} />
        </AutoComplete>
        <Input type="submit" />
      </form>

      <InfoContainer>
        <CityInfoContainer>
          <InfoTitle>Selected City Information</InfoTitle>
          <CityInfoName>Name: {selectedCity}</CityInfoName>
          <CityInfoGeo>
            Geo Location <br /> (latitude and longitude): {latitude} {longitude}
          </CityInfoGeo>
          <CityInfoAQI>Current AQI: {currentAQI}</CityInfoAQI>
        </CityInfoContainer>

        <GraphContainer>
          <InfoTitle>Graph Information</InfoTitle>
          {!graphDataExist ? <div>No Forecast data available</div>
            :
            <Graph>
              <Selection>
                <SelectionAvg id="avg" style={{ backgroundColor: avgColor }} onClick={e => handleSelection(e)}>Avg</SelectionAvg>
                <SelectionMax id="max" style={{ backgroundColor: maxColor }} onClick={e => handleSelection(e)}>Max</SelectionMax>
                <SelectionMin id="min" style={{ backgroundColor: minColor }} onClick={e => handleSelection(e)}>Min</SelectionMin>
              </Selection>
              <LineChart width={600} height={400}>
                <XAxis dataKey="day" type="category" allowDuplicatedCategory={false} />
                <YAxis dataKey={dataChoice} type="number" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend width={300} wrapperStyle={{ top: 0, right: 0, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '20px' }} />
                {dataSeries.map(s => (
                  <Line dataKey={dataChoice} data={s.data} name={s.name} key={s.name} stroke={s.color} />
                ))}
              </LineChart>
            </Graph>
          }
        </GraphContainer>
      </InfoContainer>
    </AppMain>
  );
}

export default App;
