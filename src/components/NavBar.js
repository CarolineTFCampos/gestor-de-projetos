import React, { Component } from 'react'

import { withRouter } from 'react-router'

import Icon from 'antd/lib/icon'
// import Divider from 'antd/lib/divider'
import { Header } from 'antd/lib/layout'

const styles = {
  header: {
    background: '#272838',
    padding: '0 24px',
    borderBottom: '1px solid #ccc'
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
  }
  // divider: {
  //   color: '#3c3c3c',
  //   margin: '0 20px'
  // }
}

class NavBar extends Component {
  constructor(props) {
    super(props)

    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogout() {
    localStorage.removeItem('gestor__token')
    this.props.history.push('/auth')
  }

  render() {
    return (
      <Header style={styles.header} type="flex">
        <div style={styles.optionMenu}>
          {/* <Icon style={styles.menus} type='user' />
          <Divider style={styles.divider} type="vertical" />
          <Icon style={styles.menus} type='setting' /> */}
          <Icon
            style={styles.menus}
            type="logout"
            onClick={this.handleLogout}
          />
        </div>
      </Header>
    )
  }
}

export default withRouter(NavBar)
