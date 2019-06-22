import styled from "styled-components";

export const StyledInput = styled.input`
  font-size: 2.3vh;
  border: solid;
  border-color : ${props => props.borderC}
  width: 25vw;
  height: 5vh;
  outline: none;

  &::placeholder {
    color: black;
    text-align: center;
    outline: none;
  }
`;

export const StyledButton = styled.button`
  outline: none;
  font-size: 3vh;
  width: 9vw;
  height: 5vh;
  background: lightblue;
  border-radius: 7px;
  transition: 0.3s;

  &:hover {
    cursor: pointer;
    outline: none;
  }
`;
