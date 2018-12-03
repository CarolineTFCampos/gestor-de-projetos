import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import message from 'antd/lib/message'

import Title from '../../components/Title'

import ContributorsForm from './ContributorsForm'

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
            ...values,
            experiences: {
              create: values.experiences.map(function(experience) {
                return {
                  ...experience,
                  startAt: experience.startAt.format(),
                  endAt: experience.endAt.format()
                }
              })
            },
            formations: {
              create: values.formations.map(function(formation) {
                return {
                  ...formation,
                  startAt: formation.startAt.format(),
                  endAt: formation.endAt.format()
                }
              })
            }
          }
        },
        refetchQueries: ['GetContributors']
      })

      // Exibe mensagem de sucesso
      message.success(`Colaborador (${values.name}) criado com sucesso`)

      // Redireciona para lista
      this.props.history.push('/admin/contributors/crud')
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
      <>
        <Title>
          <h2>Cadastro de Colaborador</h2>

          <Link to="/admin/contributors/crud">Voltar</Link>
        </Title>

        <ContributorsForm
          onSubmit={this.handleSubmit}
          initialValues={initialValues}
        />
      </>
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
      emailPrivate
      phone
      address
      doc
      price
      active
    }
  }
`

const withGraphql = graphql(CREATE_CONTRIBUTOR)

export default withGraphql(ContributorsCreate)
