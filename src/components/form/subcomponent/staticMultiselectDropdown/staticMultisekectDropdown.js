import React from 'react';
import Select from 'react-select';

import './staticMultisekectDropdown.css';

export default function StaticMultiselectDropdown(props) {
  const valueChangeEvent = (e) => {
    props.valueSetter && props.valueSetter(e);
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      background: '#ffffff',
      borderColor: '#25325a',
      padding: '2px'
    }),
    singleValue: (base) => ({
      ...base,
      color: '#25325a',
      fontSize: '14px',
      fontWeight: '600'
    })
  };
  return (
    <div className="static-multi-dropdown-container" style={{ width: props.width || null, flexDirection: props.inline ? 'row' : 'column' || null }}>
      <div className={props.required ? "display-text required" : "display-text"} style={{ lineHeight: props.lineHeight, textAlign: 'center', width: props.textWidth, display: props.inline ? 'inline' : 'flex' || null }}>
        {props.title}
      </div>
      <div className="static-multi-dropdown">
        <Select
          placeholder={props.placeholder ? props.placeholder : 'Select Value...'}
          isSearchable={true}
          value={props.selectedValue}
          onChange={valueChangeEvent}
          options={props.valueList}
          styles={customStyles}
          className={props.disabledValue ? 'disabled' : ''}
          disabled={props.disabledValue}
          isMulti={true}
        />
      </div>
    </div>
  );
}
