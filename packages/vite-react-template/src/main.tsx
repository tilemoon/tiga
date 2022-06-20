import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { GlobalCtxProvider } from '~/context/global'

import App from './App'

const appContainer = document.querySelector('#app')

if (appContainer) {
  const root = createRoot(appContainer)
  root.render(<GlobalCtxProvider><App /></GlobalCtxProvider>)
} else {
  // app container not founded.
}
