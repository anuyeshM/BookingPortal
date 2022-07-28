import React, { useState, useEffect, useMemo } from 'react';
import Button from '../../../../elements/button/action';
import { useHistory, useRouteMatch } from 'react-router-dom';
import PushAlert from '../../../../commons/notification';
import Config from '../../../../commons/config';
import CallAPI from '../../../../commons/callAPI';
import tableConfig from '../../../../commons/tableConfig';
import ServiceListingTable from '../../../table/table';
import StaticDropdown from '../../../form/subcomponent/staticDropdown/staticDropdown';
import './serviceCategory.css';
import Util from '../../../../commons/util';

export default function ServiceCategoryList(props) {
  const history = useHistory();
  const { url } = useRouteMatch();
  const apiConfig = useMemo(() => Config.api, []);
  const [categoryList, setcategoryList] = useState([]);

  const serviceListingConfig = useMemo(() => tableConfig.serviceList, []);

  const [selectedCategory, setSelectedCategory] = useState({});
  // const [categoryList, setCategoryList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [variantList, setVariantList] = useState([]);
  const [selectedService, setSelectedService] = useState({});
  const [selectedVariant, setSelectedVariant] = useState({});
  const [tableData, setTableData] = useState([]);
  const [movementList, setMovementList] = useState(Config.listMovementType);
  const [selectedMovementType, setMovementType] = useState(Config.listMovementType[0]);
  const [sectorList, setsectorList] = useState(Config.listSectorType);
  const [selectedSector, setSector] = useState(Config.listSectorType[0]);
  const [authList, setAuthList] = useState(Config.listAuthFlag);
  const [selectedAuthType, setAuthType] = useState(Config.listAuthFlag[0]);
  const [activeList, setActiveList] = useState(Config.listActiveFlag);
  const [selectedActive, setActive] = useState(Config.listActiveFlag[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [variantData, setVariantData] = useState([]);
  const [selectedInputType, setSelectedInputType] = useState([]);

  const OpenParentServiceAddPage = (data, metaData) => {
    history.push({
      pathname: `${url.replace('list', 'parent-service-add')}`,
      state: { edit: false, data, selectedCategory, selectedMovementType, selectedSector, metaData },
    });
  };

  const OpenParentServiceEditPage = (data, metaData) => {
    history.push({
      pathname: `${url.replace('list', 'parent-service-edit')}`,
      state: { edit: true, data: data.values, selectedCategory, selectedMovementType, selectedSector, metaData },
    });
  };

  const OpenServiceTablePage = (serviceDetail) => {
    history.push({
      pathname: `${url.replace('list', 'details')}`,
      state: {
        edit: false,
        category: serviceDetail,
        access_token: props.token.access_token
      }
    });
  };

  const OpenServiceDetailPage = (data, metaData) => {
    let inputType = [];
    selectedInputType && selectedInputType.forEach((item) => {
      if(item[data.values._id]) inputType.push(item[data.values._id]);
    });
    let tempObj = {
      _id: data.values._id,
      ancestors: [],
      isDeleted: false,
      servicename: data.values.servicename,
      serviceCategory: selectedCategory.categoryName,
      serviceCategoryId: selectedCategory._id,
      label: data.values.servicename,
      value: data.values._id,
      movementType: data.values.movementTypeClone,
      sector: data.values.sectorClone,
      selectedInputType: inputType
    };
    history.push({
      pathname: `${url.replace('list', 'details')}`,
      state: {
        edit: false,
        category: tempObj,
        access_token: props.token.access_token
      }
    });
  };

  useEffect(() => {
    getCategoryList();
  }, [])

  useEffect(() => {
    getServiceNameList();
  }, [selectedCategory])

  async function getCategoryList() {
    let apiResponse = await CallAPI.get(
        apiConfig.categoryList,
        {},
        props.token || ''
    );

    let responseObj = await apiResponse.json();

    if (200 === +responseObj.statusCode && 'success' === responseObj.status) {
    // responseObj.data && responseObj.data.forEach((x) => {
    //     x.createdOn = Util.dateFormat(x.createdOn);
    //     x.isActive = x.isActive === "Y" ? 'Active' : 'Inactive';
    // });
    setcategoryList(responseObj.data);
    setSelectedCategory(responseObj.data[0]);
    // responseObj.data.map((item, index) => {
    //   if(index)
    // })
    } else {
    PushAlert.error(responseObj.message || responseObj.status);
    }
  }

  async function getServiceNameList() {
    let query = {};
    if(selectedCategory.label !== undefined && selectedCategory.label !== '') {
      query.serviceCategoryId = selectedCategory._id;
    }
    let apiResponse = await CallAPI.get(apiConfig.serviceList, query, props.token);

    let responseObj = await apiResponse.json();
    let tempList = [{ value: 'View All', label: 'View All' }];
    if (200 === +responseObj.statusCode && 'success' === responseObj.status) {
      responseObj.data.forEach(element => {
        tempList.push({ value: element._id, label: element.servicename })
      });
      setServiceList(tempList);
      setSelectedService({ value: 'View All', label: 'View All'});
    } else {
    PushAlert.error(responseObj.message || responseObj.status);
    }
  }

  useEffect(() => {
    getFilteredServiceList();
  }, [selectedCategory, selectedService, selectedMovementType, selectedSector, selectedActive, selectedAuthType]);

  async function getFilteredServiceList() {
    try {
      setIsLoading(true);
      let query = {};
      if(selectedCategory.label !== undefined && selectedCategory.label !== '') {
        query.serviceCategoryId = selectedCategory._id;
      }
      if(selectedService.label !== 'View All') {
        query.servicename = selectedService.label;
      }
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

      
        let apiResponse = await CallAPI.get(apiConfig.serviceList, query, props.token);
        let responseObj = await apiResponse.json();

        if (200 === +responseObj.statusCode && 'success' === responseObj.status) {
        let movementIndex = 0;
        let sectorIndex = 0;

        let inputTypeClone = [];
        let responseArr = [];
        responseArr = Array.isArray(responseObj.data) ? responseObj.data : [];
        responseArr.forEach((item, index) => {
          item.createdAtClone = Util.dateFormat(item.createdAt);
          item.authFlagClone = item.authFlag ? 'Approved' : 'Pending';
          item.activeFlagClone = item.activeFlag ? 'Active' : 'Inactive';
          item.sectorClone = item.sector;
          item.movementTypeClone = item.movementType;
          inputTypeClone.push( {[item._id]: item.qtyDrivenFields} );
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
        setSelectedInputType(inputTypeClone);
        setTableData(responseArr);
        setIsLoading(false);
      } else {
        PushAlert.error(responseObj.message || responseObj.status);
      }
    } catch(err) {
      setTableData([]);
      setIsLoading(false);
    }
  }

  const deleteService = async (arg) => {
    if (window.confirm('Are you sure? This change is not reversible!')) {
        let apiResponse = await CallAPI.delete(
          apiConfig.deleteService,
          {
            id: arg.values._id,
          },
          props.token || ''
        );
  
        let responseObj = await apiResponse.json();
  
        if (200 === +responseObj.statusCode && 'success' === responseObj.status) {
          PushAlert.success(responseObj.message || responseObj.status);
          getFilteredServiceList();
        } else {
          PushAlert.error(responseObj.message || responseObj.status);
        }
    }
  }
  // useEffect(() => {
  //   async function loadServiceByCategory() {
  //     let apiResponse = await CallAPI.get(apiConfig.listServiceByCategory, {}, props.token);

  //     let responseObj = await apiResponse.json();
  //     if (200 === responseObj.statusCode && 'success' === responseObj.status) {
  //       setcategoryList(responseObj.data);
  //     } else {
  //       PushAlert.error(responseObj.message || responseObj.status);
  //     }
  //   }
  //   loadServiceByCategory();
  // }, []);

  return (
    <div className="service-table-screen">
      <div className="service-table-dropdown">
        <StaticDropdown 
          title={'Category'} 
          width={'25%'} 
          selectedValue={selectedCategory} 
          valueSetter={setSelectedCategory} 
          valueList={categoryList} 
        />
        <StaticDropdown 
          title={'Service'} 
          width={'25%'} 
          selectedValue={selectedService} 
          valueSetter={setSelectedService} 
          valueList={serviceList} 
        />
        <StaticDropdown
          title={'Movement Type'}
          valueList={movementList}
          width={'25%'}
          placeholder={'Select Moment...'}
          selectedValue={selectedMovementType}
          valueSetter={setMovementType}
          lineHeight="20px"
          textWidth="4rem"
        />
        <StaticDropdown
          title={'Sector'}
          valueList={sectorList}
          width={'25%'}
          placeholder={'Select Sector...'}
          selectedValue={selectedSector}
          valueSetter={setSector}
        />
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
            onClick={(e) => OpenParentServiceAddPage()}
            width={'230px'}
            margin={'0 1%'}
          >
            <div className="image"></div>
            <div style={{ margin: '2px' }}>Add New Service</div>
          </Button>
        </div>
      </div>
      <hr className="dashed-hr" />
      <div className="servicelist-table">
        <ServiceListingTable
          config={serviceListingConfig}
          data={tableData}
          tableClass={'service-table'}
          actionType={'editOrDelete'}
          onInfo={null}
          onEdit={OpenParentServiceEditPage}
          onDownload={null}
          onEnter={OpenServiceDetailPage}
          onDelete={deleteService}
          maxPage={0}
          pageCount={0}
          sorting={false}
          renderEnterButton={true}
          fromVariantsTable={false}
        />
      </div>
      {/* <div className="add-new-services-new">
        <Button
          height="40px"
          gradient="0deg, #61c3de 0%,  #35c17a 0%, #3fd488 50%"
          className="add-service-button"
          fontSize="20px"
          onClick={(e) => OpenParentServiceAddPage()}
          width={'240px'}
          margin={'0 1%'}
        >
          <div className="image"></div>
          <div style={{ margin: '3px' }}>Add New Service</div>
        </Button>
      </div> */}
      {/* <div className="form-list-category">
        {categoryList.map((ct) => (
          <div className="form-list">
            <div className="form-list-header">{ct.categoryName}</div>
            <ul className="form-list-form">
              {ct.serviceData.map((tt, index) => {
                if (index < 10) {
                  return (
                    <li className="anc" onClick={(e) => OpenServiceTablePage(tt)}>
                      {tt.servicename}
                    </li>
                  );
                } else if (index == 10) {
                  return (
                    <li className="anc" onClick={(e) => OpenServiceTablePage(tt)}>
                      ...+{ct.serviceData.length - 10} more
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        ))}
      </div> */}
    </div>
  );
}
