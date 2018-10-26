import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import message from 'antd/lib/message'

import Title from '../../components/Title'
import AdminLayout from '../../components/AdminLayout'

import RolesForm from './RolesForm'

/**
 * Componente responsável por exibir o crud de Roles
 * e executar metodos de alteracao e criacao
 */
class RolesEdit extends Component {
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
          id: values.id,
          data: {
            name: values.name,
            description: values.description,
            department: values.department,
            roleLevels: {
              update: values.roleLevels.map(function(item) {
                return {
                  where: {
                    id: item.id
                  },
                  data: {
                    level: item.level,
                    experience: item.experience,
                    priceMin: item.priceMin,
                    priceMax: item.priceMax
                  }
                }
              })
            }
          }
        },
        refetchQueries: ['GetRoles']
      })

      // Exibe mensagem de sucesso
      message.success(`Papel (${values.name}) atualizado com sucesso`)

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

        {this.props.data && this.props.data.loading && 'Loading'}
        {this.props.data &&
          this.props.data.role && (
            <RolesForm
              onSubmit={this.handleSubmit}
              initialValues={this.props.data.role}
            />
          )}
      </AdminLayout>
    )
  }
}

// Contem o script para realizar o login, retornar usuario e token de autenticação
const GET_ROLE = gql`
  query GetRole($id: ID!) {
    role(where: { id: $id }) {
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

const UPDATE_ROLE = gql`
  mutation UpdateRole($id: ID!, $data: RoleUpdateInput!) {
    updateRole(where: { id: $id }, data: $data) {
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

const withGraphql = compose(
  graphql(GET_ROLE, {
    options: function(props) {
      return {
        variables: {
          id: props.match.params.id
        }
      }
    }
  }),
  graphql(UPDATE_ROLE)
)

export default withGraphql(RolesEdit)
