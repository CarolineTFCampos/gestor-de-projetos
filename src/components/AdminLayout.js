import React, { Component } from 'react'

import Layout, { Content } from 'antd/lib/layout'

import NavBar from './NavBar'
import SideBar from './SideBar'

const style = {
  content: {
    padding: '0 24px',
    background: '#edecec12',
    minHeight: '280px'
  }
}

class AdminLayout extends Component {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: false
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    const contentStyle = this.props.hasFooter
      ? {
          ...style.content,
          marginBottom: '62px'
        }
      : style.content

    return (
      <Layout>
        <SideBar collapsed={this.state.collapsed} />

        <Layout>
          <NavBar toggle={this.toggle} collapsed={this.state.collapsed} />

          <Content style={contentStyle}>{this.props.children}</Content>
        </Layout>
      </Layout>
    )
  }
}

export default AdminLayout
