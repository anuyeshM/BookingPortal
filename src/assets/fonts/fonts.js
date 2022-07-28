import { createGlobalStyle } from 'styled-components';

/*
NOTE - By default font is Regular
To use Semi-bold give font-weight:600;
to use bold give font-weight:'bold' of '700';
*/
import Malayalam from './MalayalamMN.woff';
import MalayalamBold from './MalayalamMN-Bold.woff';
import OpenSansBold from './OpenSans-Bold.woff2';
import OpenSansRegular from './OpenSans-Regular.woff2';
import OpenSansSemiBold from './OpenSans-SemiBold.woff2';
import OpenSansBoldTTF from './OpenSans-Bold.ttf';
import OpenSansRegularTTF from './OpenSans-Regular.ttf';
import OpenSansSemiBoldTTF from './OpenSans-SemiBold.ttf';

export default createGlobalStyle`
@font-face {
  font-family: 'GMSP';
     src: url(${OpenSansRegular}) format('woff2'),
     url(${OpenSansRegularTTF}) format('truetype');          
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'GMSP';
     src: url(${OpenSansSemiBold}) format('woff2'),
          url(${OpenSansSemiBoldTTF}) format('truetype');
  font-weight: 600;
  font-style: normal;
}
@font-face {
  font-family: 'GMSP';
     src: url(${OpenSansBold}) format('woff2'),
          url(${OpenSansBoldTTF}) format('truetype');
  font-weight: bold;
  font-style: normal;
}
`;
