import styled from 'styled-components';

const EmailInput = styled.input.attrs({ 
  type: 'email',
  pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
})
`
    padding: 0 1rem;
    height: 100%;
    min-height: 2rem;
    border: 1px solid #9CB0B1;
    width: ${props => props.width || 'auto'};
    border-radius: ${props => props.borderRadius || "5px" };
    &:focus {
        outline: none;
    }
    &::placeholder {
        color: #828282;
    }
`

export default EmailInput;