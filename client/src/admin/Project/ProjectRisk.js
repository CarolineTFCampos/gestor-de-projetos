import React, { Component } from 'react'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Button from 'antd/lib/button'
import Popconfirm from 'antd/lib/popconfirm'
import ButtonGroup from 'antd/lib/button/button-group'
import message from 'antd/lib/message'

import { riskStatusTranslate } from '../../utils'

import ModalRisk from './ModalRisk'

class ProjectRisk extends Component {
  constructor(props) {
    super(props)

    this.state = {
      risk: null,
      modalRiskVisible: false
    }

    const self = this

    this.columns = [
      {
        key: 'name',
        dataIndex: 'name',
        title: 'Nome'
      },
      {
        key: 'priority',
        dataIndex: 'priority',
        title: 'Prioridade'
      },
      {
        key: 'probability',
        dataIndex: 'probability',
        title: 'Probabilidade'
      },
      {
        key: 'impact',
        dataIndex: 'impact',
        title: 'Impacto'
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: 'Estado',
        render: function(text) {
          return riskStatusTranslate[text]
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
                    self.handleOpenModalRisk(record)
                  }}
                />
                ​
                <Popconfirm
                  placement="topRight"
                  title="Tem certeza que deseja deletar?"
                  okText="Sim"
                  cancelText="Não"
                  onConfirm={function() {
                    self.handleDeleteRisk(record)
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

    this.handleDeleteRisk = this.handleDeleteRisk.bind(this)
    this.handleOpenModalRisk = this.handleOpenModalRisk.bind(this)
    this.handleCloseModalRisk = this.handleCloseModalRisk.bind(this)
  }

  async handleDeleteRisk(item) {
    try {
      await this.props.deleteRisk({
        variables: {
          id: item.id
        },
        refetchQueries: ['GetProject']
      })

      // Exibe mensagem de sucesso
      message.success(`Risco removido com sucesso`)
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }

    return true
  }

  handleOpenModalRisk(item) {
    this.setState({
      risk: item,
      modalRiskVisible: true
    })
  }

  handleCloseModalRisk() {
    this.setState({
      risk: null,
      modalRiskVisible: false
    })
  }

  render() {
    const self = this

    return (
      <div>
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <Button type="primary" onClick={() => self.handleOpenModalRisk()}>
            <Icon type="plus" theme="outlined" />
            <span>Novo Risco</span>
          </Button>
        </div>

        <Table
          rowKey="id"
          columns={self.columns}
          dataSource={self.props.project.risks}
          pagination={false}
        />

        {self.state.modalRiskVisible && (
          <ModalRisk
            item={self.state.risk}
            project={self.props.project}
            visible={self.state.modalRiskVisible}
            onClose={function() {
              self.handleCloseModalRisk()
            }}
          />
        )}
      </div>
    )
  }
}

const DELETE_RISK = gql`
  mutation DeleteRisk($id: ID!) {
    deleteRisk(where: { id: $id }) {
      id
    }
  }
`

const withGraphql = graphql(DELETE_RISK, {
  name: 'deleteRisk'
})

export default withGraphql(ProjectRisk)
