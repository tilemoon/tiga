import * as React from 'react'

type Theme = 'dark' | 'light'

interface UserInfo {
  id: number
  name: string
}

interface GlobalContextProps {
  user?: UserInfo
  setUser: (u: UserInfo) => void

  theme: Theme
  setTheme: (t: Theme) => void
}

// 这里不需要做初始化工作，初始化全部放在 wrapper 里面处理
const ctx = React.createContext<GlobalContextProps>({} as GlobalContextProps)

export const GlobalCtxProvider: React.FC<any> = ({ children }) => {
  const [theme, setTheme] = React.useState<Theme>('light')
  const [user, setUser] = React.useState<UserInfo>()

  return <ctx.Provider value={{
    user,
    theme,
    setUser,
    setTheme,
  }}>
    {children}
  </ctx.Provider>
}

export default ctx
