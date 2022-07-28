import styled from 'styled-components';

const TitleText = styled.div`
  font-weight: ${(props) => props.fontWeight || 'bold'};
  height: ${(props) => props.height || '100%'};
  display: ${(props) => props.display || ''};
  width: ${(props) => props.width || '100%'};
  font-size: ${(props) => props.fontSize || '14px'};
  text-align: ${(props) => props.textAlign || ''};
  line-height: ${(props) => props.lineHeight || ''};
  margin-left: ${(props) => props.marginLeft || ''};
`;

export default TitleText;
