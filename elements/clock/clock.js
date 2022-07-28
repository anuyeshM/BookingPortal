import React, { useMemo, useState } from 'react';

import Time from 'react-live-clock';
import Util from '../../commons/util';

export default function Clock() {
  const [today] = useState((new Date()));

  return (
    <div className='client-datetime'>
      <div className='date-day'>
        <div className='day'>
          { Util.dateFormat(today, 'ddd - ') }
        </div>
        <div className='date'>
          { Util.dateFormat(today, 'DD MMM, YYYY') }
        </div>
      </div>
      <Time format={'HH:mm:ss'} ticking={true} date={null}/>
    </div>
  )
}