import styled from 'styled-components';

const PrimaryAuth = styled.button`
  margin: 0 -10%;
  background-color: transparent;
  height: 2rem;
  font-weight: 600;
 
  border: none;
  cursor: pointer;
  border-radius: 4pt;

  width: ${(props) => props.width || '1%'};
  font-size: ${(props) => props.fontSize || '8px'};
  color: ${(props) => props.fontColor || '#000'};
  

  &:focus {
    outline: none;
  }
`;

export default PrimaryAuth;
