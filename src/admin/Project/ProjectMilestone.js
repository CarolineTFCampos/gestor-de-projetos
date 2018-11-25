import React, { Component } from 'react'

import moment from 'moment'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Button from 'antd/lib/button'
import Popconfirm from 'antd/lib/popconfirm'
import ButtonGroup from 'antd/lib/button/button-group'
import message from 'antd/lib/message'

import { milestoneStatusTranslate, formatDate } from '../../utils'

import ModalMilestone from './ModalMilestone'

class ProjectMilestone extends Component {
  constructor(props) {
    super(props)

    this.state = {
      milestone: null,
      modalMilestoneVisible: false
    }

    const self = this

    this.columns = [
      {
        key: 'dueDate',
        dataIndex: 'dueDate',
        title: 'Data de vencimento',
        defaultSortOrder: 'ascend',
        sorter: function(a, b) {
          return moment(a.dueDate) - moment(b.dueDate)
        },
        render: function(text) {
          return formatDate(text)
        }
      },
      {
        key: 'name',
        dataIndex: 'name',
        title: 'Nome'
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: 'Estado',
        render: function(text) {
          return milestoneStatusTranslate[text]
        }
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
                    self.handleOpenModalMilestone(record)
                  }}
                />
                ​
                <Popconfirm
                  placement="topRight"
                  title="Tem certeza que deseja deletar?"
                  okText="Sim"
                  cancelText="Não"
                  onConfirm={function() {
                    self.handleDeleteMilestone(record)
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

    this.handleDeleteMilestone = this.handleDeleteMilestone.bind(this)
    this.handleOpenModalMilestone = this.handleOpenModalMilestone.bind(this)
    this.handleCloseModalMilestone = this.handleCloseModalMilestone.bind(this)
  }

  async handleDeleteMilestone(item) {
    try {
      await this.props.deleteMilestone({
        variables: {
          id: item.id
        },
        refetchQueries: ['GetProject']
      })

      // Exibe mensagem de sucesso
      message.success(`Marco removido com sucesso`)
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }

    return true
  }

  handleOpenModalMilestone(item) {
    this.setState({
      milestone: item,
      modalMilestoneVisible: true
    })
  }

  handleCloseModalMilestone() {
    this.setState({
      milestone: null,
      modalMilestoneVisible: false
    })
  }

  render() {
    const self = this

    return (
      <div>
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <Button
            type="primary"
            onClick={() => self.handleOpenModalMilestone()}
          >
            <Icon type="plus" theme="outlined" />
            <span>Novo marco</span>
          </Button>
        </div>

        <Table
          rowKey="id"
          columns={self.columns}
          dataSource={self.props.project.milestones}
        />

        {self.state.modalMilestoneVisible && (
          <ModalMilestone
            item={self.state.milestone}
            project={self.props.project}
            visible={self.state.modalMilestoneVisible}
            onClose={function() {
              self.handleCloseModalMilestone()
            }}
          />
        )}
      </div>
    )
  }
}

const DELETE_MILESTONE = gql`
  mutation DeleteMilestone($id: ID!) {
    deleteMilestone(where: { id: $id }) {
      id
    }
  }
`

const withGraphql = graphql(DELETE_MILESTONE, {
  name: 'deleteMilestone'
})

export default withGraphql(ProjectMilestone)
