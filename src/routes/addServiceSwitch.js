import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ListServiceCategory from '../components/content/services/subcomponent/serviceCategoryList';
import AddEditServiceForm from '../components/form/form';
import AddEditCategoryForm from '../components/form/subcomponent/addEditCategoryForm';
import AddEditParentServiceForm from '../components/form/subcomponent/addEditParentService';
import ServiceTableList from '../components/content/services/subcomponent/serviceTableList';
import CategorySwitch from './CategoriesSwitch';

const AddServiceSwitch = (props) => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/list`}>
        <ListServiceCategory {...props} />
      </Route>
      <Route path={`${path}/add`}>
        <AddEditServiceForm {...props} />
      </Route>
      <Route path={`${path}/edit`}>
        <AddEditServiceForm {...props} />
      </Route>
      <Route path={`${path}/details`}>
        <ServiceTableList {...props} />
      </Route>
      {/* <Route path={`${path}/category`}>
        <AddEditCategoryForm {...props} />
      </Route> */}
      <Route path={`${path}/parent-service-add`}>
        <AddEditParentServiceForm {...props} />
      </Route>
      <Route path={`${path}/parent-service-edit`}>
        <AddEditParentServiceForm {...props} />
      </Route>
      <Route path={`${path}/categories`}>
        <CategorySwitch {...props} />
      </Route>
      <Redirect from={path} to={`${path}/list`} />
    </Switch>
  );
};

export default AddServiceSwitch;
