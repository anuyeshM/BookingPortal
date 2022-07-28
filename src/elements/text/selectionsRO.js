import styled from 'styled-components';

const SelectedItemsRO = styled.div
`
  float: left;
  margin: 0 5px;
  padding: 0 10px;
  width: auto;
  height: 30px;
  line-height: 30px;
  font-weight: bold;
  background-color: #ddd;
  border-radius: 5px;
  cursor: pointer;
  font-size: ${props => props.fontSize || '13px' };
`

export default SelectedItemsRO;