import styled from 'styled-components';

const LinkText = styled.div`
  float: left;
  width: 10rem;
  height: 100%;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  text-align: ${(props) => props.textAlign || 'right'};

  font-size: ${(props) => props.fontSize || '14px'};
  color: ${(props) => props.fontColor || '#283660'};
`;

export default LinkText;
