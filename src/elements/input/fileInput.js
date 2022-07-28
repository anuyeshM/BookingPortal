import React, { useEffect, useRef, useState } from 'react';
import upload from '../../assets/images/upload.png';
export default function FileInput(props) {
  const [fileName, setFileName] = useState(props.filename);
  const [fileNames, setFileNames] = useState([]);
  let fileInput = useRef();

  const fileChangeEvent = (e) => {
    const files = e.target.files;
    if (props.multiple) {
      files.length &&
        setFileNames((arr) => {
          for (const file of files) {
            arr.push(file.name);
          }
          return arr;
        });
      files.length && props.setFile && props.setFile(files);
    } else {
      files.length && setFileName(files[0].name);
      files.length && props.setFile && props.setFile(files[0]);
    }
    e.preventDefault();
    props.handleFeaturethumbnail(e);
  };

  useEffect(() => {}, [fileName, fileNames]);

  return (
    <div style={fiStyle.fiContainer} className={props.className}>
      <div style={fiStyle.displayText}>
        {/* {!fileName && !props.filename ? <div style={fiStyle.bannerPlaceholder}>Choose An Image</div> : null} */}
        {true ? <div style={fiStyle.bannerPlaceholder}>Choose An Image</div> : null}
        {props.isMultiselect ? (
          fileNames.forEach((name) => {
            name ? <div style={fiStyle.fileToUpload}>{name}</div> : <div style={fiStyle.fileToUpload}>{name}</div>;
          })
        ) : fileName ? (
          // <div style={fiStyle.fileToUpload}>{fileName}</div>
          <div style={fiStyle.fileToUpload}></div>
        ) : (
          // <div style={fiStyle.fileToUpload}>{fileName || props.filename}</div>
          <div style={fiStyle.fileToUpload}></div>
        )}
        <div style={fiStyle.check}>
          <img width="70%" src={upload} />
        </div>
      </div>
      <input
        type="file"
        name="file"
        ref={(fi) => (fileInput = fi)}
        style={fiStyle.input}
        onChange={fileChangeEvent}
        accept={props.allowedExt ? props.allowedExt.join(',') : '*.*'}
        multiple={props.multiple}
      />
    </div>
  );
}

const fiStyle = {
  fiContainer: {
    position: 'relative',
    width: '65%',
    height: '100%',
    border: '1px solid #bebebe',
    borderRadius: '3pt',
    backgroundColor: '#fff',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  displayText: {
    position: 'absolute',
    textAlign: 'center',
    color: '#828282',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
  },
  check: {
    position: 'absolute',
    bottom: '10px'
  },
  input: {
    position: 'absolute',
    marginTop: '-2rem',
    marginLeft: '10px',
    width: 'calc(20rem - 20px)',
    height: '10rem',
    display: 'block',
    cursor: 'pointer',
    outline: 'none'
  },
  fileToUpload: {
    fontWeight: 'bold',
    color: '#000'
  },
  bannerPlaceholder: {}
};
