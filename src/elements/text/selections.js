import styled from 'styled-components';

const SelectedItems = styled.div
`
  float: left;
  margin: 0 5px;
  padding: 0 5px;
  width: auto;
  height: 30px;
  font-weight: bold;
  background-color: #ddd;
  border-radius: 5px;
  cursor: pointer;
  font-size: ${props => props.fontSize || '13px' };
  &:after {
    content: 'X';
    margin-left: 5px;
    line-height: 30px;
  }
`

export default SelectedItems;