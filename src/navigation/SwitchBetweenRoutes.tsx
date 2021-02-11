import React from 'react';
import { Switch, Route } from "react-router-dom";
import {paths} from "../utilities";
import {Dashboard, NotFoundPage} from "../screens";

export const SwitchBetweenRoutes = () => {
    return (
        <Switch>
            <Route
                exact
                path={paths.dashboard}
                component={Dashboard}
                title="Dashboard"
                resourceName="managers"
            />
            <Route path="*">
                <NotFoundPage />
            </Route>
        </Switch>
    )
};
