import styled from 'styled-components';

const NumberInput = styled.input.attrs({
  type: 'number',
  step: 0.1,
})`
  padding: 0 1rem;
  font-size: ${(props) => props.fontSize || '16px'};
  font-weight: ${(props) => props.fontWeight || ''};
  color: ${(props) => props.color || ''};
  height: 100%;
  min-height: 2rem;
  border: ${(props) => props.border || '1px solid #9cb0b1'};
  width: ${(props) => props.width || 'auto'};
  border-radius: ${(props) => props.borderRadius || '4px'};
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #828282;
  }
`;

export default NumberInput;
