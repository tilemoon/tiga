import * as React from 'react'
import { renderRoutes } from 'react-router-config'
import { rootRoute } from '~/routes'

const BaseLayout: React.FC<{}> = () => {
  return <>
    {renderRoutes(rootRoute.routes)}
  </>
}

export default BaseLayout