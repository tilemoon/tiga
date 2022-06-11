import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import globalCtx from '~/context/global'

export default () => {
  const { theme, setTheme } = React.useContext(globalCtx)
  const navigate = useNavigate()

  return <div>
    HOME
    Theme: {theme}
    <br />
    <button onClick={() => setTheme('dark')}>set dark theme</button>
    <button onClick={() => navigate('/foo')}>to page foo</button>
  </div>
}
