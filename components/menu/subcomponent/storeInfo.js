import React, { useEffect, useMemo, useState } from 'react';

import Config from '../../../commons/config';
import PushAlert from '../../../commons/notification';
import CallAPI from '../../../commons/callAPI';

export default function StoreInfo(props) {
  const apiConfig = useMemo(() => Config.api, []);
  const [concessionaireImage, setConcessionaireImage] = useState('');

  useEffect(() => {
    async function loadConcessionaireLogo() {
      let apiResponse = await CallAPI.post(apiConfig.getConcessionaireLogo, {
        userId: props.user.userId,
      }, props.token);
  
      let responseObj = await apiResponse.json();

      if(200 === +responseObj.statusCode && 'success' === responseObj.status) {
        setConcessionaireImage(responseObj.concessionaireLogo || '');

      } else {
        PushAlert.error(responseObj.message || responseObj.status);
      }
    }
    loadConcessionaireLogo();
  }, []);

  return (
    <div className='concessionaire-logo'>
      <img src={concessionaireImage} />
    </div>
  )
}