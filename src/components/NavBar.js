import React, { Component } from 'react'

import Icon from 'antd/lib/icon'
import { Header } from 'antd/lib/layout'

const style = {
  trigger: {
    fontSize: '18px',
    lineHeight: '64px',
    padding: '0 24px',
    cursor: 'pointer',
    color: '#fff',
    transition: 'color .3s'
  },

  header: {
    background: '#1890ff',
    padding: 0,
    borderBottom: '1px solid #ccc'
  }
}

class NavBar extends Component {
  render() {
    return (
      <Header style={style.header}>
        <Icon
          style={style.trigger}
          type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.props.toggle}
        />
      </Header>
    )
  }
}

export default NavBar
