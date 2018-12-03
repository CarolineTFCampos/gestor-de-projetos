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
    const activeSubmenu = activeMenu === 'contributors' ? 'contributors' : ''

    if (activeMenu === 'project') {
      activeMenu = `${activeMenu}-${this.props.location.pathname.split('/')[3]}`
    }

    return (
      <Sider trigger={null} style={style.sider}>
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
          <MenuItem key="projects">
            <Link to="/admin/projects">
              <Icon type="project" theme="outlined" />
              <span>Projetos</span>
            </Link>
          </MenuItem>

          <MenuItem key="roles">
            <Link to="/admin/roles">
              <Icon type="solution" theme="outlined" />
              <span>Papéis</span>
            </Link>
          </MenuItem>

          <SubMenu
            key="contributors"
            title={
              <span>
                <Icon type="team" theme="outlined" />
                <span>Colaboradores</span>
              </span>
            }
          >
            <MenuItem key="contributors-crud">
              <Link to="/admin/contributors/crud">
                <Icon type="plus" />
                <span>Cadastro</span>
              </Link>
            </MenuItem>

            <MenuItem key="contributors-allocation">
              <Link to="/admin/contributors/allocation">
                <Icon type="sliders" />
                <span>Alocação</span>
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
