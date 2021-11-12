import styled from 'styled-components';

export const SearchMain = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const SearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const SearchInput = styled.div`
`;

export const SearchForm = styled.form`
    display: flex;
    flex-direction: row;
`;

export const SearchAutoComplete = styled.div`
    
`;

export const SearchSubmit = styled.input`
    background: transparent;
    border-color: white;
    border-style: solid;
    color: white;
    outline: none;
    padding: 1% 2%;
    transition: .5s ease;
    cursor: pointer;
    border-radius: 10px;

    &:hover {
        background-color: rgb(100,100,100);
    }
`;

export const SearchTitle = styled.div`
    color: white;
    font-size: 5rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    margin-bottom: 5%;

    @media only screen and (max-width: 768px) {
        font-size: 2rem;
    }
`;