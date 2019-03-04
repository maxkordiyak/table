import styled from "styled-components";
export const SearchBox = styled.div`
  display: flex;
  padding: 11px 0;
`;
export const SearchInput = styled.input`
  font-size: 18px;
  border: 0;
  opacity: 0.6;
  line-height: 1.33;
  margin-left: 8px;
  &::placeholder {
    color: ${({theme}) => theme.colors.steel};
    font-style: italic;
  }
  &:focus {
    outline-width: 0;
  }
  &:disabled {
    background-color: transparent;
  }
`;
