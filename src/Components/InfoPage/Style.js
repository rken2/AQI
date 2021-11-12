import styled from 'styled-components';

export const InfoMain = styled.div`
    min-height: 100vh;
    background-color: rgb(0,0,0,0.2);
    position: relative;
    border-radius: 5%;
`;

export const SearchContainer = styled.div`
    position: absolute;
    right: 5%;
    top 3%;
    z-index: 2;

    @media only screen and (max-width: 768px) {
        right: unset;
        width: 100%;
        display: flex;
        justify-content: center;
    }
`;

export const SearchForm = styled.form`
    display: flex;
`;

export const SearchSubmit = styled.input`
    display: none;
`;

export const GraphContainer = styled.div`
    position: absolute;
    top: 20%;
    color: black;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    z-index: 2;

    @media only screen and (max-width: 768px) {
        left: unset;
        top: 30%;
    }
`;

export const AQIPrompt = styled.div`
    font-size: 1.5rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    color: white;
    display: flex;
    align-items: center;
    height: 100%;
    text-align: center;
    flex-direction: column;
    justify-content: center;

    @media only screen and (max-width: 768px) {
        font-size: 1rem;
    }
`;

export const AQIPromptValue = styled.div`
    font-size: 4rem;

    @media only screen and (max-width: 768px) {
        font-size: 1.5rem;
    }
`;

export const CurrentAQIContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
`;

export const CurrentAQIDivTitle = styled.div`
    width: 100%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    margin-bottom: 10%;
`;

export const CurrentAQIDiv = styled.div`
    color: black;
    width: 100%;
    display: flex;
    align-items: center;
`;

export const CurrentAQIName = styled.div`
    font-size: 2rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    margin-right: 10%;
`;

export const CurrentAQIValue = styled.div`
    font-size: 1.5rem;
`;

export const GeoContainer = styled.div`
    position: absolute;
    top: 2%;
    left: 5%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    @media only screen and (max-width: 768px) {
        left: unset;
        top: 8%;
        width: 100%;
    }
`;

export const GeoCity = styled.div`
    color: white;
    font-size: 5rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    margin-bottom: 2%;
`;

export const GeoCord = styled.div`
    color: white;
    font-size: 1rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
`;

export const InfoTitle = styled.div`
    font-size: 2rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    color: white;
    margin-left: 5%;

    @media only screen and (max-width: 768px) {
        font-size: 1rem;
    }
`;

export const GraphErrorTitle = styled.div`
    font-size: 3rem;
    color: white;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Selection = styled.div`
    position: relative;
    display: flex;
    width: 100%;
    margin-bottom: 2%;
    color: white;

    @media only screen and (max-width: 768px) {
        margin-bottom: 5%;
    }
`;

export const SelectionAvg = styled.div`
    cursor: pointer;
    padding: 0.5% 3% 0.5% 3%;
    transition: .5s ease;
    border-radius: 5px;
`;

export const SelectionMax = styled.div`
    cursor: pointer;
    padding: 0.5% 3% 0.5% 3%;
    transition: .5s ease;
    border-radius: 5px;
`;

export const SelectionMin = styled.div`
    cursor: pointer;
    padding: 0.5% 3% 0.5% 3%;
    transition: .5s ease;
    border-radius: 5px;
`;

export const SelectionDropDown = styled.select`
    position: absolute;
    right: 5%;
    border-radius: 5px;
    padding: 0.5% 1%;
`;

export const SelectionDropDownItem = styled.option`
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
`;

export const CardContainer = styled.div`
    position: absolute;
    bottom: 5%;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: flex-end;
    z-index: 1;
`;