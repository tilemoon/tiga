import * as React from 'react'
import { Outlet } from 'react-router'

const BaseLayout: React.FC<{}> = () => {
  return <>
    <Outlet />
  </>
}

export default BaseLayout
