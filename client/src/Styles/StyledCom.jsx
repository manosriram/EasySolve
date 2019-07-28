import styled from "styled-components";

export const StyledInput = styled.input`
  font-size: 2.1vh;
  border: solid;
  border-color : ${props => props.borderC}
  width: 25vw;
  height: 5vh;
  outline: none;

  &::placeholder {
    text-align: center;
    color: black;
    outline: none;
  }
`;

export const StyledButton = styled.button`
  outline: none;
  font-size: 2vh;
  width: auto;
  height: 5vh;
  background: lightblue;
  border-radius: 7px;
  transition: 0.3s;

  &:hover {
    cursor: pointer;
    outline: none;
  }
`;
