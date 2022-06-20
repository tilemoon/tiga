import * as React from 'react'

import globalCtx from '~/context/global'
import { Route, Routes, Navigate } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import BaseLayout from '~/BaseLayout'

import './App.less'

const Home = React.lazy(() => import('~/pages/home'))
const Foo = React.lazy(() => import('~/pages/foo'))

const App: React.FC<{}> = () => {
  const { user, setUser } = React.useContext(globalCtx)

  setTimeout(() => {
    setUser({
      id: 1,
      name: 'whatever',
    })
  }, 2000)

  return <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/home" replace />}
      />
      <Route path="/" element={<BaseLayout />}>
        <Route path="home" element={
          <React.Suspense fallback={<>load failed</>}>
            <Home />
          </React.Suspense>
        } />
        <Route path="foo" element={<React.Suspense fallback={<>load failed</>}>
          <Foo />
        </React.Suspense>} />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default App
