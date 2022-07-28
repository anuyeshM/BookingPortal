import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ObjectID } from 'bson';
import Button from '../../../elements/button/action';
import TextInput from '../../../elements/input/textInput';
import TextBox from '../../../elements/input/textBox';
import FileInput from '../../../elements/input/fileInput';
import fileUploadConfig from '../../../commons/fileUploadConfig';
import Util from '../../../commons/util';
import { useHistory } from 'react-router-dom';
import PushAlert from '../../../commons/notification';
import CallAPI from '../../../commons/callAPI';
import Config from '../../../commons/config';
import Status from './status';

import '../../form/addEditService.css';

export default function AddEditCategoryForm(props) {
  let editData = {};
  const history = useHistory();

  if (props.location && !props.location.state) {
    history.goBack();
    return null;
  }

  const authToken = props.token;
  const [isEdit] = useState(props.location.state.edit);
  if (isEdit) editData = props.location.state.data;

  const imageExt = useMemo(() => fileUploadConfig.image, []);
  const maxImageSize = useMemo(() => fileUploadConfig.maxImageSize, []);
  const maxImageDimensions = useMemo(() => fileUploadConfig.maxImageDimensions, []);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [code, setCode] = useState('');
  const [galleryImages, setGalleryImages] = useState();
  const galleryImagesRef = useRef([]);
  const apiConfig = useMemo(() => Config.api, []);
  const [galleryImageList, setGalleryImageList] = useState([]);
  const [galleryImageNameList, setGalleryImageNameList] = useState([]);
  const [galleryImageSizeList, setGalleryImageSizeList] = useState([]);
  const [originalGalleryImageList, setOriginalGalleryImageList] = useState([]);
  const [deleteGalleryImage, setDeleteGalleryImage] = useState([]);
  const [duplicateGalleryImages, setDuplicateGalleryImages] = useState([]);
  const [isActive, setIsActive] = useState(true);

  const [categoryImage, setCategoryImage] = useState();
  const categoryImageRef = useRef([]);
  const [categoryImageList, setCategoryImageList] = useState([]);
  const [categoryImageNameList, setCategoryImageNameList] = useState([]);
  const [categoryImageSizeList, setCategoryImageSizeList] = useState([]);
  const [originalCategoryImageList, setOriginalCategoryImageList] = useState([]);
  const [deleteCategoryImage, setDeleteCategoryImage] = useState([]);
  const [isImageDimesionAllowed, setIsImageDimesionAllowed] = useState(true);

  useEffect(() => {
    if (galleryImages && galleryImages.length) {
      galleryImagesRef.current = galleryImagesRef.current.filter((o) => o.img);
      for (let index = 0; index < galleryImages.length; index++) {
        const ref = galleryImagesRef.current.find((o) => o.name === galleryImages[index].name);
        if (
          galleryImages[index] &&
          ref &&
          ref.img &&
          (!deleteGalleryImage.includes(ref.name) || galleryImageNameList.includes(ref.name)) &&
          !duplicateGalleryImages.includes(galleryImages[index].name)
        ) {
          Util.renderImage(
            {
              current: ref.img
            },
            galleryImages[index]
          );
        }
      }
    }
    setDuplicateGalleryImages([]);
  }, [galleryImages, galleryImagesRef, galleryImageList, galleryImageNameList, originalGalleryImageList]);

  useEffect(() => {
    if (categoryImage) {
      const referenceObj = categoryImageRef.current.find((r) => r.name === categoryImage.name);
      referenceObj && referenceObj.ref && Util.renderImage({ current: referenceObj.ref }, categoryImage);
    }
  }, [categoryImage, categoryImageRef, categoryImageList, categoryImageNameList, originalCategoryImageList]);

  function handleCategorySubmit() {
    const catImageRef = categoryImageRef.current.filter((o) => o && o.ref);
    let exceedsImageSize = false;
    if (!title) {
      return PushAlert.error('Title is required field');
    }
    // if (categoryImageList.length === 0) {
    //   return PushAlert.error('Category image is required field');
    // }
    if(categoryImageSizeList[0] > (maxImageSize * 1000)) {
      exceedsImageSize = true;
      return PushAlert.error('Image size is greater than ' + maxImageSize + 'MB');
    }
    if(!isImageDimesionAllowed) {
      return PushAlert.error('Image dimension does not comply to given dimension');
    }
    if (title && isImageDimesionAllowed) {
      if(!exceedsImageSize)
        isEdit ? updateCategoryDetails() : getUploadImage()
    } else {
      if (isEdit) {
        PushAlert.error('Please update all required fields');
      } else {
        PushAlert.error('Please enter all required fields');
      }
    }
  }

  async function getCategoryDetails() {
    let categoryId = props.location.state.data._id || '';
    const reqPath = apiConfig.getCategoryById.replace('{{categoryId}}', categoryId);
    let apiResponse = await CallAPI.get(
      reqPath,
      {},
      authToken || ''
    );

    let responseObj = await apiResponse.json();

    if (200 === +responseObj.statusCode && 'success' === responseObj.status) {
      if(responseObj.data) {
        let imageArray = [];
        imageArray.push(responseObj.data.imageUrl);

        setTitle(responseObj.data.categoryName);
        setDesc(responseObj.data.description);
        setCode(responseObj.data.categoryCode);
        setGalleryImageNameList(imageArray);
        setCategoryImageNameList(imageArray);
        setOriginalGalleryImageList(imageArray);
        setOriginalCategoryImageList(imageArray);
        setIsActive(responseObj.data.activeFlag);
      }
    }
  }

  useEffect(() => {
    isEdit && getCategoryDetails();
  }, []);

  async function getUploadImage() {
    let apiResponse = await CallAPI.upload(
      apiConfig.categorySaveUpdateService,
      {
        mode: 'create',
        title,
        description: desc,
        activeFlag: isActive
      },
      authToken,
      {
        // gallery: galleryImageList,
        gallery: categoryImageList
      }
    );

    let responseObj = await apiResponse.json();
    if (responseObj.statusCode === 200 && responseObj.status === 'success') {
      PushAlert.success(responseObj.message || responseObj.status);
      history.goBack();
    } else {
      PushAlert.error(responseObj.message || responseObj.status);
    }
  }

  async function updateCategoryDetails() {
    let apiResponse = await CallAPI.put(
      apiConfig.updateCategory,
      {
        id: props.location.state.data._id || '',
        title,
        description: desc,
        // gallery: galleryImageList,
        gallery: categoryImageNameList,
        activeFlag: isActive
      },
      authToken,
    );

    let responseObj = await apiResponse.json();
    if (responseObj.statusCode === 200 && responseObj.status === 'success') {
      PushAlert.success(responseObj.message || responseObj.status);
      history.goBack();
    } else {
      PushAlert.error(responseObj.message || responseObj.status);
    }
  }

  function handleCancel() {
    history.goBack();
  }

  function handleGalleryImages(e) {
    for (let index = 0; index < e.target.files.length; index++) {
      const file = e.target.files[index];
      const fileSize = file.size / 1000 
      if (!galleryImageNameList.includes(file.name)) {
        setGalleryImageNameList((oldArray) => [...oldArray, file.name]);
        setGalleryImageList((oldArray) => [...oldArray, file]);
        setGalleryImageSizeList((oldArray) => [...oldArray, fileSize]);
      } else {
        setDuplicateGalleryImages((o) => [...o, file.name]);
        PushAlert.error('Duplicate image "' + file.name + '"is not allowed');
        console.log('SAME IMAGE NAME CONFLICT::::Please delete the image with this same name first:::', file.name);
      }
    }
  }

  function getImageDimesions(file) {
    let temp;
    var reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function (e) {
        var img = new Image;
        img.onload = function() {
          let minWidth = maxImageDimensions.categoryImage.maxWidth - (maxImageDimensions.categoryImage.maxWidth * maxImageDimensions.categoryImage.allowedVarition);
          let minHeight = maxImageDimensions.categoryImage.maxHeight - (maxImageDimensions.categoryImage.maxHeight * maxImageDimensions.categoryImage.allowedVarition);

          let maxWidth = maxImageDimensions.categoryImage.maxWidth + (maxImageDimensions.categoryImage.maxWidth * maxImageDimensions.categoryImage.allowedVarition);
          let maxHeight = maxImageDimensions.categoryImage.maxHeight + (maxImageDimensions.categoryImage.maxHeight * maxImageDimensions.categoryImage.allowedVarition);

          // console.log("Min Width", minWidth);
          // console.log("Max Width", maxWidth);

          // console.log("Min Height", minHeight);
          // console.log("Max Height", maxHeight);

          // console.log("Image Width", img.width);
          // console.log("Image Height", img.height);

          if((img.width < minWidth || img.width > maxWidth) || (img.height < minHeight || img.height > maxHeight)) { 
            temp = false;
          } else {
            temp = true;
          }
          resolve(temp);
        };
        img.src = reader.result; 
      };
      reader.readAsDataURL(file);
    });
  }


  async function handleCategoryImages(e) {
    const file = e.target.files[0];
    const fileSize = file.size / 1000
    try {
      const allowedImageDimensions = await getImageDimesions(file);
      if(allowedImageDimensions && fileSize < (maxImageSize * 1000)) {
        // setCategoryImageNameList((oldArray) => [...oldArray, e.target.files[0].name]);
        setCategoryImageNameList([e.target.files[0].name]);
        // setCategoryImageList((oldArray) => [...oldArray, e.target.files[0]]);
        setCategoryImageList([e.target.files[0]]);
        // setCategoryImageSizeList((oldArray) => [...oldArray, fileSize]);
        // setCategoryImageSizeList([fileSize]);
        // setIsImageDimesionAllowed(true);
      } else {
          if(!allowedImageDimensions)
            PushAlert.error(`${file.name} dimension does not comply to given dimension`);
          if(fileSize > (maxImageSize * 1000))
            PushAlert.error(`${file.name} size is greater than ${maxImageSize}MB`);
      }
    } catch(e) {
      console.log(e);
    }
  }

  function removeGalleryImage(i) {
    const imageName = [...galleryImageNameList].splice(i, 1)[0];
    const imageSize = [...galleryImageSizeList].splice(i, 1)[0];
    
    if (!originalGalleryImageList.includes(imageName)) {
      const images = Array.from(galleryImages).filter((img) => img.name !== imageName);
      setGalleryImages(images);
      setGalleryImageList((oldArray) => oldArray.filter((f) => f.name !== imageName));
      setGalleryImageSizeList((oldArray) => oldArray.filter((f) => f.name !== imageSize));
    } else {
      let deleteGalleryClone = [...deleteGalleryImage];
      deleteGalleryClone.push(imageName);
      setDeleteGalleryImage(deleteGalleryClone);
      setOriginalGalleryImageList([...originalGalleryImageList].filter((img, index) => index !== i));
    }
    setGalleryImageNameList([...galleryImageNameList].filter((img, index) => index !== i));
    setGalleryImageSizeList([...galleryImageSizeList].filter((img, index) => index !== i));
  }

  function removeCategoryImage(i) {
    const imageName = [...categoryImageNameList].splice(i, 1)[0];
    const imageSize = [...galleryImageSizeList].splice(i, 1)[0];
    
    if (!originalCategoryImageList.includes(imageName)) {
      // setCategoryImage();
      // setCategoryImageList([]);
      // setCategoryImageNameList([]);
      // setCategoryImageSizeList([]);
      // setOriginalCategoryImageList([]);
      // setIsImageDimesionAllowed(true);
      const images = Array.from(categoryImage).filter((img) => img.name !== imageName);
      setCategoryImage(images);
      setCategoryImageList((oldArray) => oldArray.filter((f) => f.name !== imageName));
      setCategoryImageSizeList((oldArray) => oldArray.filter((f) => f.name !== imageSize));
    } else {
      let deleteGalleryClone = [...deleteCategoryImage];
      deleteGalleryClone.push(imageName);
      setDeleteCategoryImage(deleteGalleryClone);
      setOriginalCategoryImageList([...originalCategoryImageList].filter((img, index) => index !== i));
    }
    setCategoryImageNameList([...categoryImageNameList].filter((img, index) => index !== i));
    setCategoryImageSizeList([...galleryImageSizeList].filter((img, index) => index !== i));
    // setCategoryImage();
    //   setCategoryImageList([]);
    //   setCategoryImageNameList([]);
    //   setCategoryImageSizeList([]);
    //   setOriginalCategoryImageList([]);
    //   setIsImageDimesionAllowed(true);
  }

  return (
    <div className="form-add-edit">
      <div className="form-add-edit-form category-add-edit">
        <div className="service-category-form-row">
          <div className="service-detail-form-row-textbox">
            <div className="title-text required">Name</div>{' '}
            <TextInput
              fontWeight="500"
              fontSize="16px"
              color={'#151515'}
              borderRadius={'4px'}
              border={'1px solid #bebebe'}
              width={'82.5%'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-highlight"
            />
          </div>
          <hr className="dashed-hr" />
          <div className="service-detail-form-row-textbox">
            <div className="title-text">Description</div>{' '}
            <TextBox
              fontWeight="500"
              color={'#151515'}
              borderRadius={'4px'}
              border={'1px solid #bebebe'}
              style={{
                width: '82.5%',
                height: '100px',
                textAlign: 'initial',
                fontSize: '16px'
              }}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="input-highlight"
            />
          </div>
          {/* <hr className="dashed-hr" />
          <div className="service-detail-form-row-textbox">
            <div className="title-text required">Code</div>{' '}
            <TextInput
              fontWeight="500"
              fontSize="16px"
              color={'#151515'}
              borderRadius={'4px'}
              border={'1px solid #bebebe'}
              width={'82.5%'}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input-highlight"
            />
          </div> */}
          <hr className="dashed-hr" />
          <div className="service-detail-form-row-instructions instructions-prop">
            <div className="title-text">Instructions:</div>{' '}
              <div>
                Accepted image dimension : {maxImageDimensions.categoryImage.maxWidth}px x {maxImageDimensions.categoryImage.maxHeight}px<br />
                Accepted variation from given dimension: &plusmn; {maxImageDimensions.categoryImage.allowedVarition * 100}%<br />
                Accepted maximum file size : Upto {maxImageSize}MB<br />
                Accepted file format : JPEG, PNG, GIF, SVG<br />
                Upload Type : Single Image
              </div>
          </div>
          <div className="service-detail-form-row-textbox thumbnail-prop">
            <div className="title-text">Image</div>{' '}
            <FileInput
              multiple={false}
              className="gallery-image-dis"
              allowedExt={imageExt}
              // setFile={(f) => setGalleryImages((o) => [...Array.from(o || []), ...Array.from(f)])}
              setFile={setCategoryImage}
              style={'banner'}
              // handleFeaturethumbnail={(e) => handleGalleryImages(e)}
              handleFeaturethumbnail={(e) => handleCategoryImages(e)}
            />
          </div>
          <div className="service-detail-form-row-textbox gallery-prop">
            <div className="title-text"></div>{' '}
            <div className="gallery-image-display">
              {categoryImageNameList.map((name, i) => (
                <div className="gallery-image">
                  {console.log("Image Name" ,name)}
                    {/* <img
                    ref={(el) => (galleryImagesRef.current[i] = { name, img: el })}
                    src={isEdit && originalGalleryImageList.includes(name) ? `${apiConfig.categoryImg}/${name}` : name}
                    height="95%"
                  /> */}
                    <img
                      ref={(el) => (categoryImageRef.current[i] = { name, ref: el })}
                      src={isEdit && originalCategoryImageList.includes(name) ? `${apiConfig.categoryImg}/${name}` : name}
                      height="95%"
                    />
                    <div className="gallery-remove-image" onClick={() => removeCategoryImage(i)}></div>
                </div>
              ))}
            </div>
          </div>
          <hr className="dashed-hr" />
          <div className="service-detail-row">
            <div className="title-text">Status</div>
            <div className="status-wrapper">
              <Status isActive={isActive} activeSetter={setIsActive} />
            </div>
          </div>
          <div className="banner-footer-row">
            <Button height="40px" fontWeight="600" bgColor="#545f64" fontSize="18px" className="cancel-container" onClick={() => handleCancel()}>
              <div className="cancel-container-image"></div>
              <div style={{ margin: '5px' }}>Cancel</div>
            </Button>
            <Button
              height="40px"
              fontWeight="600"
              bgColor={isEdit ? '#1694c6' : '#507b36'}
              fontSize="18px"
              className="submit-container"
              onClick={() => handleCategorySubmit()}
            >
              {isEdit ? <div className="submit-container-update-image"></div> : <div className="submit-container-image"></div>}
              <div style={{ margin: '5px' }}>{isEdit ? 'Update' : 'Save'}</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
