import React, { useState, useMemo, useEffect } from 'react';
import Button from '../../../../elements/button/action';
import { useHistory, useRouteMatch } from 'react-router-dom';
import CallAPI from '../../../../commons/callAPI';
import Util from '../../../../commons/util';
import Config from '../../../../commons/config';
import tableConfig from '../../../../commons/tableConfig';
import StaticDropdown from '../../../form/subcomponent/staticDropdown/staticDropdown';
import ServiceTable from '../../../table/table';
import PushAlert from '../../../../commons/notification';
import Loader from '../../../../commons/loader';

import './serviceTableList.css';
let renderedOnce = false;

export default function ServiceTableList(props) {
  const authToken = props.token;
  const history = useHistory();
  const { url } = useRouteMatch();
  const serviceTableConfig = useMemo(() => tableConfig.adService, []);
  const apiConfig = useMemo(() => Config.api, []);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [variantList, setVariantList] = useState([]);
  const [selectedService, setSelectedService] = useState({});
  const [selectedVariant, setSelectedVariant] = useState({});
  const [tableData, setTableData] = useState([]);
  const [movementList, setMovementList] = useState([
    {
      value: 'View All',
      label: 'View All'
    },
    {
      value: 'Departure',
      label: 'Departure'
    },
    {
      value: 'Arrival',
      label: 'Arrival'
    }
  ]);
  const [selectedMovementType, setMovementType] = useState(Config.listMovementType[0]);
  const [movementTypeDisabled, setMovementTypeDisabled] = useState(false);
  const [sectorList, setsectorList] = useState([
    {
      value: 'View All',
      label: 'View All'
    },
    {
      value: 'International',
      label: 'International'
    },
    {
      value: 'Domestic',
      label: 'Domestic'
    }
  ]);
  // const [sectorList, setsectorList] = useState(Config.sectorType);
  const [selectedSector, setSector] = useState(sectorList[0]);
  const [sectorDisabled, setSectorDisabled] = useState(false);
  const [authList, setAuthList] = useState(Config.listAuthFlag);
  const [selectedAuthType, setAuthType] = useState(Config.listAuthFlag[0]);
  const [activeList, setActiveList] = useState(Config.listActiveFlag);
  const [selectedActive, setActive] = useState(Config.listActiveFlag[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [variantData, setVariantData] = useState([]);
  const [selectedInputType, setSelectedInputType] = useState([]);

  const OpenServiceAddPage = () => {
    const parentMovementType = window.sessionStorage.getItem('parentMovementType');
    const parentSector = window.sessionStorage.getItem('parentSector');
    const parentServiceName = window.sessionStorage.getItem('parentServiceName');
    const parentInputType = JSON.parse(window.sessionStorage.getItem('parentInputType'))

    history.push({
      pathname: `${url.replace('details', 'add')}`,
      state: {
        edit: false,
        store: selectedCategory,
        movementType: selectedMovementType,
        sector: selectedSector,
        selectedService: selectedService.value,
        parentMovementType,
        parentSector,
        parentServiceName,
        parentInputType: parentInputType,
      }
    });
    window.sessionStorage.setItem('categoryId', selectedCategory._id);
    window.sessionStorage.setItem('servicename', selectedService.value);
    window.sessionStorage.setItem('movementType', selectedMovementType.value);
    window.sessionStorage.setItem('sector', selectedSector.value);
  };

  useEffect(() => {
    async function getCategoryList() {
      let apiResponse = await CallAPI.get(apiConfig.listVariant, {}, authToken);
      let responseObj = await apiResponse.json();
      renderedOnce = false;
      let tempCatList = [];
      if (responseObj.data && responseObj.data.categoryData) {
        setVariantData(responseObj.data.variantData);
        tempCatList = responseObj.data.categoryData;
        setCategoryList(tempCatList);
        if (props.location.state && props.location.state.category) {
          let slCat = tempCatList.find((tsl) => tsl._id == props.location.state.category.serviceCategoryId);
          setSelectedCategory(slCat);
          setMovementType({ 
            value: props.location.state.category.movementType === 'All' ? 'View All' : props.location.state.category.movementType, 
            label: props.location.state.category.movementType === 'All' ? 'View All' : props.location.state.category.movementType, 
          });
          setSector({ 
            value: props.location.state.category.sector === 'All' ? 'View All' : props.location.state.category.sector, 
            label: props.location.state.category.sector === 'All' ? 'View All' : props.location.state.category.sector,
          });
          setSelectedInputType(props.location.state.category.selectedInputType);
          window.sessionStorage.setItem('parentMovementType', props.location.state.category.movementType);
          window.sessionStorage.setItem('parentSector', props.location.state.category.sector);
          window.sessionStorage.setItem('parentServiceName', props.location.state.category.servicename);
          window.sessionStorage.setItem('parentInputType', JSON.stringify(props.location.state.category.selectedInputType));
          setMovementTypeDisabled(
            props.location.state.category.movementType !== 'All' ? true : false);
          setSectorDisabled(
            props.location.state.category.sector !== 'All' ? true : false);
        } else if (window.sessionStorage.getItem('categoryId')) {
          const categoryId = window.sessionStorage.getItem('categoryId');
          setSelectedCategory(tempCatList.find((tsl) => tsl._id == categoryId));
          const mType = window.sessionStorage.getItem('parentMovementType');
          setMovementType({ 
            value: mType === 'All' ? 'View All' : mType, 
            label: mType === 'All' ? 'View All' : mType
          });
          setMovementTypeDisabled(mType !== 'All' ? true : false);
          const sec = window.sessionStorage.getItem('parentSector');
          setSector({ 
            value: sec === 'All' ? 'View All' : sec,
            label: sec === 'All' ? 'View All' : sec
          });
          setSectorDisabled(sec !== 'All' ? true : false);
          const inp = JSON.parse(window.sessionStorage.getItem('parentInputType'));
          setSelectedInputType(inp);
        } else {
          setSelectedCategory(tempCatList[0]);
        }
      } else {
        PushAlert.error(responseObj.message || responseObj.status);
      }
      setIsLoading(false);
    }
    getCategoryList();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      let filterService = categoryList.find((ctl) => ctl._id == selectedCategory.value);
      let serviceData = filterService ? filterService.serviceData : [];
      const servicename = window.sessionStorage.getItem('servicename');
      setServiceList(serviceData);
      if (props.location.state && props.location.state.category && !renderedOnce) {
        renderedOnce = true;
        let value = props.location.state.category.value;
        setSelectedService(serviceData.find((tsl) => tsl.value == value));
      } else if (servicename && serviceData.find((tsl) => tsl.value == servicename)) {
        setSelectedService(serviceData.find((tsl) => tsl.value == servicename));
      } else {
        setSelectedService(serviceData[0]);
      }
    }
  }, [selectedCategory]);

  // useEffect(() => {
  //   if (selectedService) {
  //     let filterVariant = variantData.find((vr) => vr._id == selectedService.value);
  //     let variantDetail = filterVariant ? filterVariant.servicename : [];
  //     variantDetail.sort(function (a, b) {
  //       var nameA = a.label
  //       var nameB = b.label
  //       if (nameA < nameB) {
  //         return -1;
  //       }
  //       if (nameA > nameB) {
  //         return 1;
  //       }
  //       return 0;
  //     });
  //     let variantClone = Object.assign([], variantDetail);
  //     variantClone.unshift({ label: 'View All', value: 'View All' });
  //     setVariantList(variantClone);
  //     setSelectedVariant(variantClone[0]);
  //   }
  // }, [selectedService]);

  useEffect(() => {
    getAdServiceList();
  }, [selectedSector, selectedVariant, selectedMovementType, selectedActive, selectedAuthType]);

  async function getAdServiceList() {
    if (selectedService && selectedService.value) {
      // let query = ''
      // query += ''
      try {
        setIsLoading(true);
        let query = {};
        // if (selectedVariant.value !== 'View All') {
        //   query.servicename = selectedVariant.value;
        // }
        if (selectedActive.value !== 'View All') {
          query.activeFlag = selectedActive.value === 'Active' ? true : false;
        }
        if (selectedAuthType.value !== 'View All') {
          query.authFlag = selectedAuthType.value === 'Approved' ? true : false;
        }
        if (selectedSector.value !== 'View All') {
          query.sector = selectedSector.value;
        }
        if (selectedMovementType.value !== 'View All') {
          query.movementType = selectedMovementType.value;
        }
        let apiResponse = await CallAPI.get(apiConfig.serviceByParentId + `/${selectedService.value}`, query, authToken);
        let responseObj = await apiResponse.json();
        let movementIndex = 0;
        let sectorIndex = 0;
        let responseArr = [];
        responseArr = Array.isArray(responseObj.data) ? responseObj.data : [];

        // responseObj = Array.isArray(responseObj) ? responseObj : [];
        responseArr.forEach((item, index) => {
          item.createdAtClone = Util.dateFormat(item.createdAt);
          item.updatedAtClone = Util.dateFormat(item.updatedAt);
          item.authFlagClone = item.authFlag ? 'Approved' : 'Pending';
          item.activeFlagClone = item.activeFlag ? 'Active' : 'Inactive';
          item.sectorClone = item.sector;
          item.movementTypeClone = item.movementType;
          // let isSameMovement = responseArr[movementIndex].movementType === item.movementType;
          // if (index > 0 && responseArr[sectorIndex].sector === item.sector && isSameMovement) {
          //   item.sectorClone = '';
          // } else {
          //   sectorIndex = index;
          // }
          // if (index > 0 && isSameMovement) {
          //   item.movementTypeClone = '';
          // } else {
          //   movementIndex = index;
          // }
        });
        setTableData(responseArr);
        setIsLoading(false);
      } catch (err) {
        setTableData([]);
        setIsLoading(false);
      }
    }
  }

  const handleOnEdit = (e) => {
    const parentMovementType = window.sessionStorage.getItem('parentMovementType');
    const parentSector = window.sessionStorage.getItem('parentSector');
    const parentInputType = JSON.parse(window.sessionStorage.getItem('parentInputType'));

    history.push({
      pathname: `${url.replace('details', 'edit')}`,
      state: {
        data: e,
        edit: true,
        store: selectedCategory,
        movementType: selectedMovementType,
        sector: selectedSector,
        selectedService: selectedService.value,
        parentMovementType,
        parentSector,
        parentInputType
      }
    });
    window.sessionStorage.setItem('categoryId', selectedCategory._id);
    window.sessionStorage.setItem('servicename', selectedService.value);
    window.sessionStorage.setItem('movementType', selectedMovementType.value);
    window.sessionStorage.setItem('sector', selectedSector.value);
  };

  const deleteVariant = async (arg) => {
    if (window.confirm('Are you sure? This change is not reversible!')) {
        let apiResponse = await CallAPI.delete(
          apiConfig.deleteService,
          {
            id: arg.values._id,
          },
          authToken || ''
        );
  
        let responseObj = await apiResponse.json();
  
        if (200 === +responseObj.statusCode && 'success' === responseObj.status) {
          PushAlert.success(responseObj.message || responseObj.status);
          getAdServiceList();
        } else {
          PushAlert.error(responseObj.message || responseObj.status);
        }
    }
  }

  return (
    <div className="service-table-screen">
      {isLoading && (
        <div id="overlay">
          <Loader />
        </div>
      )}
      <div className="service-table-dropdown">
        <StaticDropdown 
          title={'Category'} 
          width={'25%'} 
          selectedValue={selectedCategory} 
          valueSetter={setSelectedCategory} 
          valueList={categoryList}
          disabledValue={true}
        />
        <StaticDropdown 
          title={'Service'} 
          width={'25%'} 
          selectedValue={selectedService} 
          valueSetter={setSelectedService} 
          valueList={serviceList} 
          disabledValue={true}
        />
        {/* <ServiceDropdown /> */}
        <StaticDropdown
          title={'Movement Type'}
          valueList={movementList}
          width={'25%'}
          placeholder={'Select Moment...'}
          selectedValue={selectedMovementType}
          valueSetter={setMovementType}
          lineHeight="20px"
          textWidth="4rem"
          disabledValue={movementTypeDisabled}
        />
        <StaticDropdown
          title={'Sector'}
          valueList={sectorList}
          width={'25%'}
          placeholder={'Select Sector...'}
          selectedValue={selectedSector}
          valueSetter={setSector}
          disabledValue={sectorDisabled}
        />
        {/* <StaticDropdown title={'Variant'} width={'20%'} selectedValue={selectedVariant} valueSetter={setSelectedVariant} valueList={variantList} /> */}
      </div>
      <hr className="dashed-hr" />
      <div className="add-edit-service">
        <div className="subtitle-text">
          <StaticDropdown
            title={'Approval Status'}
            valueList={authList}
            width={'18rem'}
            selectedValue={selectedAuthType}
            valueSetter={setAuthType}
            textWidth="3.9rem"
            lineHeight="20px"
          />
        </div>
        <div className="delivery-option">
          <StaticDropdown
            title={'Active Status'}
            valueList={activeList}
            width={'18rem'}
            selectedValue={selectedActive}
            valueSetter={setActive}
            textWidth="2.8rem"
            lineHeight="20px"
          />
        </div>
        <div className="add-new-services">
          <Button
            height="40px"
            gradient="0deg, #61c3de 0%,  #35c17a 0%, #3fd488 50%"
            className="add-service-button"
            fontSize="20px"
            onClick={(e) => OpenServiceAddPage()}
            width={'230px'}
            margin={'0 1%'}
          >
            <div className="image"></div>
            <div style={{ margin: '2px' }}>Add New Variant</div>
          </Button>
        </div>
      </div>
      <hr className="dashed-hr" />
      <div className="servicelist-table">
        <ServiceTable
          config={serviceTableConfig}
          data={tableData}
          tableClass={'service-table'}
          actionType={'editOrDelete'}
          onInfo={null}
          onEdit={handleOnEdit}
          onDownload={null}
          onDelete={deleteVariant}
          onEnter={null}
          maxPage={0}
          pageCount={0}
          sorting={false}
          renderEnterButton={false}
          fromVariantsTable={true}
        />
      </div>
    </div>
  );
}
