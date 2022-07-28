import styled from 'styled-components';

const SubtitleText = styled.div
`
  height: 100%;
  float: ${props => props.float || ''};
  line-height: ${props => props.lineHeight || ''};
  width: ${props => props.width || '100%'};
  font-size: ${props => props.fontSize || "12px" };
  margin: ${props => props.margin || '0'};
  color: ${props => props.color || '#828282'};
  text-align: ${props => props.textAlign || ''};
`

export default SubtitleText;