import React, { Component } from 'react'

import { Link } from 'react-router-dom'

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
  constructor(props) {
    // Passa as props para a classe pai Component
    super(props)

    // Inicia estado do componente
    this.state = {
      // Responsavel por não exibir loader no botao de login ao iniciar a aplicaçao
      openKey: ['3']
    }

    this.handleOpenChange = this.handleOpenChange.bind(this)
  }

  //Abre um submenu ao clicar nela
  handleOpenChange(props) {
    console.log('BREAKPOINT: ' + props)
  }

  render() {
    return (
      <Sider
        trigger={null}
        collapsible={true}
        style={style.sider}
        collapsed={this.props.collapsed}
        breakpoint="lg"
        onBreakpoint={this.handleOpenChange(this)}
      >
        {/* LOGO */}
        <div>
          <a href="/">
            <img style={style.logo} src="/images/logo.png" alt="projects" />
          </a>
        </div>

        <Menu
          mode="inline"
          onOpenChange={this.handleOpenChange}
          defaultSelectedKeys={['1']}
        >
          <ItemGroup title="Cadastros">
            <MenuItem key="1">
              <Link to="/admin/home">
                <Icon type="dashboard" theme="outlined" />
                <span>Home</span>
              </Link>
            </MenuItem>

            <SubMenu
              key="3"
              title={
                <span>
                  <Icon type="plus-circle" />
                  <span>Cadastros</span>
                </span>
              }
            >
              <MenuItem key="4">
                <Link to="/admin/roles">
                  <Icon type="solution" theme="outlined" />
                  <span>Papéis</span>
                </Link>
              </MenuItem>
              <MenuItem key="5">
                <Link to="/admin/contributors">
                  <Icon type="team" theme="outlined" />
                  <span>Colaboradores</span>
                </Link>
              </MenuItem>
              <MenuItem key="6">
                <Link to="/admin/projects">
                  <Icon type="project" theme="outlined" />
                  <span>Projetos</span>
                </Link>
              </MenuItem>
            </SubMenu>
            <SubMenu
              key="8"
              title={
                <span>
                  <Icon type="project" />
                  <span>Projetos</span>
                </span>
              }
            >
              <MenuItem key="9">Nome Projeto 1</MenuItem>
              <MenuItem key="10">Nome Projeto 2</MenuItem>
            </SubMenu>
          </ItemGroup>
          <ItemGroup title="Projetos">
            <MenuItem key="9">Nome Projeto 1</MenuItem>
            <MenuItem key="10">Nome Projeto 2</MenuItem>
          </ItemGroup>
        </Menu>
      </Sider>
    )
  }
}

export default SideBar
