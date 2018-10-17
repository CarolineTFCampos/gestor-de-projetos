import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import message from 'antd/lib/message'

import Title from '../../components/Title'
import AdminLayout from '../../components/AdminLayout'

import RoleForm from './RoleForm'

const roleLevelTypes = ['TRAINEE', 'JUNIOR', 'INTERMEDIATE', 'SENIOR', 'EXPERT']

const initialValues = {
  roleLevels: roleLevelTypes.map(function(level) {
    return {
      level,
      priceMin: 0,
      priceMax: 0
    }
  })
}

/**
 * Componente responsável por exibir o crud de Roles
 * e executar metodos de alteracao e criacao
 */
class RolesCreate extends Component {
  constructor(props) {
    // Passa as props para a classe pai Component
    super(props)

    // Força a referencia do this para a classe
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    try {
      await this.props.mutate({
        variables: {
          data: {
            ...values,
            roleLevels: {
              create: values.roleLevels
            }
          }
        },
        refetchQueries: ['GetRoles']
      })

      // Exibe mensagem de sucesso
      message.success(`Papel (${values.name}) criado com sucesso`)

      // Redireciona para lista
      this.props.history.push('/admin/roles')
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }

    return true
  }

  render() {
    return (
      <AdminLayout hasFooter={true}>
        <Title>
          <h2>Cadastro de Papeis</h2>

          <Link to="/admin/roles">Voltar</Link>
        </Title>

        <RoleForm onSubmit={this.handleSubmit} initialValues={initialValues} />
      </AdminLayout>
    )
  }
}

// Contem o script para realizar o login, retornar usuario e token de autenticação
const CREATE_ROLE = gql`
  mutation CreateRole($data: RoleCreateInput!) {
    createRole(data: $data) {
      id
      name
      description
      department
      createdAt
      updatedAt
      roleLevels {
        id
        level
        experience
        priceMin
        priceMax
        createdAt
        updatedAt
      }
    }
  }
`

const withGraphql = graphql(CREATE_ROLE)

export default withGraphql(RolesCreate)
