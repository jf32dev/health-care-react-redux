import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppFooter,
  AppHeader,
  AppSidebar,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';

import Header from './header';
import Footer from './footer';
// sidebar nav config
import { AdminMenus, Menus, SupporterMenus } from './nav';
// routes config
import { DoctorRoutes, PatientRoutes, AdminRoutes } from '../routes';

class Layout extends Component {
  render() {
    const { isLoggedin, me, is_admin, ...props } = this.props
    if (!isLoggedin || !me) {
      return (
        <Redirect
          to={{
            pathname: is_admin ? '/admin-login' : '/login',
            state: { from: this.props.location }
          }} />
      )
    }
		const routes = is_admin ? AdminRoutes : me.type === 0 ? PatientRoutes : DoctorRoutes;
    return (
      <div className="app">
        <AppHeader fixed>
          <Header/>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarNav navConfig={is_admin ? AdminMenus : me.type === 1 ? Menus : SupporterMenus} {...props} router={router}/>
          </AppSidebar>
          <main className="main">
						<AppBreadcrumb appRoutes={routes} router={router} className="layout-breadcrumb"/>
            <Container fluid className="main-body">
              <Switch>
                {routes.map((route, idx) => {
                  return route.component ? (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={props => <route.component {...props} /> } />
                  ) : (null);
                })}
                <Redirect from="/" to={ is_admin ? "/admin/articles" : me.type === 1 ? "/admin/chat" : "/admin/health"} />
              </Switch>
            </Container>
          </main>
        </div>
        <AppFooter>
          <Footer />
        </AppFooter>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedin: state.auth.loggedin,
		me: state.auth.me,
		is_admin: state.auth.is_admin
  }
}

export default connect(mapStateToProps, {})(Layout);
