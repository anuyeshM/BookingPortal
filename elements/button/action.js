import styled from 'styled-components';

const ActionButton = styled.button`
  margin: ${(props) => props.margin || '0 5%'};
  height: ${(props) => props.height || '30px'};
  margin-top: ${(props) => props.top || ''};
  font-weight: ${(props) => props.fontWeight || 'bold'};
  border-radius: 4px;
  background-image: linear-gradient(${(props) => props.gradient || ''});
  border: none;
  cursor: pointer;
  background-color: ${(props) => props.bgColor || '#6fbf84'};
  width: ${(props) => props.width || '90%'};
  font-size: ${(props) => props.fontSize || '14px'};
  color: ${(props) => props.fontColor || '#ffffff'};

  &:focus {
    outline: none;
  }
`;

export default ActionButton;
