import React from 'react'

import { Header } from 'antd/lib/layout'

const mainStyle = {
  margin: '0 0 10px 0',
  padding: '0',
  backgroundColor: 'transparent',
  display: 'flex',
  justifyContent: 'space-between'
}

function Titile({ children, style = {}, ...rest }) {
  return (
    <Header style={{ ...mainStyle, ...style }} {...rest}>
      {children}
    </Header>
  )
}

export default Titile
