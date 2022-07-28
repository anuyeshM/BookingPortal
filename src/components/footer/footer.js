import React, { useState } from 'react';

import './footer.css'

export default function Footer() {
  const [today] = useState((new Date()));

  return (
    <div className='footer'>
      {
        `Copyright @ 2006-${today.getFullYear()} Graymatter Software Services Pvt. Ltd. All rights reserved.`
      }
    </div>
  );
}