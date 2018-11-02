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

class ContributorsList extends Component {
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
        key: 'doc',
        title: 'CPF',
        dataIndex: 'doc'
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
        refetchQueries: ['GetContributors']
      })

      // Exibe mensagem de sucesso
      message.success(`Colaborador deletado com sucesso`)
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }

    return true
  }

  handleEdit(id) {
    this.props.history.push(`/admin/contributors/${id}`)
  }

  render() {
    return (
      <>
        <Title>
          <h2>Lista de Colaboradores</h2>

          <Link to="/admin/contributors/create">
            <Button type="primary">
              <Icon type="plus" theme="outlined" />
              <span>Novo Colaborador</span>
            </Button>
          </Link>
        </Title>

        <Card>
          <Table
            rowKey="id"
            columns={this.columns}
            dataSource={this.props.data.contributors || []}
            loading={this.props.data.loading}
          />
        </Card>
      </>
    )
  }
}

const GET_CONTRIBUTORS = gql`
  query GetContributors {
    contributors {
      id
      name
      doc
      email
      price
    }
  }
`

const DELETE_CONTRIBUTORS = gql`
  mutation DeleteContributor($id: ID!) {
    deleteContributor(where: { id: $id }) {
      id
    }
  }
`

const withGraphql = compose(
  graphql(GET_CONTRIBUTORS),
  graphql(DELETE_CONTRIBUTORS)
)

export default withGraphql(ContributorsList)
