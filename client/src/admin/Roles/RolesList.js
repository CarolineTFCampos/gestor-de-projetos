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

class RolesList extends Component {
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
        key: 'department',
        title: 'Departamento',
        dataIndex: 'department'
      },
      {
        key: 'action',
        title: 'Ações',
        align: 'right',
        width: 130,
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
        refetchQueries: ['GetRoles']
      })

      // Exibe mensagem de sucesso
      message.success(`Papel deletado com sucesso`)
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }

    return true
  }

  handleEdit(id) {
    this.props.history.push(`/admin/roles/${id}`)
  }

  render() {
    return (
      <>
        <Title>
          <h2>Lista de Papeis</h2>

          <Link to="/admin/roles/create">
            <Button type="primary">
              <Icon type="plus" theme="outlined" />
              <span>Novo Papel</span>
            </Button>
          </Link>
        </Title>

        <Card>
          <Table
            rowKey="id"
            columns={this.columns}
            dataSource={this.props.data.roles || []}
            loading={this.props.data.loading}
            pagination={false}
          />
        </Card>
      </>
    )
  }
}

const GET_ROLES = gql`
  query GetRoles {
    roles {
      id
      name
      department
    }
  }
`

const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(where: { id: $id }) {
      id
    }
  }
`

const withGraphql = compose(
  graphql(GET_ROLES),
  graphql(DELETE_ROLE)
)

export default withGraphql(RolesList)
