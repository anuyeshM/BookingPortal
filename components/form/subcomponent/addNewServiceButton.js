import React, { useMemo, useState, useEffect } from 'react';
import Button from '../../../elements/button/action';
import { useHistory, useRouteMatch } from 'react-router-dom';

export default function AddNewServiceButton(props) {
  const history = useHistory();
  const { url } = useRouteMatch();
  const [selectedStore, setSelectedStore] = useState({});

  const openServiceAddPage = () => {
    history.push({
      pathname: `${url.replace('details', 'add')}`,
      state: {
        edit: false,
        store: selectedStore
      }
    });
  };

  return (
    <div className="add-new-services">
      <Button
        height="40px"
        gradient="0deg, #61c3de 0%,  #35c17a 0%, #3fd488 50%"
        className="add-service-button"
        fontSize="20px"
        onClick={(e) => openServiceAddPage()}
        width={'230px'}
        margin={'0 1%'}
      >
        <div className="image"></div>
        <div style={{ margin: '5px' }}>Add New Service</div>
      </Button>
    </div>
  );
}
