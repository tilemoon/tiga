import * as React from 'react'
import { renderRoutes } from 'react-router-config'

import globalCtx from '~/context/global'
import routes from '~/routes'

import './App.less'

const App: React.FC<{}> = () => {
  const { user, setUser } = React.useContext(globalCtx)

  setTimeout(() => {
    setUser({
      id: 1,
      name: 'whatever',
    })
  }, 2000)

  if (!user) return <>'no User'</>

  return <>
    {renderRoutes(routes)}
  </>
}

export default App
