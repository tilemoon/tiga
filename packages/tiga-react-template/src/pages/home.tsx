import * as React from 'react'
import { useHistory } from 'react-router-dom'

import globalCtx from '~/context/global'

export default () => {
  const { theme, setTheme } = React.useContext(globalCtx)
  const history = useHistory()

  return <div>
    HOME
    Theme: {theme}
    <br />
    <button onClick={() => setTheme('dark')}>set dark theme</button>
    <button onClick={() => history.push('/foo')}>to page foo</button>
  </div>
}
