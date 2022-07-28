import React, { useEffect } from 'react';

export default function OrderFilter(props) {
  return (
    <div className="service-filter">
      <OrderCard
        color={'#0098e1'}
        title={'Total Services'}
        count={props.filterCount.All}
        borderColor={'#0098e1'}
        selectedOrderType={props.selectedOrderType}
        setSelectedOrderType={props.setSelectedOrderType}
      />
      <OrderCard
        color={'#e7a632'}
        title={'New Services'}
        count={props.filterCount.New}
        borderColor={'#e7a83b'}
        selectedOrderType={props.selectedOrderType}
        setSelectedOrderType={props.setSelectedOrderType}
      />
      <OrderCard
        color={'#48aca0'}
        title={'In Progress Services'}
        count={props.filterCount.Progress}
        borderColor={'#48aca0'}
        selectedOrderType={props.selectedOrderType}
        setSelectedOrderType={props.setSelectedOrderType}
      />
      <OrderCard
        color={'#888888'}
        title={'Closed Services'}
        count={props.filterCount.Closed}
        borderColor={'#888888'}
        selectedOrderType={props.selectedOrderType}
        setSelectedOrderType={props.setSelectedOrderType}
      />
    </div>
  );
}

function OrderCard(props) {
  function handleOnClick() {
    props.setSelectedOrderType(props.title);
  }
  return (
    <div
      className="service-container"
      onClick={() => handleOnClick()}
      style={{
        borderWidth: props.title === props.selectedOrderType ? '1.5pt' : null,
        backgroundColor: props.color,
        borderColor: props.borderColor,
        backgroundClip: props.title === props.selectedOrderType ? 'content-box' : null,
        boxShadow: props.title === props.selectedOrderType ? '0 5px 5px 0 #727475' : ''
      }}
    >
      <div className="service-type-title">{props.title}</div>
      <div className="service-type-count">{props.count}</div>
    </div>
  );
}
