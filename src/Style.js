import styled from 'styled-components';

export const AppMain = styled.div`
    min-height: 100vh;
    background-color: #282c34;
`;

export const CitySelect = styled.input`
    width: 200px;
    height: 25px;
`;

export const AutoComplete = styled.div`
    position: relative;
    display: inline-block;
`;

export const Input = styled.input`
    border: 1px solid transparent;
    background-color: #f1f1f1;
    padding: 10px;
    font-size: 16px;
`;

export const InfoContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    box-sizing: border-box;
    margin: 3% auto;
    width: 100%;
    max-width: 1200px;
    align-items: center;
    flex-direction: row;
`;

export const CityInfoContainer = styled.div`
    color: white;
`;

export const InfoTitle = styled.div`
    font-size: 2rem;
    text-decoration: underline;
    margin-bottom: 5%;
`;

export const CityInfoName = styled.div`
    font-size: 1.5rem;
`;

export const CityInfoGeo = styled.div`
    font-size: 1.5rem;
`;

export const CityInfoAQI = styled.div`
    font-size: 1.5rem;
`;

export const GraphContainer = styled.div`
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Graph = styled.div`
`;

export const Selection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    margin-bottom: 5%;
`;

export const SelectionAvg = styled.div`
    cursor: pointer;
    padding: 0.5% 3% 0.5% 3%;
    transition: .5s ease;
`;

export const SelectionMax = styled.div`
    cursor: pointer;
    padding: 0.5% 3% 0.5% 3%;
    transition: .5s ease;
`;

export const SelectionMin = styled.div`
    cursor: pointer;
    padding: 0.5% 3% 0.5% 3%;
    transition: .5s ease;
`;