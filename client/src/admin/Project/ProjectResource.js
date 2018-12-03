import React, { Component } from 'react'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Button from 'antd/lib/button'
import Popconfirm from 'antd/lib/popconfirm'
import ButtonGroup from 'antd/lib/button/button-group'
import message from 'antd/lib/message'

import { resourceTypeTranslate, formatMoney } from '../../utils'

import ModalResource from './ModalResource'

class ProjectResource extends Component {
  constructor(props) {
    super(props)

    this.state = {
      resource: null,
      modalResourceVisible: false
    }

    const self = this

    this.columns = [
      {
        key: 'name',
        dataIndex: 'name',
        title: 'Nome'
      },
      {
        key: 'type',
        dataIndex: 'type',
        title: 'Tipo',
        render: function(text) {
          return resourceTypeTranslate[text]
        }
      },
      {
        key: 'price',
        dataIndex: 'price',
        title: 'Preço',
        render: function(text) {
          return formatMoney(text)
        }
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
                    self.handleOpenModalResource(record)
                  }}
                />
                ​
                <Popconfirm
                  placement="topRight"
                  title="Tem certeza que deseja deletar?"
                  okText="Sim"
                  cancelText="Não"
                  onConfirm={function() {
                    self.handleDeleteResource(record)
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

    this.handleDeleteResource = this.handleDeleteResource.bind(this)
    this.handleOpenModalResource = this.handleOpenModalResource.bind(this)
    this.handleCloseModalResource = this.handleCloseModalResource.bind(this)
  }

  async handleDeleteResource(item) {
    try {
      await this.props.deleteResource({
        variables: {
          id: item.id
        },
        refetchQueries: ['GetProject']
      })

      // Exibe mensagem de sucesso
      message.success(`Recurso removido com sucesso`)
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }

    return true
  }

  handleOpenModalResource(item) {
    this.setState({
      resource: item,
      modalResourceVisible: true
    })
  }

  handleCloseModalResource() {
    this.setState({
      resource: null,
      modalResourceVisible: false
    })
  }

  render() {
    const self = this

    return (
      <div>
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <Button type="primary" onClick={() => self.handleOpenModalResource()}>
            <Icon type="plus" theme="outlined" />
            <span>Novo recurso</span>
          </Button>
        </div>

        <Table
          rowKey="id"
          columns={self.columns}
          dataSource={self.props.project.resources}
          pagination={false}
        />

        {self.state.modalResourceVisible && (
          <ModalResource
            item={self.state.resource}
            project={self.props.project}
            visible={self.state.modalResourceVisible}
            onClose={function() {
              self.handleCloseModalResource()
            }}
          />
        )}
      </div>
    )
  }
}

const DELETE_RESOURCE = gql`
  mutation DeleteResource($id: ID!) {
    deleteResource(where: { id: $id }) {
      id
    }
  }
`

const withGraphql = graphql(DELETE_RESOURCE, {
  name: 'deleteResource'
})

export default withGraphql(ProjectResource)
