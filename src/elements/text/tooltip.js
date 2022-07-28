import styled from 'styled-components';

const Tooltip = styled.div
`
  position: fixed;
  padding: 5px 15px;
  width: auto;
  top: ${props => props.posY || '0px'}; 
  left: ${props => props.posX || '0px'}; 
  color: #fff;
  background-color: #888;
  z-index: 150;
`

export default Tooltip;