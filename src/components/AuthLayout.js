import React from 'react'

const style = {
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  box: {
    width: '300px'
  }
}

function AuthLayout(props) {
  return (
    <div style={style.container}>
      <div style={style.box}>{props.children}</div>
    </div>
  )
}

export default AuthLayout
