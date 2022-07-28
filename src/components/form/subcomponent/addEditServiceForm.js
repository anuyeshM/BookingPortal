import React, { useState, useMemo, useRef, useEffect } from 'react';
import { TimePickerInput } from 'react-datetime-range-super-picker';
import 'react-datetime-range-super-picker/dist/index.css';
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
import SubtitleText from '../../../elements/text/subtitle';
import appConfig from '../../../commons/config';
import Status from './status';
import Select from 'react-select';
import Loader from '../../../commons/loader';

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import '../../form/addEditService.css';
let renderedOnce = false;

export default function AddEditServiceForm(props) {
  // console.log(props.location.state); // props.location.state.store._id
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

  const styles = (theme) => ({
    textField: {
      background: '#ffffff',
      borderColor: '#25325a',
      padding: '2px'
    },
    input: {
      color: '#25325a',
      fontSize: '14px',
      fontWeight: '600'
    }
  });

  function getModalStyle() {
    return {
      top: `50%`,
      left: `50%`,
      transform: `translate(-50%, -50%)`,
    };
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
  
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let editData = {};
  const history = useHistory();

  if (props.location && !props.location.state) {
    history.goBack();
    return null;
  }

  const authToken = props.token;
  const [isEdit] = useState(props.location.state.edit);
  if (isEdit) editData = props.location.state.data;

  const [isLoading, setIsLoading] = useState(false);
  const imageExt = useMemo(() => fileUploadConfig.image, []);
  const maxImageSize = useMemo(() => fileUploadConfig.maxImageSize, []);
  const maxImageDimensions = useMemo(() => fileUploadConfig.maxImageDimensions, []);
  const [variant, setVariant] = React.useState(isEdit ? editData.servicename : props.location.state.parentServiceName);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [galleryImages, setGalleryImages] = useState();
  const galleryImagesRef = useRef([]);
  const [features, setFeatures] = useState([{ ...appConfig.features[0] }]);
  const [thumbnail, setThumbnail] = useState();
  const thumbnailImagesRef = useRef([]);
  const [amount, setAmount] = useState(0);
  // const [applicableForList, setApplicableForList] = useState([
  //   {
  //     'value': 'Pax',
  //     'label': 'Pax',
  //   }
  // ]);
  const [applicableForList, setApplicableForList] = useState([]);
  const [applicableFor, setApplicableFor] = useState();
  const [access, setAccess] = useState([]);
  const [skills, setSkills] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selectedAccess, setSelectedAccess] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const apiConfig = useMemo(() => Config.api, []);
  const dateConfig = useMemo(() => Config.date, []);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [selectedService, setSelectedService] = useState({});
  const [days, setDays] = useState(JSON.parse(JSON.stringify(appConfig.daysOfWeek)));
  const [movementTypeDisabled, setMovementTypeDisabled] = useState(
    props.location.state.parentMovementType !== 'All' ? true : false
  );
  const [sectorDisabled, setSectorDisabled] = useState(
    props.location.state.parentSector !== 'All' ? true : false
  );
  const [movementList, setMovementList] = useState([
    {
      value: 'Departure',
      label: 'Departure'
    },
    {
      value: 'Arrival',
      label: 'Arrival'
    }
  ]);
  const [selectedMovementType, setMovementType] = useState(
    props.location.state.movementType.label === 'View All' ? movementList[0] : props.location.state.movementType
    );
  const [sectorList, setsectorList] = useState([
    {
      value: 'International',
      label: 'International'
    },
    {
      value: 'Domestic',
      label: 'Domestic'
    }
  ]);
  const [selectedSector, setSector] = useState(
    props.location.state.sector.label === 'View All' ? sectorList[0] : props.location.state.sector
  );
  const [isActive, setIsActive] = useState(true);
  const [thumbnailList, setThumbnailList] = useState([]);
  const [galleryImageList, setGalleryImageList] = useState([]);
  const [galleryImageNameList, setGalleryImageNameList] = useState([]);
  const [originalGalleryImageList, setOriginalGalleryImageList] = useState([]);
  const [deleteGalleryImage, setDeleteGalleryImage] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [originalThumbnailImageList, setOriginalThumbnailImageList] = useState([]);
  const [duplicateGalleryImages, setDuplicateGalleryImages] = useState([]);
  const [currencyList, setCurrencyList] = useState(appConfig.currencyList);
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [enableFromTimer, setEnableFromTimer] = useState(false);
  const [duplicateVariantList, setDuplicateVariantList] = useState([]);
  const [selectedDuplicateVariant, setSelectedDuplicateVariant] = useState();
  const [duplicateVariantSelected, setDuplicateVariantSelected] = useState(false);
  
  const [variantImageSizeList, setVariantImageSizeList] = useState([]);
  const [isImageDimesionAllowed, setIsImageDimesionAllowed] = useState([]);

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
    if (thumbnail) {
      const referenceObj = thumbnailImagesRef.current.find((r) => r.featureImageUrl === thumbnail.name);
      referenceObj && referenceObj.ref && Util.renderImage({ current: referenceObj.ref }, thumbnail);
    }
  }, [thumbnail, thumbnailImagesRef, features]);

  function handleSubmit() {
    console.log("Dim allowed", isImageDimesionAllowed);
    const thumbnailRefs = thumbnailImagesRef.current.filter((o) => o && o.ref);
    let exceedsImageSize = false;
    let exceedsImageDimensions = false;
    const uniqueNames = new Set(features.map((ft) => ft.featureName));
    if (uniqueNames.size < features.length) {
      return PushAlert.error('Duplicate feature names are not allowed');
    }

    if (!selectedSector) {
      return PushAlert.error('Sector is required field');
    }
    if (!selectedMovementType) {
      return PushAlert.error('Movement Type is required field');
    }
    if (!variant) {
      return PushAlert.error('Variant is required field');
    }
    if (!title) {
      return PushAlert.error('Title is required field');
    }
    if (!desc) {
      return PushAlert.error('Description is required field');
    }
    if (galleryImageNameList.length == 0) {
      return PushAlert.error('Gallery Image is required field');
    }
    variantImageSizeList.forEach((x) => {
      if(x > (maxImageSize * 1000)) {
          exceedsImageSize = true;
          return PushAlert.error('Image size is greater that 2MB');
        }
    });
    isImageDimesionAllowed.forEach((x) => {
      if(x === false) {
        exceedsImageDimensions = true;
          return PushAlert.error('Image dimension does not comply with the given dimension');
        }
    });
    if (thumbnailRefs.length !== features.length) {
      return PushAlert.error('Thumbnail is missing');
    }
    if (!features) {
      return PushAlert.error('features is required field');
    }
    if (!days) {
      return PushAlert.error('Days is required field');
    }
    let haveDay = false;
    for (let dy of days) {
      if (dy.isActive) {
        haveDay = true;
        break;
      }
    }
    if (!haveDay) {
      return PushAlert.error('Days is required field');
    }
    if (!selectedCurrency) {
      return PushAlert.error('Currency is required field');
    }
    if (!amount) {
      return PushAlert.error('Amount is required field');
    }
    if (!applicableFor.label) {
      return PushAlert.error('Applicable For is required field');
    }
    if (!selectedAccess.length > 0) {
      return PushAlert.error('Access is required field');
    }
    if (!selectedSkills.length > 0) {
      return PushAlert.error('Skills is required field');
    }
    if (!selectedAssets.length > 0) {
      return PushAlert.error('Assets is required field');
    }

    if (
      selectedSector &&
      selectedMovementType &&
      variant &&
      title &&
      desc &&
      galleryImageNameList.length > 0 &&
      thumbnailRefs.length === features.length &&
      features &&
      days &&
      selectedCurrency &&
      amount &&
      applicableFor &&
      applicableFor.label &&
      selectedAccess.length > 0 &&
      selectedSkills.length > 0 &&
      selectedAssets.length > 0
    ) {
      if(!exceedsImageSize && !exceedsImageDimensions) {
        const id = new ObjectID().toString();
        isEdit ? postUpdateService() : postCreateService(id);
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

  async function getServiceDetails() {
    setIsLoading(true);
    setVariant(editData.servicename);
    setSector(Config.sectorType.find((tsl) => tsl.value == editData.sector));
    // setSectorDisabled(editData.sector === 'All' ? true : false);
    setMovementType(Config.movementType.find((tsl) => tsl.value == editData.movementType));
    // setMovementTypeDisabled(editData.movementType === 'All' ? true : false);
    setGalleryImageNameList(editData.serviceImageUrlSub);
    setOriginalGalleryImageList(editData.serviceImageUrlSub);
    setFeatures(editData.features);
    setThumbnailList(editData.features.map((f) => f.featureImageUrl));
    setOriginalThumbnailImageList(editData.features.map((f) => f.featureImageUrl));
    setTitle(editData.title);
    setDesc(editData.description);
    let accessData = [];
    for (let i of editData.access) {
      accessData.push({ label: i, value: i });
    }
    setSelectedAccess(accessData);
    let skillsData = [];
    for (let i of editData.skills) {
      skillsData.push({ label: i, value: i });
    }
    setSelectedSkills(skillsData);
    let assetsData = [];
    for (let i of editData.assets) {
      assetsData.push({ label: i, value: i });
    }
    setSelectedAssets(assetsData);
    setAmount(editData.pricing.price);
    setSelectedCurrency(appConfig.currencyList.find((tsl) => tsl.value == editData.pricing.currency));
    // setApplicableFor(editData.pricing.applicableFor);
    setApplicableFor({ value: editData.pricing.applicableFor, label: editData.pricing.applicableFor });
    setDays(editData.operatingHours);
    setIsLoading(false);
  }

  useEffect(() => {
    async function getRequiredSkills() {
      try {
        const requiredSkills = await CallAPI.get(apiConfig.getRequiredSkills, {}, authToken);
        const responseObj = await requiredSkills.json();

        setSkills(responseObj.skills.map((o) => ({ value: o.skill_name, label: o.skill_name })));
        setAccess(responseObj.access.map((o) => ({ value: o.access_name, label: o.access_name })));
        setAssets(responseObj.assets.map((o) => ({ value: o.asset_type_name, label: o.asset_type_name })));
      } catch (err) {
        console.error(err);
        PushAlert.error('Failed to Fetch Required Skills');
      }
    }
    getRequiredSkills();
    getApplicableForList();
    getDuplicateVariantList();
    isEdit && getServiceDetails();
  }, []);

  function getApplicableForList() {
    setIsLoading(true);
    let tempInputList = [];
    props.location.state.parentInputType && props.location.state.parentInputType.forEach((item) => {
      tempInputList.push({ 
        value: item[0]._id, 
        label: item[0].backendLabel, 
        // _id: item[0]._id, 
        id: item[0].id,
        frontendLabel: item[0].frontendLabel, 
        backendLabel: item[0].backendLabel, 
        frontendComponent: item[0].frontendComponent 
      });
      setApplicableForList(tempInputList);
    })
    setIsLoading(false);
  }

  async function postCreateService(varientId) {
    // debugger;
    const save = async () => {
      let tempInputField = [];
      applicableForList.forEach((item) => {
        tempInputField.push({ 
          id: item.id, 
          frontendLabel: item.frontendLabel, 
          frontendComponent: item.frontendComponent,  
          backendLabel: item.backendLabel
        })
      });
      
      let apiResponse = await CallAPI.post(
        apiConfig.saveServiceVariant,
        {
          _id: varientId,
          ancestors: [selectedService._id],
          ancestorsId: selectedService._id,
          title: title.trim(),
          type: 'variant',
          servicename: variant,
          description: desc,
          serviceCategory: selectedCategory.label,
          serviceCategoryId: selectedCategory._id,
          pricing: {
            currency: selectedCurrency.value,
            price: amount,
            applicableFor: applicableFor.label
          },
          sector: selectedSector.label,
          movementType: selectedMovementType.label,
          access: selectedAccess.map((o) => o && o.value),
          skills: selectedSkills.map((o) => o && o.value),
          assets: selectedAssets.map((o) => o && o.value),
          features,
          serviceImageUrlSub: galleryImageNameList,
          operatingHours: days,
          qtyDrivenFields: tempInputField,
          activeFlag: isActive,
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
    };
    const saveWithDuplication = async () => {
      let tempInputField = [];
      applicableForList.forEach((item) => {
        tempInputField.push({ 
          id: item.id, 
          frontendLabel: item.frontendLabel, 
          frontendComponent: item.frontendComponent,  
          backendLabel: item.backendLabel
        })
      });

      let apiResponse = await CallAPI.post(
        apiConfig.saveServiceVariant,
        {
          _id: varientId,
          ancestors: [selectedService._id],
          ancestorsId: selectedService._id,
          title: title.trim(),
          type: 'variant',
          servicename: variant,
          description: desc,
          serviceCategory: selectedCategory.label,
          serviceCategoryId: selectedCategory._id,
          pricing: {
            currency: selectedCurrency.value,
            price: amount,
            applicableFor: applicableFor.label
          },
          sector: selectedSector.label,
          movementType: selectedMovementType.label,
          access: selectedAccess.map((o) => o && o.value),
          skills: selectedSkills.map((o) => o && o.value),
          assets: selectedAssets.map((o) => o && o.value),
          features,
          serviceImageUrlSub: galleryImageNameList,
          operatingHours: days,
          qtyDrivenFields: tempInputField,
          activeFlag: isActive,
          duplicatedId: selectedDuplicateVariant ? selectedDuplicateVariant.value : null,
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
    };
    selectedDuplicateVariant ? saveWithDuplication() : save();
  }

  async function postUpdateService() {
    let tempInputField = [];
    applicableForList.forEach((item) => {
      tempInputField.push({ 
        id: item.id, 
        frontendLabel: item.frontendLabel, 
        frontendComponent: item.frontendComponent,  
        backendLabel: item.backendLabel
      })
    });

    let apiResponse = await CallAPI.put(
      apiConfig.updateServiceVariant,
      {
        _id: editData._id,
        ancestors: [selectedService._id],
        ancestorsId: selectedService._id,
        title: title.trim(),
        type: 'variant',
        servicename: variant,
        description: desc,
        serviceCategory: selectedCategory.label,
        serviceCategoryId: selectedCategory._id,
        pricing: {
          currency: selectedCurrency.value,
          price: amount,
          applicableFor: applicableFor.label, 
        },
        sector: selectedSector.label,
        movementType: selectedMovementType.label,
        access: selectedAccess.map((o) => o && o.value),
        skills: selectedSkills.map((o) => o && o.value),
        assets: selectedAssets.map((o) => o && o.value),
        features,
        serviceImageUrlSub: galleryImageNameList,
        operatingHours: days,
        qtyDrivenFields: tempInputField,
        deleteGalleryImage: deleteGalleryImage.filter((o) => !galleryImageNameList.includes(o)),
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
        servicename: variant,
        imageType: 'gallery'
      },
      authToken,
      {
        gallery: galleryImageList,
        thumbnails: thumbnailList
      }
    );

    let responseObj = await apiResponse.json();
  }

  useEffect(() => {
    let filterService = categoryList.find((ctl) => ctl._id == selectedCategory.value);
    let serviceData = filterService ? filterService.serviceData : [];
    const servicename = window.sessionStorage.getItem('servicename');

    setServiceList(serviceData);
    if (props.location.state.edit) {
      setSelectedService(serviceData.find((tsl) => tsl.value == editData.ancestorsId));
    } else if (servicename && serviceData.find((tsl) => tsl.value == servicename)) {
      setSelectedService(serviceData.find((tsl) => tsl.value == servicename));
    } else {
      setSelectedService(serviceData[0]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    async function getCategoryList() {
      let apiResponse = await CallAPI.get(apiConfig.listServiceByCategory, {}, authToken);
      let responseObj = await apiResponse.json();
      renderedOnce = false;
      let tempStoreList = [];
      if (responseObj.data) {
        tempStoreList = responseObj.data;
        setCategoryList(tempStoreList);
        if (props.location.state.edit) {
          setSelectedCategory(tempStoreList.find((tsl) => tsl._id == editData.serviceCategoryId));
        } else if (window.sessionStorage.getItem('categoryId')) {
          const categoryId = window.sessionStorage.getItem('categoryId');
          setSelectedCategory(tempStoreList.find((tsl) => tsl._id == categoryId));
        } else {
          setSelectedCategory(tempStoreList[0]);
        }
      } else {
        PushAlert.error(responseObj.message || responseObj.status);
      }
      setIsLoading(false);
    }
    getCategoryList();
  }, []);

  function handleCancel() {
    history.goBack();
  }

  function handleDays(i) {
    let dy = Object.assign([], days);
    dy[i].isActive = !dy[i].isActive;
    setDays(dy);
  }

  function handleStartTime(i, value) {
    let dy = Object.assign([], days);
    dy[i].startHour = value[0];
    dy[i].startMin = value[1];
    setDays(dy);
  }

  function handleEndTime(i, value) {
    let dy = Object.assign([], days);
    dy[i].endHour = value[0];
    dy[i].endMin = value[1];
    setDays(dy);
  }

  function handleFeatureName(i, value) {
    let feature = Object.assign([], features);
    feature[i].featureName = value;
    setFeatures(feature);
  }

  function handleFeatureDesc(i, value) {
    let feature = Object.assign([], features);
    feature[i].featureDesc = value;
    setFeatures(feature);
  }

  function removeFeatures(i) {
    const featuresNew = Object.assign([], features);
    const removedFeature = featuresNew.splice(i, 1);
    thumbnailImagesRef.current.splice(i, 1);
    setThumbnailList((oldArray) => oldArray.filter((f) => f.name !== removedFeature.featureImageUrl));
    setFeatures(featuresNew);
  }

  function appendFeatures(i) {
    let feature = Object.assign([], features);
    feature.push({ ...appConfig.features[0] });
    setFeatures(feature);
  }

  async function handleFeaturethumbnail(i, e) {
    if (!e.target.files || !e.target.files.length) return;
    const file = e.target.files[0];
    const fileSize = file.size / 1000;
    const allowedImageDimensions = await getThumbnailImageDimesions(file);
    if(allowedImageDimensions && fileSize < (maxImageSize * 1000)) {
      let feature = Object.assign([], features);
      feature[i].featureImageUrl = file.name;
      setFeatures(feature);
      setThumbnailList((oldArray) => [...oldArray, file]);
    } else {
      if(!allowedImageDimensions)
        PushAlert.error(`${file.name} dimension does not comply to given dimension`);
      if(fileSize > (maxImageSize * 1000))
        PushAlert.error(`${file.name} size is greater than ${maxImageSize}MB`);
    }
  }

  function getThumbnailImageDimesions(file) {
    let temp;
    var reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function (e) {
        var img = new Image;
        img.onload = function() {
          let minWidth = maxImageDimensions.variantThumbnail.maxWidth - (maxImageDimensions.variantThumbnail.maxWidth * maxImageDimensions.variantThumbnail.allowedVarition);
          let minHeight = maxImageDimensions.variantThumbnail.maxHeight - (maxImageDimensions.variantThumbnail.maxHeight * maxImageDimensions.variantThumbnail.allowedVarition);

          let maxWidth = maxImageDimensions.variantThumbnail.maxWidth + (maxImageDimensions.variantThumbnail.maxWidth * maxImageDimensions.variantThumbnail.allowedVarition);
          let maxHeight = maxImageDimensions.variantThumbnail.maxHeight + (maxImageDimensions.variantThumbnail.maxHeight * maxImageDimensions.variantThumbnail.allowedVarition);

          // console.log("Min Width", minWidth);
          // console.log("Max Width", maxWidth);

          // console.log("Min Height", minHeight);
          // console.log("Max Height", maxHeight);

          // console.log("Image Width", img.width);
          // console.log("Image Height", img.height);

          if((img.width < minWidth || img.width > maxWidth) || (img.height < minHeight || img.height > maxHeight)) { 
            temp = false;
            // isDimensionAllowed.push(false);
            // setIsImageDimesionAllowed((oldArray) => [...oldArray, false]);
          } else {
            temp = true;
            // isDimensionAllowed.push(true);
            // setIsImageDimesionAllowed((oldArray) => [...oldArray, true]);
          } 
          resolve(temp);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }); 
  }

  function getVariantImageDimesions(file) {
    let temp;
    var reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function (e) {
        var img = new Image;
        img.onload = function() {
          let minWidth = maxImageDimensions.variantImage.maxWidth - (maxImageDimensions.variantImage.maxWidth * maxImageDimensions.variantImage.allowedVarition);
          let minHeight = maxImageDimensions.variantImage.maxHeight - (maxImageDimensions.variantImage.maxHeight * maxImageDimensions.variantImage.allowedVarition);

          let maxWidth = maxImageDimensions.variantImage.maxWidth + (maxImageDimensions.variantImage.maxWidth * maxImageDimensions.variantImage.allowedVarition);
          let maxHeight = maxImageDimensions.variantImage.maxHeight + (maxImageDimensions.variantImage.maxHeight * maxImageDimensions.variantImage.allowedVarition);

          // console.log("Min Width", minWidth);
          // console.log("Max Width", maxWidth);

          // console.log("Min Height", minHeight);
          // console.log("Max Height", maxHeight);

          // console.log("Image Width", img.width);
          // console.log("Image Height", img.height);

          if((img.width < minWidth || img.width > maxWidth) || (img.height < minHeight || img.height > maxHeight)) { 
            temp = false;
            // isDimensionAllowed.push(false);
            // setIsImageDimesionAllowed((oldArray) => [...oldArray, false]);
          } else {
            temp = true;
            // isDimensionAllowed.push(true);
            // setIsImageDimesionAllowed((oldArray) => [...oldArray, true]);
          } 
          resolve(temp);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }); 
  }
  async function handleGalleryImages(e) {
    for (let index = 0; index < e.target.files.length; index++) {
      const file = e.target.files[index];
      const fileSize = file.size / 1000;
      try {
        const allowedImageDimensions = await getVariantImageDimesions(file);
        if(allowedImageDimensions 
          && fileSize < (maxImageSize * 1000)
          && e.target.files.length <= maxImageDimensions.variantImage.limit
          && galleryImageList.length < maxImageDimensions.variantImage.limit
          ) {
          if (!galleryImageNameList.includes(file.name)) {
            setGalleryImageNameList((oldArray) => [...oldArray, file.name]);
            setGalleryImageList((oldArray) => [...oldArray, file]);
            setVariantImageSizeList((oldArray) => [...oldArray, fileSize]);
          } else {
            setDuplicateGalleryImages((o) => [...o, file.name]);
            PushAlert.error('Duplicate image "' + file.name + '"is not allowed');
            console.log('SAME IMAGE NAME CONFLICT::::Please delete the image with this same name first:::', file.name);
          }
        } else {
          if(!allowedImageDimensions)
            PushAlert.error(`${file.name} dimension does not comply to given dimension`);
          if(fileSize > (maxImageSize * 1000))
            PushAlert.error(`${file.name} size is greater than ${maxImageSize}MB`);
          if(e.target.files.length > maxImageDimensions.variantImage.limit || galleryImageList.length >= maxImageDimensions.variantImage.limit) {
            PushAlert.error(`You are only allowed to upload ${maxImageDimensions.variantImage.limit} images`)
            break;
          }
        }
      } catch(e) {
        console.log(e);
      }
    }
  }

  function removeGalleryImage(i) {
    const imageName = [...galleryImageNameList].splice(i, 1)[0];
    const imageSize = [...variantImageSizeList].splice(i, 1)[0];
    const isImageDimAllowed = [...isImageDimesionAllowed].splice(i, 1)[0];

    if (!originalGalleryImageList.includes(imageName)) {
      const images = Array.from(galleryImages).filter((img) => img.name !== imageName);
      setGalleryImages(images);
      setGalleryImageList((oldArray) => oldArray.filter((f) => f.name !== imageName));
      setVariantImageSizeList((oldArray) => oldArray.filter((f) => f.name !== imageSize));
      setIsImageDimesionAllowed((oldArray) => oldArray.filter((f) => f.name !== isImageDimAllowed))
    } else {
      let deleteGalleryClone = [...deleteGalleryImage];
      deleteGalleryClone.push(imageName);
      setDeleteGalleryImage(deleteGalleryClone);
      setOriginalGalleryImageList([...originalGalleryImageList].filter((img, index) => index !== i));
    }
    setGalleryImageNameList([...galleryImageNameList].filter((img, index) => index !== i));
    setVariantImageSizeList([...variantImageSizeList].filter((img, index) => index !== i));
    setIsImageDimesionAllowed([...isImageDimesionAllowed].filter((img, index) => index !== i));
  }

  function handleSelectAll() {
    let dys = [...days];
    dys.forEach((dy) => {
      dy.isActive = selectAll;
    });
    setDays(dys);
    setSelectAll(!selectAll);
  }

  function handleCurrencyChange(e) {
    setSelectedCurrency(e);
  }

  async function getDuplicateVariantList() {
    if (props.location.state && props.location.state.selectedService) {
      let query = {};
      try {
        setIsLoading(true);
        let apiResponse = await CallAPI.get(apiConfig.serviceByParentId + `/${props.location.state.selectedService}`, query, authToken);
        let responseObj = await apiResponse.json();
        let movementIndex = 0;
        let sectorIndex = 0;
        let responseArr = [];
        let tempList = [];
        responseArr = Array.isArray(responseObj.data) ? responseObj.data : [];

        // responseObj = Array.isArray(responseObj) ? responseObj : [];
        responseArr.forEach((item, index) => {
          tempList.push({ value: item._id, label: item.title });
          item.createdAtClone = Util.dateFormat(item.createdAt);
          item.updatedAtClone = Util.dateFormat(item.updatedAt);
          item.authFlagClone = item.authFlag ? 'Approved' : 'Pending';
          item.activeFlagClone = item.activeFlag ? 'Active' : 'Inactive';
          item.sectorClone = item.sector;
          item.movementTypeClone = item.movementType;
          let isSameMovement = responseArr[movementIndex].movementType === item.movementType;
          if (index > 0 && responseArr[sectorIndex].sector === item.sector && isSameMovement) {
            item.sectorClone = '';
          } else {
            sectorIndex = index;
          }
          if (index > 0 && isSameMovement) {
            item.movementTypeClone = '';
          } else {
            movementIndex = index;
          }
        });
        setDuplicateVariantList(tempList);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setDuplicateVariantList([]);
      }
    }
  }

  async function handleDuplication() {
    if(selectedDuplicateVariant && selectedDuplicateVariant.value) {
      setIsLoading(true);
      const reqPath = apiConfig.getServiceById.replace('{{serviceId}}', selectedDuplicateVariant.value);
      let apiResponse = await CallAPI.get(
        reqPath,
        {},
        authToken || ''
      );

      let responseObj = await apiResponse.json();

      if (200 === +responseObj.statusCode && 'success' === responseObj.status) {
        if(responseObj.data) {

          setSector(Config.sectorType.find((tsl) => tsl.value == responseObj.data.sector));
          setMovementType(Config.movementType.find((tsl) => tsl.value == responseObj.data.movementType));
          setGalleryImageNameList(responseObj.data.serviceImageUrlSub);
          setOriginalGalleryImageList(responseObj.data.serviceImageUrlSub);
          setFeatures(responseObj.data.features);
          setThumbnailList(responseObj.data.features.map((f) => f.featureImageUrl));
          setOriginalThumbnailImageList(responseObj.data.features.map((f) => f.featureImageUrl));
          setTitle(responseObj.data.title);
          setDesc(responseObj.data.description);
          let accessData = [];
          for (let i of responseObj.data.access) {
            accessData.push({ label: i, value: i });
          }
          setSelectedAccess(accessData);
          let skillsData = [];
          for (let i of responseObj.data.skills) {
            skillsData.push({ label: i, value: i });
          }
          setSelectedSkills(skillsData);
          let assetsData = [];
          for (let i of responseObj.data.assets) {
            assetsData.push({ label: i, value: i });
          }
          setSelectedAssets(assetsData);
          setAmount(responseObj.data.pricing.price);
          setSelectedCurrency(appConfig.currencyList.find((tsl) => tsl.value == responseObj.data.pricing.currency));
          // setApplicableFor(responseObj.data.pricing.applicableFor);
          setApplicableFor({ value: responseObj.data.pricing.applicableFor, label: responseObj.data.pricing.applicableFor });
          setDays(responseObj.data.operatingHours);

          setDuplicateVariantSelected(true);
          setIsLoading(false);
        }
      }
    }
  }

  function resetDuplication() {
    setMovementType(props.location.state.movementType.label === 'View All' 
      ? movementList[0] : props.location.state.movementType
    );
     setSector(props.location.state.sector.label === 'View All' 
     ? sectorList[0] : props.location.state.sector
    );
    setGalleryImageNameList([]);
    setOriginalGalleryImageList([]);
    setFeatures([{ ...appConfig.features[0] }]);
    setThumbnailList([]);
    setOriginalThumbnailImageList([]);
    setTitle('');
    setDesc('');
    setSelectedAccess([]);
    setSelectedSkills([]);
    setSelectedAssets([]);
    setAmount(0);
    setSelectedCurrency();
    setApplicableFor();
    setDays([...appConfig.daysOfWeek]);

    setDuplicateVariantSelected(false);
  }

  return (
    <div className="form-add-edit">
      {isLoading && (
        <div id="overlay">
          <Loader />
        </div>
      )}
      <div className="form-add-edit-header">
        <div className="form-add-edit-header-one">
          <StaticDropdown
            title={'Category'}
            placeholder={'Select Category...'}
            selectedValue={selectedCategory}
            valueSetter={setSelectedCategory}
            valueList={categoryList}
            disabledValue={true}
            width="100%"
            textWidth="10rem"
            lineHeight="2rem"
          />
          <StaticDropdown
            title={'Services'}
            placeholder={'Select Service...'}
            selectedValue={selectedService}
            valueSetter={setSelectedService}
            valueList={serviceList}
            disabledValue={true}
            width="100%"
            textWidth="10rem"
            lineHeight="2rem"
          />
        </div>
        <div className="form-add-edit-header-two">
          <StaticDropdown
            title={'Movement Type'}
            valueList={movementList}
            placeholder={'Select Moment...'}
            selectedValue={selectedMovementType}
            valueSetter={setMovementType}
            disabledValue={movementTypeDisabled}
            width="100%"
            textWidth="10rem"
            lineHeight="2rem"
          />
          <StaticDropdown
            title={'Sector'}
            valueList={sectorList}
            placeholder={'Select Sector...'}
            selectedValue={selectedSector}
            valueSetter={setSector}
            disabledValue={sectorDisabled}
            width="100%"
            textWidth="10rem"
            lineHeight="2rem"
          />
          {/* <div className="varient-dropdown-container" style={{ width: props.width || null }}>
            <div className="display-text" style={{ lineHeight: '32px' }}>
              Variant
            </div>
            <div className="varient-dropdown">
              <TextInput
                fontWeight="500"
                fontSize="14px"
                color={'#151515'}
                borderRadius={'4px'}
                border={'1px solid #bebebe'}
                width={'89%'}
                value={variant}
                placeholder="Enter Variant..."
                onChange={(e) => setVariant(e.target.value)}
                className="input-highlight"
              />
            </div>
          </div> */}
        </div>
      </div>
      <div className="form-add-edit-form">
        <div className="service-detail-form-row">
        {duplicateVariantList.length > 0 ? 
          <div className="service-detail-form-input">
            <div className='duplicate-variant-wrapper'>
              <div className='duplicate-variant-checkbox-label'>Select a variant to duplicate :</div>
            </div>
            <div className='duplicate-variant-dropdown-wrapper'>
              <StaticDropdown
                title={'Select Variant'}
                valueList={duplicateVariantList}
                placeholder={'Select Variant...'}
                selectedValue={selectedDuplicateVariant}
                valueSetter={setSelectedDuplicateVariant}
                // disabledValue={!duplicateVariantChecked}
                width="100%"
                textWidth="10rem"
                lineHeight="2rem"
                textColor="#606060"
              />
            </div>
            <div className='duplicate-variant-action-wrapper'>
              <Button 
                height="40px" 
                fontWeight="600" 
                width="30%" 
                bgColor="#545f64" 
                fontSize="18px" 
                className="cancel-container" 
                onClick={() => resetDuplication()}
              >
                {/* <div className="cancel-container-image"></div> */}
                <div style={{ margin: '5px', width: "100%" }}>Reset</div>
              </Button>
              <Button 
                height="40px" 
                fontWeight="600" 
                width="30%" 
                bgColor="#507b36" 
                fontSize="18px" 
                className="submit-container" 
                onClick={() => isEdit ? handleOpen() : handleDuplication()}
              >
                {/* <div className="duplicate-container-image"></div> */}
                <div style={{ margin: '5px', width: "100%" }}>Duplicate</div>
              </Button>
            </div>
          </div>
        : null}
          {duplicateVariantList.length > 0 ? <hr className="dashed-hr" /> : null}
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
                Accepted image dimension : {maxImageDimensions.variantImage.maxWidth}px x {maxImageDimensions.variantImage.maxHeight}px<br />
                Accepted variation from given dimension : &plusmn; {maxImageDimensions.variantImage.allowedVarition * 100}%<br />
                Accepted maximum file size : Upto {maxImageSize}MB per file<br />
                Accepted file format : JPEG, PNG, GIF, SVG<br />
                Upload Type : Multiple Images (Upto 10 Images)
              </div>
          </div>
          <div className="service-detail-form-row-textbox thumbnail-prop">
            <div className="title-text required">Image</div>{' '}
            <FileInput
              multiple
              className="gallery-image-dis"
              allowedExt={imageExt}
              setFile={(f) => setGalleryImages((o) => [...Array.from(o || []), ...Array.from(f)])}
              // style={'banner'}
              styles={customStyles}
              handleFeaturethumbnail={(e) => handleGalleryImages(e)}
              limit={maxImageDimensions.variantImage.limit}
            />
          </div>
          <div className="service-detail-form-row-textbox gallery-prop">
            <div className="title-text"></div>{' '}
            <div className="gallery-image-display">
              {galleryImageNameList.map((name, i) => (
                <div className="gallery-image">
                  <img
                    ref={(el) => (galleryImagesRef.current[i] = { name, img: el })}
                    src={!isEdit && !originalGalleryImageList.includes(name) ? name : `${apiConfig.serviceImg}${name}`}
                    height="95%"
                  />
                  <div className="gallery-remove-image" onClick={() => removeGalleryImage(i)}></div>
                </div>
              ))}
            </div>
          </div>

          <hr className="dashed-hr" />
          <div className="service-detail-form-row-instructions instructions-prop">
            <div className="title-text">Instructions:</div>{' '}
              <div>
                Accepted image dimension : {maxImageDimensions.variantThumbnail.maxWidth}px x {maxImageDimensions.variantThumbnail.maxHeight}px<br />
                Accepted variation from given dimension : &plusmn; {maxImageDimensions.variantThumbnail.allowedVarition * 100}%<br />
                Accepted maximum file size : Upto {maxImageSize}MB per file<br />
                Accepted file format : JPEG, PNG, GIF, SVG<br />
                Upload Type : Single Image
              </div>
          </div>
          <div className="features-add-column">
            {features.map((e, i) => (
              <div className={i > 0 ? 'feature-append-dis-more' : 'feature-append-dis'}>
                {i > 19 ? (
                  PushAlert.error('You can add upto 20 Features')
                ) : (
                  <div className="feature-append-dis">
                    <div className="title-text mr-neg-22 required">Features ({i + 1})</div>
                    <div className="features-col">
                      <div className="service-detail-form-row-input features">
                        <div className="title-text text-prop">Name</div>{' '}
                        <TextInput
                          fontWeight="500"
                          fontSize="16px"
                          color={'#151515'}
                          borderRadius={'4px'}
                          border={'1px solid #bebebe'}
                          width={'82.5%'}
                          marginTop={'10px'}
                          value={e.featureName}
                          onChange={(e) => handleFeatureName(i, e.target.value, e)}
                          className="input-highlight"
                        />
                      </div>
                      <div className="service-detail-form-row-input features">
                        <div className="title-text text-prop">Description</div>{' '}
                        <TextInput
                          fontWeight="500"
                          fontSize="16px"
                          color={'#151515'}
                          borderRadius={'4px'}
                          border={'1px solid #bebebe'}
                          width={'82.5%'}
                          marginTop={'20px'}
                          value={e.featureDesc}
                          onChange={(e) => handleFeatureDesc(i, e.target.value)}
                          className="input-highlight"
                        />
                      </div>
                      <div className="service-detail-form-row-input features-thumbnail">
                        <div className="title-text text-prop">Thumbnail</div>{' '}
                        <FileInput
                          multiple={false}
                          // filename={isEdit ? e && e.featureImageUrl : ''}
                          allowedExt={imageExt}
                          setFile={setThumbnail}
                          style={'banner'}
                          className="thumbnail-file"
                          handleFeaturethumbnail={(e) => handleFeaturethumbnail(i, e)}
                        />
                        <div className="thumbnail-image">
                          <img
                            ref={(el) =>
                              (thumbnailImagesRef.current[i] = {
                                ref: el,
                                featureImageUrl: e.featureImageUrl
                              })
                            }
                            src={
                              !isEdit && !originalThumbnailImageList.includes(e.featureImageUrl)
                                ? e.featureImageUrl
                                : `${apiConfig.serviceImg}${e.featureImageUrl}`
                            }
                            height="95%"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="feature-add-image" onClick={() => appendFeatures(i)}></div>
                    {i > 0 ? <div className="feature-remove-image" onClick={() => removeFeatures(i)}></div> : null}
                  </div>
                )}
              </div>
            ))}
          </div>
          <hr className="dashed-hr" />
          <div className="service-detail-form-row-input hours-prop">
            <div className="title-text required hop-title">Hours of Operations</div>
            <div className="days-of-week">
              {days.map((e, i) => (
                <div className="time-picker-dis">
                  {/* {console.log(e)} */}
                  <Button
                    height="44px"
                    fontWeight="600"
                    // bgColor={e.isActive ? '#afb8bb' : '#edf8fc'}
                    bgColor={e.isActive ? '#28bd9b' : '#bacbdd'}
                    fontSize="16px"
                    className={selectAll ? 'days-container' : 'days-container-all'}
                    onClick={() => {
                      handleDays(i);
                    }}
                    key={i}
                  >
                    <div style={{ margin: '8px 12px', textTransform: 'uppercase' }}>{e.day}</div>
                  </Button>
                  <div className="time-picker-image"></div>
                  <div className="time-picker">
                    <div
                      className="input-highlight"
                      style={{
                        width: '100%',
                        height: '60%',
                        fontSize: 14,
                        textAlign: 'center',
                        borderRadius: 5,
                        border: '1px solid #9CB0B1'
                      }}
                    >
                      <TimePickerInput
                        time={{ hour24: e.startHour, minute: e.startMin }}
                        format={'HH:mm'}
                        onTimeUpdate={(tm) => {
                          handleStartTime(i, tm.formatted.split(':'));
                        }}
                      />
                    </div>
                    <SubtitleText
                      fontSize="14px"
                      style={{
                        marginLeft: '40%',
                        width: '100%',
                        height: '60%',
                        padding: '0%'
                      }}
                      color="black"
                    >
                      To
                    </SubtitleText>
                    <div
                      className="input-highlight"
                      style={{
                        width: '100%',
                        height: '60%',
                        padding: '0%',
                        fontSize: 14,
                        textAlign: 'center',
                        borderRadius: 5,
                        border: '1px solid #9CB0B1'
                      }}
                    >
                      <TimePickerInput
                        time={{ hour24: e.endHour, minute: e.endMin }}
                        format={'HH:mm'}
                        onTimeUpdate={(tm) => {
                          handleEndTime(i, tm.formatted.split(':'));
                        }}
                      />
                    </div>
                  </div>{' '}
                </div>
              ))}
            </div>
            <div className="select-dis">
              <Button
                height="44px"
                fontWeight="600"
                // bgColor={selectAll ? '#afb8bb' : '#edf8fc'}
                bgColor={!selectAll ? '#25325a' : '#bacbdd'}
                fontColor={!selectAll ? '#ffffff' : '#000000'}
                fontSize="16px"
                className="select-all"
                onClick={() => handleSelectAll()}
              >
                <div style={{ margin: '6px 23px' }}>{selectAll ? 'ALL' : 'ALL'}</div>
              </Button>
            </div>
          </div>
          <hr className="dashed-hr" />
          <div className="service-detail-form-row-input pricing-prop">
            <div className="title-text required">Pricing</div>
            <div className="currency-dropdown-container" style={{ width: '19%' }}>
              <div className="display-text" style={{ lineHeight: '20px', textAlign: 'center', width: 'null' }}>
                Currency:
              </div>
              <div className="currency-dropdown">
                <Select
                  // placeholder={'Select Value...'}
                  isSearchable={true}
                  value={selectedCurrency}
                  onChange={(e) => handleCurrencyChange(e)}
                  options={currencyList}
                  styles={customStyles}
                />
              </div>
            </div>
            <div className="title-text marl-2">Amount:</div>{' '}
            <NumberInput
              fontWeight="500"
              fontSize="16px"
              color={'#151515'}
              borderRadius={'4px'}
              border={'1px solid #bebebe'}
              width={'9.5%'}
              value={amount}
              onChange={(e) => {
                if(e.target.value >= 0)
                  setAmount(e.target.value)
              }}
              className="input-highlight"
            />
            <div className="title-text marl-2 mt-neg">Applicable for per:</div>{' '}
              <div style={{ width: "8rem" }}>
                <Select
                  // placeholder={'Select Value...'}
                  isSearchable={true}
                  value={applicableFor}
                  onChange={(e) => setApplicableFor(e)}
                  options={applicableForList}
                  styles={customStyles}
                />
              </div>
            {/* <TextInput
              fontWeight="500"
              fontSize="16px"
              color={'#151515'}
              borderRadius={'4px'}
              border={'1px solid #bebebe'}
              width={'9.5%'}
              value={applicableFor}
              onChange={(e) => setApplicableFor(e.target.value)}
              className="input-highlight"
            /> */}
          </div>
          <hr className="dashed-hr" />
          <div className="skills-row">
            <div className="title-text mr-neg required">Skills Required</div>{' '}
            <div className="skills-col">
              <div className="service-detail-form-row-input skills">
                <StaticMultiselectDropdown
                  title={'Access'}
                  placeholder={'Select Access...'}
                  selectedValue={selectedAccess}
                  valueSetter={setSelectedAccess}
                  valueList={access}
                  width="100%"
                  textWidth="10rem"
                  lineHeight="2rem"
                />
              </div>
              <div className="service-detail-form-row-input skills">
                <StaticMultiselectDropdown
                  title={'Skills'}
                  placeholder={'Select Skills...'}
                  selectedValue={selectedSkills}
                  valueSetter={setSelectedSkills}
                  valueList={skills}
                  width="100%"
                  textWidth="10rem"
                  lineHeight="2rem"
                />
              </div>
              <div className="service-detail-form-row-input skills">
                <StaticMultiselectDropdown
                  title={'Assets'}
                  placeholder={'Select Assets...'}
                  selectedValue={selectedAssets}
                  valueSetter={setSelectedAssets}
                  valueList={assets}
                  width="100%"
                  textWidth="10rem"
                  lineHeight="2rem"
                />
              </div>
            </div>
          </div>
          {isEdit ? <hr className="dashed-hr" /> : null}
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
              onClick={() => handleSubmit()}
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
            You will lose entered data if you duplicate. Do you want to continue? 
          </p>
          <Button 
            height="40px" 
            fontWeight="600" 
            width="30%" 
            bgColor="#507b36" 
            fontSize="18px" 
            className="submit-container" 
            onClick={() => {
              handleDuplication();
              handleClose();
            }}
          >
            <div style={{ margin: '5px', width: "100%" }}>Continue</div>
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
