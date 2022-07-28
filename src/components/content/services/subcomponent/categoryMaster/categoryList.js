import React, { useState, useMemo, useEffect, useContext } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import CategoryTable from '../../../../../components/table/table';
import Config from '../../../../../commons/config';
import CallAPI from '../../../../../commons/callAPI';
import PushAlert from '../../../../../commons/notification';
import TblConfig from '../../../../../commons/tableConfig';
import Button from '../../../../../elements/button/action';
import PlusIcon from '../../../../../assets/images/pluse.png'
import Util from '../../../../../commons/util';
import Loader from '../../../../../commons/loader';
import StaticDropdown from '../../../../form/subcomponent/staticDropdown/staticDropdown';
import DateRangePickerComp from '../../../../datepicker/datepicker.jsx';


import './categories.css'
import { DateRangePicker } from 'react-datetime-range-super-picker';

export default function CategoryList(props) {
    const history = useHistory();
    const { url } = useRouteMatch();
    const TableConfig = useMemo(() => TblConfig.category, []);
    const apiConfig = useMemo(() => Config.api, []);

    const [isLoading, setLoading] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [metaData, setMetaData] = useState({});
    const [table,setTable] = useState("firstcard");

    const openAddCategoryForm = (data, metaData) => {
        history.push({
          pathname: `${url.replace('list', 'booknow')}`,
          state: { edit: false, data, metaData },
        });
    };

    const openEditCategoryForm = (data, metaData) => {
        history.push({
          pathname: `${url.replace('list', 'edit')}`,
          state: { edit: true, data: data.values, metaData },
        });
    };

    useEffect(() => {
        getCategoryList();
    }, []);

    async function getCategoryList() {
        let apiResponse = await CallAPI.get(
            apiConfig.categoryList,
            {},
            props.token || ''
        );

        let responseObj = await apiResponse.json();

        if (200 === +responseObj.statusCode && 'success' === responseObj.status) {
        responseObj.data && responseObj.data.forEach((x) => {
            if(x.createdAt !== undefined && x.activeFlag !== undefined) {
                x.createdAt = Util.dateFormat(x.createdAt);
                x.activeFlag = x.activeFlag ? 'Active' : 'Inactive';
            }
        });
        setCategoryList(responseObj.data);
        setLoading(false);
        }
         else {
        PushAlert.error(responseObj.message || responseObj.status);
        }
    }

    const deleteCategory = async (arg) => {
        if (window.confirm('Are you sure? This change is not reversible!')) {
            let apiResponse = await CallAPI.delete(
              apiConfig.deleteCategory,
              {
                id: arg.values._id,
              },
              props.token || ''
            );

            let responseObj = await apiResponse.json();

            if (200 === +responseObj.statusCode && 'success' === responseObj.status) {
              PushAlert.success(responseObj.message || responseObj.status);
              getCategoryList();
            } else {
              PushAlert.error(responseObj.message || responseObj.status);
            }
        }
    }

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {isLoading ? (
                <Loader />
            ) : (
              <div className="service-table-screen">

      <div className="add-edit-service">

        <div className="delivery-option">
          <StaticDropdown
            title={'Select Services'}

            width={'18rem'}

            textWidth="7rem"
            lineHeight="20px"
          />

        </div>

        <div className="subtitle-text">
         <DateRangePickerComp />
          </div>
          <div className='subtitle-text'>
                <input style={{'border-radius':'6px'}}
                  className='search_input'
                  type='text'
                  title='Select Services'
                  placeholder='Search Orders'
                  aria-label='Search'
                  spellCheck='false'

                />

              </div>



        <div className="add-new-services">

          <Button
            height="40px"
            gradient="0deg, #61c3de 0%,  #35c17a 0%, #3fd488 50%"
            className="add-service-button"
            fontSize="20px"
            onClick={(e) =>  setTable("secondcard")}
            width={'230px'}
            margin={'0 1%'}
          >
            <div className="image"></div>
            <div style={{ margin: '2px' }}>Add Booking</div>
          </Button>
        </div>
      </div>
      <hr className="dashed-hr" />
                    {/* <div className='sub-header'>
                        <PrimaryButton
                            width='150pt'
                            height='40pt'
                            fontColor='#fff'
                            onClick={(e) => openAddCategoryPage(null, metaData)}
                        >
                            <img src={PlusIcon} height='16pt' width='16pt' />
                            <div style={{ marginLeft: '5pt' }}>Add New Category</div>
                        </PrimaryButton>
                    </div> */}

                    <div className='categorylist-table'>
                    { table === "firstcard" &&
                        <CategoryTable
                            tableClass={'category-table'}
                            config={TableConfig}
                            data={categoryList}
                            metaData={metaData}
                            actionType={'editOrDelete'}
                            onInfo={null}
                            onEdit={openEditCategoryForm}
                            onDelete={deleteCategory}
                            onDownload={null}
                            isLoading={isLoading}
                            fromVariantsTable={false}
                        />
                      },
                      {
                        table === "secondcard" &&
                          <div>
                          <h1>hello</h1>
                          </div>
                      }

                    </div>


                </div>
            )}
        </div>
    )

}
