import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ObjectID } from 'bson';
import Button from '../../../elements/button/action';
import TextInput from '../../../elements/input/textInput';
import NumberInput from '../../../elements/input/numberInput';
import TextBox from '../../../elements/input/textBox';
import FileInput from '../../../elements/input/fileInput';
import fileUploadConfig from '../../../commons/fileUploadConfig';
import Util from '../../../commons/util';
import { useHistory } from 'react-router-dom';
import PushAlert from '../../../commons/notification';
import CallAPI from '../../../commons/callAPI';
import Config from '../../../commons/config';
import StaticDropdown from './staticDropdown/staticDropdown';
import StaticMultiselectDropdown from './staticMultiselectDropdown/staticMultisekectDropdown';
import Status from './status';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import '../../form/addEditService.css';
let renderedOnce = false;

export default function AddEditCategoryForm(props) {
  let editData = {};
  const history = useHistory();

  if (props.location && !props.location.state) {
    history.goBack();
    return null;
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const authToken = props.token;
  const [isEdit] = useState(props.location.state.edit);
  if (isEdit) editData = props.location.state.data;

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [mergeMessage, setMergeMessage] = useState('');
  const [mergeData, setMergeData] = useState();

  const imageExt = useMemo(() => fileUploadConfig.image, []);
  const maxImageSize = useMemo(() => fileUploadConfig.maxImageSize, []);
  const maxImageDimensions = useMemo(() => fileUploadConfig.maxImageDimensions, []);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [galleryImages, setGalleryImages] = useState();
  const galleryImagesRef = useRef([]);
  const apiConfig = useMemo(() => Config.api, []);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [galleryImageList, setGalleryImageList] = useState([]);
  const [galleryImageNameList, setGalleryImageNameList] = useState([]);
  const [galleryImageSizeList, setGalleryImageSizeList] = useState([]);
  const [originalGalleryImageList, setOriginalGalleryImageList] = useState([]);
  const [deleteGalleryImage, setDeleteGalleryImage] = useState([]);
  const [duplicateGalleryImages, setDuplicateGalleryImages] = useState([]);
  const [movementList, setMovementList] = useState(Config.movementType);
  const [selectedMovementType, setMovementType] = useState();
  const [sectorList, setsectorList] = useState(Config.sectorType);
  const [selectedSector, setSector] = useState();
  const [movementTypeDisabled, setMovementTypeDisabled] = useState(false);
  const [sectorDisabled, setSectorDisabled] = useState(false);
  const [inputFieldsList, setInputFieldsList] = useState([]);
  const [selectedInputField, setSelectedInputField] = useState([]);
  const [isActive, setIsActive] = useState(true);

  const [serviceImage, setServiceImage] = useState();
  const serviceImageRef = useRef([]);
  const [serviceImageList, setServiceImageList] = useState([]);
  const [serviceImageNameList, setServiceImageNameList] = useState([]);
  const [serviceImageSizeList, setServiceImageSizeList] = useState([]);
  const [originalServiceImageList, setOriginalServiceImageList] = useState([]);
  const [deleteServiceImage, setDeleteServiceImage] = useState([]);
  const [isImageDimesionAllowed, setIsImageDimesionAllowed] = useState(true);

  function getModalStyle() {
    return {
      top: `50%`,
      left: `50%`,
      transform: `translate(-50%, -50%)`,
    };
  }
  
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    if (serviceImage) {
      const referenceObj = serviceImageRef.current.find((r) => r.name === serviceImage.name);
      referenceObj && referenceObj.ref && Util.renderImage({ current: referenceObj.ref }, serviceImage);
    }
  }, [serviceImage, serviceImageRef, serviceImageList, serviceImageNameList, originalServiceImageList]);

  function handleParentServiceSubmit() {
    const servImageRef = serviceImageRef.current.filter((o) => o && o.ref);
    let exceedsImageSize = false;
    if (!title) {
      return PushAlert.error('Title is required field');
    }
    if (!desc) {
      return PushAlert.error('Description is required field');
    }
    if(selectedInputField === null && selectedInputField === undefined && selectedInputField.length > 0) {
      return PushAlert.error('Input field is required');
    }
    if(!selectedMovementType) {
      return PushAlert.error('Movement Type field is required');
    }
    if(!selectedSector) {
      return PushAlert.error('Sector field is required');
    }
    // galleryImageSizeList.forEach((x) => {
    //   if(x > 2000) {
    //       exceedsImageSize = true;
    //       return PushAlert.error('Image size is greater that 2MB');
    //     }
    // })
    if(serviceImageSizeList[0] > (maxImageSize * 1000)) {
      exceedsImageSize = true;
      return PushAlert.error('Image size is greater than ' + maxImageSize + 'MB');
    }
    if(!isImageDimesionAllowed) {
      return PushAlert.error('Image dimension does not comply with the given dimension');
    }
    if (
        title 
        && desc 
        // && galleryImageNameList.length > 0 
        && serviceImageNameList.length > 0 
        && selectedInputField !== null 
        && selectedInputField.length > 0
        && selectedMovementType
        && selectedSector
        && isImageDimesionAllowed === true
      ) {
      if(!exceedsImageSize) {
        const id = new ObjectID().toString();
        isEdit ? postUpdateParentService() : postCreateParentService(id);
        getUploadImage(isEdit ? editData._id : id);
      }
    } else {
      if (isEdit) {
        PushAlert.error('Please update all required fields');
      } else {
        PushAlert.error('Please enter all required fields');
      }
    }
  }

  async function getParentServiceDetails() {
    if(props.location.state.selectedCategory)
      setSelectedCategory({ value: props.location.state.selectedCategory._id, label: props.location.state.selectedCategory.categoryName  })
    let serviceId = props.location.state.data._id || '';
    const reqPath = apiConfig.getServiceById.replace('{{serviceId}}', serviceId);
    let apiResponse = await CallAPI.get(
      reqPath,
      {},
      authToken || ''
    );

    let responseObj = await apiResponse.json();

    if (200 === +responseObj.statusCode && 'success' === responseObj.status) {
      if(responseObj.data) {

        setGalleryImageNameList(responseObj.data.serviceImageUrlSub);
        setOriginalGalleryImageList(responseObj.data.serviceImageUrlSub);
        setDisabled(true);
        setTitle(responseObj.data.title);
        setDesc(responseObj.data.description);
        setIsActive(responseObj.data.activeFlag);
        setMovementType({ value: responseObj.data.movementType, label: responseObj.data.movementType });
        setSector({ value: responseObj.data.sector, label: responseObj.data.sector });

        setServiceImageList(responseObj.data.serviceImageUrlSub);
        setServiceImageNameList(responseObj.data.serviceImageUrlSub);
        setOriginalServiceImageList(responseObj.data.serviceImageUrlSub);

        let tempInputList = [];
        responseObj.data.qtyDrivenFields.forEach((item) => {
          tempInputList.push({ 
            value: item.id, 
            label: item.frontendLabel, 
            id: item.id, 
            // _id: item._id,
            frontendLabel: item.frontendLabel, 
            backendLabel: item.backendLabel, 
            frontendComponent: item.frontendComponent 
          });
        })
        setSelectedInputField(tempInputList);
      }
    }
  }

  useEffect(() => {
    isEdit && getParentServiceDetails();
  }, []);

  async function postCreateParentService(varientId) {
    let tempInputField = [];
    selectedInputField.forEach((item) => {
      tempInputField.push({ 
        id: item.id, 
        frontendLabel: item.frontendLabel, 
        frontendComponent: item.frontendComponent,  
        backendLabel: item.backendLabel
      })
    });
    let apiResponse = await CallAPI.post(
      apiConfig.saveService,
      {
        _id: varientId,
        title: title.trim(),
        type: 'simple',
        servicename: title.trim(),
        description: desc,
        serviceCategory: selectedCategory.label,
        serviceCategoryId: selectedCategory.value,
        // serviceImageUrlSub: galleryImageNameList,
        serviceImageUrlSub: serviceImageNameList,
        movementType: selectedMovementType.label,
        sector: selectedSector.label,
        qtyDrivenFields: tempInputField,
        activeFlag: isActive
      },
      authToken
    );
    const responseObj = await apiResponse.json();

    if (+responseObj.statusCode === 200 && responseObj.status === 'success') {
      PushAlert.success(responseObj.message || responseObj.status);
      history.goBack();
    } else if(+responseObj.statusCode === 400 && responseObj.status === 'failure') {
      setOpen(true);
      setMergeMessage(responseObj.message);
      setMergeData(responseObj.data);
    }
    else {
      PushAlert.error(responseObj.message || responseObj.status);
    }
  }

  async function postUpdateParentService() {
    let tempInputField = [];
    selectedInputField.forEach((item) => {
      tempInputField.push({ 
        id: item.id, 
        frontendLabel: item.frontendLabel, 
        frontendComponent: item.frontendComponent,  
        backendLabel: item.backendLabel
      })
    });
    let apiResponse = await CallAPI.put(
      apiConfig.updateService,
      {
        _id: editData._id,
        title: title.trim(),
        description: desc,
        type: 'simple',
        servicename: title.trim(),
        serviceCategory: selectedCategory.label,
        serviceCategoryId: selectedCategory.value,
        // serviceImageUrlSub: galleryImageNameList,
        // deleteGalleryImage: deleteGalleryImage.filter((o) => !galleryImageNameList.includes(o)),
        serviceImageUrlSub: serviceImageNameList,
        deleteGalleryImage: deleteServiceImage.filter((o) => !serviceImageNameList.includes(o)),
        movementType: selectedMovementType.label,
        sector: selectedSector.label,
        qtyDrivenFields: tempInputField,
        activeFlag: isActive
      },
      authToken
    );

    const responseObj = await apiResponse.json();

    if (+responseObj.statusCode === 200 && responseObj.status === 'success') {
      PushAlert.success(responseObj.message || responseObj.status);
      history.goBack();
    } else {
      PushAlert.error(responseObj.message || responseObj.status);
    }
  }

  async function getUploadImage(varientId) {
    let apiResponse = await CallAPI.upload(
      apiConfig.uploadImage,
      {
        serviceId: varientId,
        imageType: 'gallery'
      },
      authToken,
      {
        // gallery: galleryImageList
        gallery: serviceImageList
      }
    );

    let responseObj = await apiResponse.json();
  }

  async function handleMerge() {
    let tempInputField = [];
    selectedInputField.forEach((item) => {
      tempInputField.push({ 
        id: item.id, 
        frontendLabel: item.frontendLabel, 
        frontendComponent: item.frontendComponent,  
        backendLabel: item.backendLabel
      })
    });
    const id = new ObjectID().toString();
    let apiResponse = await CallAPI.post(
      apiConfig.mergeService,
      {
        data: mergeData,
        _id: id,
        title: title.trim(),
        description: desc,
        type: 'simple',
        servicename: title.trim(),
        serviceCategory: selectedCategory.label,
        serviceCategoryId: selectedCategory.value,
        // serviceImageUrlSub: galleryImageNameList,
        // deleteGalleryImage: deleteGalleryImage.filter((o) => !galleryImageNameList.includes(o)),
        serviceImageUrlSub: serviceImageNameList,
        deleteGalleryImage: deleteServiceImage.filter((o) => !serviceImageNameList.includes(o)),
        movementType: selectedMovementType.label,
        sector: selectedSector.label,
        qtyDrivenFields: tempInputField,
        activeFlag: isActive
      },
      authToken
    );

    const responseObj = await apiResponse.json();

    if (+responseObj.statusCode === 200 && responseObj.status === 'success') {
      PushAlert.success(responseObj.message || responseObj.status);
      history.goBack();
    } else {
      PushAlert.error(responseObj.message || responseObj.status);
    }
    getUploadImage(id);
  }

  useEffect(() => {
    !isEdit && getCategoryList();
    // !isEdit && getPriceDefinitionList();
    getPriceDefinitionList();
  }, []);

  async function getCategoryList() {
    let apiResponse = await CallAPI.get(apiConfig.listcategory, {}, authToken);
    let responseObj = await apiResponse.json();
    renderedOnce = false;
    console.log('renderedOnce category111 here==', renderedOnce);
    let tempStoreList = [];
    if (responseObj.data) {
      tempStoreList = responseObj.data;
      setCategoryList(tempStoreList);
      if (props.location.state.edit) {
        setSelectedCategory(tempStoreList.find((tsl) => tsl._id == editData.serviceCategoryId));
      } else if(props.location.state.selectedCategory) {
        setSelectedCategory({ value:props.location.state.selectedCategory._id, label: props.location.state.selectedCategory.categoryName });
      } else {
        setSelectedCategory(tempStoreList[0]);
      }
    } else {
      PushAlert.error(responseObj.message || responseObj.status);
    }
    setIsLoading(false);
  }

  async function getPriceDefinitionList() {
    let apiResponse = await CallAPI.get(apiConfig.priceDefinition, {}, authToken);
    let responseObj = await apiResponse.json();
    renderedOnce = false;
    let tempInputList = [];
    if (responseObj.priceDefinition) {
      responseObj.priceDefinition.forEach((item) => {
        tempInputList.push({ 
          value: item.id, 
          label: item.frontendLabel, 
          id: item.id, 
          // _id: item._id, 
          frontendLabel: item.frontendLabel, 
          backendLabel: item.backendLabel, 
          frontendComponent: item.frontendComponent 
        });
      })
      setInputFieldsList(tempInputList);
    } else {
      PushAlert.error(responseObj.message || responseObj.status);
    }
    setIsLoading(false);
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
          let minWidth = maxImageDimensions.serviceImage.maxWidth - (maxImageDimensions.serviceImage.maxWidth * maxImageDimensions.serviceImage.allowedVarition);
          let minHeight = maxImageDimensions.serviceImage.maxHeight - (maxImageDimensions.serviceImage.maxHeight * maxImageDimensions.serviceImage.allowedVarition);

          let maxWidth = maxImageDimensions.serviceImage.maxWidth + (maxImageDimensions.serviceImage.maxWidth * maxImageDimensions.serviceImage.allowedVarition);
          let maxHeight = maxImageDimensions.serviceImage.maxHeight + (maxImageDimensions.serviceImage.maxHeight * maxImageDimensions.serviceImage.allowedVarition);

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

  async function handleServiceImages(e) {
    const file = e.target.files[0];
    const fileSize = file.size / 1000
    try {
      const allowedImageDimensions = await getImageDimesions(file);
      if(allowedImageDimensions && fileSize < (maxImageSize * 1000)) {
        // setCategoryImageNameList((oldArray) => [...oldArray, e.target.files[0].name]);
        setServiceImageNameList([e.target.files[0].name]);
        // setCategoryImageList((oldArray) => [...oldArray, e.target.files[0]]);
        setServiceImageList([e.target.files[0]]);
        // setCategoryImageSizeList((oldArray) => [...oldArray, fileSize]);
        setServiceImageSizeList([fileSize]);
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
    const imageName = [...serviceImageNameList].splice(i, 1)[0];
    const imageSize = [...serviceImageSizeList].splice(i, 1)[0];
    
    if (!originalServiceImageList.includes(imageName)) {
      // setCategoryImage();
      // setCategoryImageList([]);
      // setCategoryImageNameList([]);
      // setCategoryImageSizeList([]);
      // setOriginalCategoryImageList([]);
      // setIsImageDimesionAllowed(true);
      const images = Array.from(serviceImage).filter((img) => img.name !== imageName);
      setServiceImage(images);
      setServiceImageList((oldArray) => oldArray.filter((f) => f.name !== imageName));
      setServiceImageSizeList((oldArray) => oldArray.filter((f) => f.name !== imageSize));
    } else {
      let deleteGalleryClone = [...deleteServiceImage];
      deleteGalleryClone.push(imageName);
      setDeleteServiceImage(deleteGalleryClone);
      setOriginalServiceImageList([...originalServiceImageList].filter((img, index) => index !== i));
    }
    setServiceImageNameList([...serviceImageNameList].filter((img, index) => index !== i));
    setServiceImageSizeList([...serviceImageSizeList].filter((img, index) => index !== i));
    // setCategoryImage();
    //   setCategoryImageList([]);
    //   setCategoryImageNameList([]);
    //   setCategoryImageSizeList([]);
    //   setOriginalCategoryImageList([]);
    //   setIsImageDimesionAllowed(true);
  }

  return (
    <div className="form-add-edit">
      <div className="form-add-edit-header">
        <div className="form-parent-service-header-one">
          <StaticDropdown
            title={'Category'}
            placeholder={'Select Category...'}
            selectedValue={selectedCategory}
            valueSetter={setSelectedCategory}
            valueList={categoryList}
            disabledValue={disabled}
            width="100%"
            textWidth="10rem"
            lineHeight="2rem"
          />
        </div>
      </div>
      <div className="form-add-edit-form">
        <div className="service-detail-form-row">
          <div className="service-detail-form-row-input">
            <div className="title-text required">Title</div>{' '}
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
            <div className="title-text required">Description</div>{' '}
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
          <hr className="dashed-hr" />
          <div className="service-detail-form-row-instructions instructions-prop">
            <div className="title-text">Instructions:</div>{' '}
              <div>
                Accepted image dimension : {maxImageDimensions.serviceImage.maxWidth}px x {maxImageDimensions.serviceImage.maxHeight}px<br />
                Accepted variation from given dimension : &plusmn; {maxImageDimensions.serviceImage.allowedVarition * 100}%<br />
                Accepted maximum file size : Upto {maxImageSize}MB<br />
                Accepted file formats : JPEG, PNG, GIF, SVG<br />
                Upload Type : Single Image
              </div>
          </div>
          <div className="service-detail-form-row-textbox thumbnail-prop">
            <div className="title-text required">Image</div>{' '}
            <FileInput
              multiple={false}
              className="gallery-image-dis"
              allowedExt={imageExt}
              // setFile={(f) => setGalleryImages((o) => [...Array.from(o || []), ...Array.from(f)])}
              setFile={setServiceImage}
              style={'banner'}
              handleFeaturethumbnail={(e) => handleServiceImages(e)}
            />
          </div>
          <div className="service-detail-form-row-textbox gallery-prop">
            <div className="title-text"></div>{' '}
            <div className="gallery-image-display">
              {serviceImageNameList.map((name, i) => (
                <div className="gallery-image">
                  {console.log("Image Name" ,name)}
                  {/* <img
                    ref={(el) => (galleryImagesRef.current[i] = { name, img: el })}
                    src={isEdit && originalGalleryImageList.includes(name) ? `${apiConfig.serviceImg}/${name}` : name}
                    height="95%"
                  /> */}
                  <img
                    ref={(el) => (serviceImageRef.current[i] = { name, ref: el })}
                    src={isEdit && originalServiceImageList.includes(name) ? `${apiConfig.serviceImg}${name}` : name}
                    height="95%"
                  />
                  <div className="gallery-remove-image" onClick={() => removeCategoryImage(i)}></div>
                </div>
              ))}
            </div>
          </div>
          <hr className="dashed-hr" />
          <div className="service-detail-form-row-dropdown">
              <StaticDropdown
                title={'Movement Type'}
                placeholder={'Select Movement Type...'}
                selectedValue={selectedMovementType}
                valueSetter={setMovementType}
                valueList={movementList}
                disabledValue={movementTypeDisabled}
                width="50%"
                textWidth="10rem"
                textColor="#606060"
                lineHeight="2rem"
                required={true}
            />
            <StaticDropdown
              title={'Sector'}
              placeholder={'Select Sector...'}
              selectedValue={selectedSector}
              valueSetter={setSector}
              valueList={sectorList}
              disabledValue={sectorDisabled}
              width="50%"
              textWidth="10rem"
              textColor="#606060"
              lineHeight="2rem"
              required={true}
            />
          </div>
          <hr className="dashed-hr" />
          <div className="service-detail-form-row-dropdown">
              <StaticMultiselectDropdown
                title={'Input Type'}
                placeholder={'Select Input Type...'}
                selectedValue={selectedInputField}
                valueSetter={setSelectedInputField}
                valueList={inputFieldsList}
                width="100%"
                textWidth="9rem"
                textColor="#606060"
                lineHeight="2rem"
                isMulti={true}
                inline={true}
                required={true}
            />
          </div>
          {true ? <hr className="dashed-hr" /> : null}
          {true ? (
            <div className="service-detail-row">
              <div className="title-text">Status</div>
              <div className="status-wrapper">
                <Status isActive={isActive} activeSetter={setIsActive} />
              </div>
            </div>
          ) : null}
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
              onClick={() => handleParentServiceSubmit()}
            >
              {isEdit ? <div className="submit-container-update-image"></div> : <div className="submit-container-image"></div>}
              <div style={{ margin: '5px' }}>{isEdit ? 'Update' : 'Save'}</div>
            </Button>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Warning</h2>
          <p id="simple-modal-description">
          {mergeMessage}
          </p>
          <Button 
            height="40px" 
            fontWeight="600" 
            width="30%" 
            bgColor="#507b36" 
            fontSize="18px" 
            className="submit-container" 
            onClick={() => {
              handleMerge();
              handleClose();
            }}
          >
            <div style={{ margin: '5px', width: "100%" }}>Upgrade</div>
          </Button>
          <Button 
            height="40px" 
            fontWeight="600" 
            width="30%" 
            bgColor="#545f64" 
            fontSize="18px" 
            className="cancel-container" 
            onClick={() => handleClose()}
          >
            <div style={{ margin: '5px', width: "100%" }}>Cancel</div>
          </Button>
        </div>
      </Modal>
    </div>
  );
}
