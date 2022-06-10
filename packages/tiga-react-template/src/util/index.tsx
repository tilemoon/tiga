import * as React from 'react'

export const lazyLoad = (module: Promise<{ default: any }>): React.FC<any> => {
  const Comp = React.lazy(() => module)

  return (props) => {
    return <React.Suspense fallback={<>load failed</>}>
      <Comp {...props} />
    </React.Suspense>
  }
}
