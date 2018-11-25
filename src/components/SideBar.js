import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import Icon from 'antd/lib/icon'
import { Sider } from 'antd/lib/layout'
import Menu, { Item as MenuItem, SubMenu, ItemGroup } from 'antd/lib/menu'

const style = {
  logo: {
    height: '38px',
    margin: '16px'
  },

  sider: {
    minHeight: '100vh',
    background: '#fff',
    borderRight: '1px solid #ccc',
    zIndex: '10'
  }
}

class SideBar extends Component {
  render() {
    let activeMenu = this.props.location.pathname.split('/')[2]
    const activeSubmenu = ['roles', 'contributors', 'projects'].includes(
      activeMenu
    )
      ? 'cruds'
      : ''

    if (activeMenu === 'project') {
      activeMenu = `${activeMenu}-${this.props.location.pathname.split('/')[3]}`
    }

    return (
      <Sider
        trigger={null}
        collapsible={true}
        style={style.sider}
        collapsed={this.props.collapsed}
      >
        {/* LOGO */}
        <div>
          <a href="/">
            <img
              style={style.logo}
              src="/images/logo.png"
              alt="Gestor de Projetos"
            />
          </a>
        </div>

        <Menu
          mode="inline"
          defaultOpenKeys={[activeSubmenu]}
          defaultSelectedKeys={[activeMenu]}
        >
          <MenuItem key="home">
            <Link to="/admin/home">
              <Icon type="dashboard" theme="outlined" />
              <span>Dashboard</span>
            </Link>
          </MenuItem>

          <SubMenu
            key="cruds"
            title={
              <span>
                <Icon type="plus-circle" />
                <span>Cadastros</span>
              </span>
            }
          >
            <MenuItem key="roles">
              <Link to="/admin/roles">
                <Icon type="solution" theme="outlined" />
                <span>Papéis</span>
              </Link>
            </MenuItem>
            <MenuItem key="contributors">
              <Link to="/admin/contributors">
                <Icon type="team" theme="outlined" />
                <span>Colaboradores</span>
              </Link>
            </MenuItem>
            <MenuItem key="projects">
              <Link to="/admin/projects">
                <Icon type="project" theme="outlined" />
                <span>Projetos</span>
              </Link>
            </MenuItem>
          </SubMenu>

          <ItemGroup title="Projetos">
            {(this.props.data.projects || []).map(function(item) {
              return (
                <MenuItem key={`project-${item.id}`}>
                  <Link to={`/admin/project/${item.id}`}>{item.name}</Link>
                </MenuItem>
              )
            })}
          </ItemGroup>
        </Menu>
      </Sider>
    )
  }
}

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
    }
  }
`

const withGraphql = graphql(GET_PROJECTS)

export default withGraphql(withRouter(SideBar))
