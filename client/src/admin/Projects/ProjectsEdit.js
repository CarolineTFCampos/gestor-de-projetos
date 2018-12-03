import React, { Component } from 'react'

import moment from 'moment'

import { Link } from 'react-router-dom'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import message from 'antd/lib/message'

import Title from '../../components/Title'
import Loading from '../../components/Loading'

import ProjectsForm from './ProjectsForm'

/**
 * Componente responsável por exibir o crud de Projects
 * e executar metodos de alteracao e criacao
 */
class ProjectsEdit extends Component {
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
            sponsor: values.sponsor,
            objectives: values.objectives,
            motivations: values.motivations,
            limitations: values.limitations,
            restrictions: values.restrictions,
            status: values.status,
            startAt: values.startAt.format(),
            endAt: values.endAt.format(),
            epics: [],
            lifecycle: values.lifecycle,
            projectRoles: []
          }
        },
        refetchQueries: ['GetProjects', 'GetProject']
      })

      // Exibe mensagem de sucesso
      message.success(`Projeto (${values.name}) atualizado com sucesso`)

      // Redireciona para lista
      this.props.history.push('/admin/projects')
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
          <h2>Editar Projeto</h2>

          <Link to="/admin/projects">Voltar</Link>
        </Title>

        {this.props.data && this.props.data.loading && <Loading />}
        {this.props.data && this.props.data.project && (
          <ProjectsForm
            onSubmit={this.handleSubmit}
            initialValues={{
              ...this.props.data.project,
              startAt: moment(this.props.data.project.startAt),
              endAt: moment(this.props.data.project.endAt)
            }}
          />
        )}
      </>
    )
  }
}

// Contem o script para realizar o login, retornar usuario e token de autenticação
const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(where: { id: $id }) {
      id
      name
      sponsor
      status
      startAt
      endAt
      objectives
      motivations
      limitations
      restrictions
      createdAt
      updatedAt
    }
  }
`

const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $data: ProjectUpdateInput!) {
    updateProject(where: { id: $id }, data: $data) {
      id
      name
      sponsor
      status
      startAt
      endAt
      objectives
      motivations
      limitations
      restrictions
      createdAt
      updatedAt
    }
  }
`

const withGraphql = compose(
  graphql(GET_PROJECT, {
    options: function(props) {
      return {
        variables: {
          id: props.match.params.id
        }
      }
    }
  }),
  graphql(UPDATE_PROJECT)
)

export default withGraphql(ProjectsEdit)
