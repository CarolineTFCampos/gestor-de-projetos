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
  render() {
    const contentStyle = this.props.hasFooter
      ? {
          ...style.content,
          marginBottom: '62px'
        }
      : style.content

    return (
      <Layout>
        <SideBar />

        <Layout>
          <NavBar />

          <Content style={contentStyle}>{this.props.children}</Content>
        </Layout>
      </Layout>
    )
  }
}

export default AdminLayout
