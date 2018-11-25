import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import message from 'antd/lib/message'

import Title from '../../components/Title'

import ProjectsForm from './ProjectsForm'

/**
 * Componente responsável por exibir o crud de Projects
 * e executar metodos de alteracao e criacao
 */
class ProjectsCreate extends Component {
  constructor(props) {
    // Passa as props para a classe pai Component
    super(props)

    // Força a referencia do this para a classe
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    /**
     * a variavel values é todos os campos do teu form, pode dar conconsole.log nela para ver oque ta vindo
     * tudo que tem no data é oque via pro graphql, então tu tem que passar os valores que ele rpecisa
     */
    try {
      await this.props.mutate({
        variables: {
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
            features: [],
            lifecycle: values.lifecycle,
            projectRoles: []
          }
        },
        refetchQueries: ['GetProjects']
      })

      // Exibe mensagem de sucesso
      message.success(`Projeto (${values.name}) criado com sucesso`)

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
          <h2>Cadastro de Projeto</h2>

          <Link to="/admin/projects">Voltar</Link>
        </Title>

        <ProjectsForm onSubmit={this.handleSubmit} />
      </>
    )
  }
}

// Contem o script para realizar o login, retornar usuario e token de autenticação
const CREATE_PROJECT = gql`
  mutation CreateProject($data: ProjectCreateInput!) {
    createProject(data: $data) {
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

const withGraphql = graphql(CREATE_PROJECT)

export default withGraphql(ProjectsCreate)
