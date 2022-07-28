import moment from 'moment';
import Config from './config';

const Util = {
  getUniqueArray(arr) {
    const asSet = new Set(arr);
    return Array.from(asSet);
  },
  renderImage(imageRef, image) {
    let reader = new FileReader();
    reader.onload = function (e) {
      imageRef.current.src = e.target.result || '';
    };
    reader.readAsDataURL(image);
  },
  dateFormat(date, format = Config.date.displayFormat) {
    return moment(date).format(format);
  },
  downloadFileFromBlob(fileBlob, filename = 'ERR-File') {
    let successFlag = false;

    try {
      let url = window.URL.createObjectURL(fileBlob);
      let a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      successFlag = true;
    } catch (e) {
      console.log('Error in converting blob to file => ', e);
      throw Error;
    }

    return successFlag;
  },
};

export default Util;
