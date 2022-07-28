import styled from 'styled-components';

const TextBox = styled.textarea
`
  padding: 5px 1rem;
  width: auto;
  height: 100%;
  min-height: 2rem;
  border: 1px solid #9CB0B1;
  resize: none;
  border-radius: ${props => props.borderRadius || "5px" };
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #828282;
  }
`

export default TextBox;