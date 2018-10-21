import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import message from 'antd/lib/message'

import Title from '../../components/Title'
import AdminLayout from '../../components/AdminLayout'

import ContributorForm from './ContributorForm'

const initialValues = {
  experiences: [],
  formations: []
}

/**
 * Componente responsável por exibir o crud de Roles
 * e executar metodos de alteracao e criacao
 */
class ContributorsCreate extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    try {
      await this.props.mutate({
        variables: {
          data: {
            ...values
          }
        },
        refetchQueries: ['GetContributors']
      })

      // Exibe mensagem de sucesso
      message.success(`Colaborador (${values.name}) criado com sucesso`)

      // Redireciona para lista
      this.props.history.push('/admin/contributors')
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
          <h2>Cadastro de Colaborador</h2>

          <Link to="/admin/contributors">Voltar</Link>
        </Title>

        <ContributorForm
          onSubmit={this.handleSubmit}
          initialValues={initialValues}
        />
      </AdminLayout>
    )
  }
}

// Contem o script para realizar o login, retornar usuario e token de autenticação
const CREATE_CONTRIBUTOR = gql`
  mutation CreateContributor($data: ContributorCreateInput!) {
    createContributor(data: $data) {
      id
      name
      email
      doc
      price
      active
    }
  }
`

const withGraphql = graphql(CREATE_CONTRIBUTOR)

export default withGraphql(ContributorsCreate)
