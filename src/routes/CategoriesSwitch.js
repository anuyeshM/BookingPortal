import React, { useState ,useContext, useEffect, useMemo } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import CategoryList from '../components/content/services/subcomponent/categoryMaster/categoryList';
import CategoryForm from '../components/form/subcomponent/addEditCategoryForm';

export default function CategoriesSwitch(props) {
  const { path } = useRouteMatch();

  return (
    <Switch>
        <Route path={`${path}/list`}>
            <CategoryList {...props} />
        </Route>
        <Route path={`${path}/booknow`}>
            <CategoryForm {...props} />
        </Route>
        <Route path={`${path}/edit`}>
            <CategoryForm {...props} />
        </Route>
      <Redirect from={path} to={`${path}/list`} />
    </Switch>
  );
};
