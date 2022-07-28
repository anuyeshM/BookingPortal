import styled from 'styled-components';

const PasswordInputAuth = styled.input.attrs({
  
})`
  padding: 0 1rem;
  height: 100%;
  min-height: 2rem;
  border: 1px solid #9cb0b1;
  border-radius: ${(props) => props.borderRadius || '5px'};
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #828282;
  }
  font-size: 16px;
`;

export default PasswordInputAuth;