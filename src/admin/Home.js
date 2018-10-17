import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import AdminLayout from '../components/AdminLayout'

/**
 * Componente responsável por exibir a interface de login
 * e executar metodos de autenticação
 */
class Home extends Component {
  render() {
    return (
      <AdminLayout>
        <h3>Esta na home</h3>
        <Link to="/admin/cadastro">cadastro</Link>
      </AdminLayout>
    )
  }
}

export default Home
