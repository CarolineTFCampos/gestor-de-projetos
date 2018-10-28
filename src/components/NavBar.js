import React, { Component } from 'react'
import Divider from 'antd/lib/divider'
import Icon from 'antd/lib/icon'
import { Header } from 'antd/lib/layout'
// import Row from 'antd/lib/row'
// import Col from 'antd/lib/col'

const styles = {
  header: {
    background: '#272838',
    padding: '0 24px',
    borderBottom: '1px solid #ccc'
  },
  trigger: {
    fontSize: '18px',
    lineHeight: '64px',
    cursor: 'pointer',
    color: '#fff',
    transition: 'color .3s'
  },
  optionMenu: {
    textAlign: 'right',
    float: 'right',
    height: '100%'
  },
  menus: {
    fontSize: '20px',
    lineHeight: '64px',
    cursor: 'pointer',
    color: '#fff',
    transition: 'color .3s'
  },
  divider: {
    color: '#3c3c3c',
    margin: '0 20px'
  }
}

class NavBar extends Component {
  render() {
    return (
      <Header style={styles.header} type="flex">
        <Icon
          style={styles.trigger}
          type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.props.toggle}
        />

        <div style={styles.optionMenu}>
          <Icon
            style={styles.menus}
            type={'user'}
            // onClick={this.props.new}
          />
          <Divider style={styles.divider} type="vertical" />
          <Icon
            style={styles.menus}
            type={'setting'}
            // onClick={this.props.new}
          />
        </div>
      </Header>
    )
  }
}

export default NavBar
