import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import Icon from 'antd/lib/icon'
import Card from 'antd/lib/card'
import Table from 'antd/lib/table'
import Button from 'antd/lib/button'
import Popconfirm from 'antd/lib/popconfirm'
import ButtonGroup from 'antd/lib/button/button-group'
import message from 'antd/lib/message'

import Title from '../../components/Title'
import AdminLayout from '../../components/AdminLayout'

class ProjectsList extends Component {
  constructor(props) {
    super(props)

    const self = this

    this.columns = [
      {
        key: 'name',
        title: 'Nome',
        dataIndex: 'name'
      },
      {
        key: 'startAt',
        title: 'Dt Início',
        dataIndex: 'startAt',
        align: 'right'
      },
      {
        key: 'endAt',
        title: 'Dt Fim',
        dataIndex: 'endAt',
        align: 'right'
      },
      {
        key: 'action',
        title: 'Ações',
        align: 'right',
        render: function(text, record) {
          return (
            <span>
              <ButtonGroup>
                <Button
                  icon="edit"
                  onClick={function() {
                    self.handleEdit(record.id)
                  }}
                />

                <Popconfirm
                  placement="topRight"
                  title="Tem certeza que deseja deletar?"
                  okText="Sim"
                  cancelText="Não"
                  onConfirm={function() {
                    self.handleDelete(record.id)
                  }}
                >
                  <Button type="danger" icon="delete" />
                </Popconfirm>
              </ButtonGroup>
            </span>
          )
        }
      }
    ]

    this.handleDelete = this.handleDelete.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
  }

  async handleDelete(id) {
    try {
      await this.props.mutate({
        variables: {
          id
        },
        refetchQueries: ['GetProjects']
      })

      // Exibe mensagem de sucesso
      message.success(`Projeto deletado com sucesso`)
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }

    return true
  }

  handleEdit(id) {
    this.props.history.push(`/admin/projects/${id}`)
  }

  render() {
    return (
      <AdminLayout>
        <Title>
          <h2>Lista de Projetos</h2>

          <Link to="/admin/projects/create">
            <Button type="primary">
              <Icon type="plus" theme="outlined" />
              <span>Novo Projeto</span>
            </Button>
          </Link>
        </Title>

        <Card>
          <Table
            rowKey="id"
            columns={this.columns}
            dataSource={this.props.data.projects || []}
            loading={this.props.data.loading}
          />
        </Card>
      </AdminLayout>
    )
  }
}

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      startAt
      endAt
      sponsor
    }
  }
`

const DELETE_PROJECTS = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(where: { id: $id }) {
      id
    }
  }
`

const withGraphql = compose(
  graphql(GET_PROJECTS),
  graphql(DELETE_PROJECTS)
)

export default withGraphql(ProjectsList)
