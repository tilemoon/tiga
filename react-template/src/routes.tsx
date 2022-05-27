import * as React from 'react'
import { Redirect } from 'react-router'
import { RouteConfig } from 'react-router-config'
import { lazyLoad } from '~/util'

export const rootRoute: RouteConfig = {
  path: '/',
  render: lazyLoad(import('~/BaseLayout')),
  routes: [
    {
      path: '/',
      exact: true,
      render: () => <Redirect to="/home" />,
    },
    {
      path: '/home',
      render: lazyLoad(import('~/pages/home')),
    },
    {
      path: '/foo',
      render: lazyLoad(import('~/pages/foo')),
    },
  ]
}

const routes: RouteConfig[] = [rootRoute]

export default routes
