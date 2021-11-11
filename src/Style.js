import styled from 'styled-components';

export const AppMain = styled.div`
    min-height: 100vh;
    background-color: #282c34;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
`;

export const CitySelect = styled.input`
    width: 200px;
    height: 25px;
`;
export const AutoCompleteContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    color: white;
`;

export const AutoCompleteTitle = styled.div`
    font-size: 2rem;
    text-decoration: underline;
    margin-bottom: 2%;
`;

export const AutoComplete = styled.div`
    position: relative;
    display: inline-block;
`;

export const Input = styled.input`
    border: 0;
    box-sizing: border-box;
    margin-bottom: 0.5%;
    outline: none;
    padding: 2% 2.5%;
    background-color: rgb(31, 31, 31);
    color: white;
    font-size: 16px;

    &::placeholder {
        color: white;
    }
`;

export const InputSubmit = styled.input`
    background: transparent;
    border-color: white;
    border-style: solid;
    color: white;
    outline: none;
    padding: 1% 2%;
    transition: .5s ease;
    cursor: pointer;
    
    &:hover {
        background-color: rgb(100,100,100);
    }
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