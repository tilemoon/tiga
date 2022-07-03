import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import globalCtx from '~/context/global'

import useLock from '@tilemoon/use-lock'

export default () => {
  const { theme, setTheme } = React.useContext(globalCtx)
  const navigate = useNavigate()
  const lock = useLock()
  const [data, setData] = React.useState("no data")

  const fetchData = React.useCallback(async () => {
    console.log('fetch data')
    await new Promise((resolve) => {
      setTimeout(() => {
        setData("fakeData")
        resolve(null)
      }, 2000)
    })
  }, [])

  return <div>
    HOME
    Theme: {theme}
    <br />
    <button onClick={() => setTheme('dark')}>set dark theme</button>
    <button onClick={() => lock.run(fetchData)}>fetch data  fetching: {lock.locked.toString()}</button>
    <button onClick={() => navigate('/foo')}>to page foo</button>
  </div>
}
