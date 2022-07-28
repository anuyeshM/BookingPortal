import React, { useEffect, useRef, useState } from 'react';

export default function DropBox(props) {
  const [fileName, setFileName] = useState('');
  let fileInput = useRef();

  const dragOverEvent = (e) => {
    fileInput.value = '';
    setFileName('');
    e.preventDefault();
  };

  const fileDropEvent = (e) => {
    console.log('Dropped -> ', e.dataTransfer.files);
    0 < e.dataTransfer.files.length &&
      setFileName(e.dataTransfer.files[0].name);
    0 < e.dataTransfer.files.length &&
      props.setFile &&
      props.setFile(e.dataTransfer.files[0]);
    e.preventDefault();
  };

  const fileChangeEvent = (e) => {
    0 < e.target.files.length && setFileName(e.target.files[0].name);
    0 < e.target.files.length &&
      props.setFile &&
      props.setFile(e.target.files[0]);
    e.preventDefault();
  };

  useEffect(() => {}, [fileName]);

  return (
    <div style={fiStyle.fiContainer}>
      <div style={fiStyle.displayText}>
        Drag and Drop to share file <br></br>
        (Or click here)
        <div style={fiStyle.fileToUpload}>{fileName}</div>
      </div>
      <input
        type='file'
        name='file'
        ref={(fi) => (fileInput = fi)}
        style={fiStyle.input}
        onChange={fileChangeEvent}
        onDragOver={dragOverEvent}
        onDrop={fileDropEvent}
        accept={props.allowedExt ? props.allowedExt.join(',') : '*.*'}
      />
    </div>
  );
}

const fiStyle = {
  fiContainer: {
    position: 'relative',
    margin: 'auto',
    width: '100%',
    height: '80%',
    border: '4px dashed #888',
    borderRadius: '1rem',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  displayText: {
    position: 'absolute',
    margin: '10px auto 0px',
    width: '100%',
    height: '7rem',
    textAlign: 'center',
    color: '#828282',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  input: {
    position: 'absolute',
    marginTop: '-2rem',
    marginLeft: '10px',
    width: '100%',
    height: '100%',
    minHeight: '20rem',
    display: 'block',
    cursor: 'pointer',
    outline: 'none',
  },
  fileToUpload: {
    margin: '0.8rem auto',
    width: '90%',
    height: 'auto',
    fontWeight: 'bold',
    color: '#000',
  },
};
