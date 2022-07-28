import styled from 'styled-components';
const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5%;
  height: 2rem;
  font-weight: 600;
  background-color: #364984;
  background-image: linear-gradient(0deg, #61c3de 0%, #25325a 0%, #3d5396 50%);
  border: none;
  cursor: pointer;
  border-radius: 4pt;
  width: ${(props) => props.width || '90%'};
  font-size: ${(props) => props.fontSize || '14px'};
  color: ${(props) => props.fontColor || '#000'};
  &:focus {
    outline: none;
  }
`;
export default PrimaryButton;
