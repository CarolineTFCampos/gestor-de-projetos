import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import Icon from 'antd/lib/icon'
import { Sider } from 'antd/lib/layout'
import Menu, { Item as MenuItem, SubMenu } from 'antd/lib/menu'

const style = {
  logo: {
    height: '32px',
    background: 'rgba(0,0,0,.5)',
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
  handleOpenChange() {
    // openKeys
  }

  render() {
    return (
      <Sider
        trigger={null}
        collapsible={true}
        style={style.sider}
        collapsed={this.props.collapsed}
      >
        {/* LOGO */}
        <div style={style.logo} />

        <Menu
          mode="inline"
          onOpenChange={this.handleOpenChange}
          defaultSelectedKeys={['1']}
        >
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
              <Icon type="team" theme="outlined" />
              <span>Recursos Humanos</span>
            </MenuItem>
            <MenuItem key="6">
              <Icon type="project" theme="outlined" />
              <span>Projetos</span>
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
        </Menu>
      </Sider>
    )
  }
}

export default SideBar
