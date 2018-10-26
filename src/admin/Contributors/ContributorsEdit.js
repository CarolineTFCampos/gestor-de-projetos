import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import message from 'antd/lib/message'

import Title from '../../components/Title'
import AdminLayout from '../../components/AdminLayout'

import ContributorsForm from './ContributorsForm'

class ContributorsEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    try {
      await this.props.mutate({
        variables: {
          id: values.id,
          data: {
            name: values.name,
            email: values.email,
            doc: values.doc,
            price: values.price
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
          <h2>Editar Colaborador</h2>

          <Link to="/admin/contributors">Voltar</Link>
        </Title>

        {this.props.data && this.props.data.loading && 'Loading'}
        {this.props.data &&
          this.props.data.contributor && (
            <ContributorsForm
              onSubmit={this.handleSubmit}
              initialValues={this.props.data.contributor}
            />
          )}
      </AdminLayout>
    )
  }
}

const GET_CONTRIBUTOR = gql`
  query GetContributor($id: ID!) {
    contributor(where: { id: $id }) {
      id
      name
      email
      doc
      price
      active
      createdAt
      updatedAt
      experiences {
        id
        name
        company
        description
        startAt
        endAt
        createdAt
        updatedAt
      }
      formations {
        id
        name
        institution
        description
        startAt
        endAt
        createdAt
        updatedAt
      }
    }
  }
`

const UPDATE_CONTRIBUTOR = gql`
  mutation UpdateContributor($id: ID!, $data: ContributorUpdateInput!) {
    updateContributor(where: { id: $id }, data: $data) {
      id
      name
      doc
      email
      price
      createdAt
      updatedAt
    }
  }
`

const withGraphql = compose(
  graphql(GET_CONTRIBUTOR, {
    options: function(props) {
      return {
        variables: {
          id: props.match.params.id
        }
      }
    }
  }),
  graphql(UPDATE_CONTRIBUTOR)
)

export default withGraphql(ContributorsEdit)
