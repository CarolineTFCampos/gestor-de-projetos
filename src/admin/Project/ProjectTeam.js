import React, { Component } from 'react'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Button from 'antd/lib/button'
import Popconfirm from 'antd/lib/popconfirm'
import ButtonGroup from 'antd/lib/button/button-group'
import message from 'antd/lib/message'

import {
  formatMinutesToHour,
  formatMoney,
  formatDate,
  roleLevelTypesTranslate
} from '../../utils'

import ModalProjectRole from './ModalProjectRole'
import ModalProjectRoleContributor from './ModalProjectRoleContributor'

class ProjectTeam extends Component {
  constructor(props) {
    super(props)

    this.state = {
      projectRole: null,
      projectRoleContributor: null,
      modalProjectRoleVisible: false,
      modalProjectRoleContributorVisible: false
    }

    const self = this

    this.columns = [
      {
        key: 'role.id',
        dataIndex: 'role.id',
        title: 'Papel',
        render: function(text, record) {
          return record.role.name
        }
      },
      {
        key: 'estimatePrice',
        dataIndex: 'estimatePrice',
        title: 'Custo/hora',
        render: function(text) {
          return formatMoney(text)
        }
      },
      {
        key: 'estimateEffort',
        dataIndex: 'estimateEffort',
        title: 'Esforço Estimado / Realizado',
        render: function(text, record) {
          const effort = formatMinutesToHour(
            record.contributors.reduce(function(prev, current) {
              return prev + current.effort
            }, 0)
          )
          const estimateEffort = formatMinutesToHour(text)

          return `${estimateEffort} / ${effort}`
        }
      },
      {
        key: 'total',
        dataIndex: 'total',
        title: 'Custo Estimado / Autal',
        render: function(text, record) {
          const price = formatMoney(
            record.contributors.reduce(function(prev, current) {
              return prev + (current.effort / 60) * current.price
            }, 0)
          )
          const estimatePrice = formatMoney(
            (record.estimateEffort / 60) * record.estimatePrice
          )

          return `${estimatePrice} / ${price}`
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
                  icon="plus"
                  onClick={function() {
                    self.handleOpenModalProjectRoleContributor(record)
                  }}
                />

                <Button
                  icon="edit"
                  onClick={function() {
                    self.handleOpenModalProjectRole(record)
                  }}
                />

                {record.contributors.length === 0 && (
                  <Popconfirm
                    placement="topRight"
                    title="Tem certeza que deseja deletar?"
                    okText="Sim"
                    cancelText="Não"
                    onConfirm={function() {
                      self.handleDeleteProjectRole(record)
                    }}
                  >
                    <Button type="danger" icon="delete" />
                  </Popconfirm>
                )}
              </ButtonGroup>
            </span>
          )
        }
      }
    ]

    this.nestedColumns = [
      {
        key: 'contributor.id',
        dataIndex: 'contributor.id',
        title: 'Colaborador',
        render: function(text, record) {
          return record.contributor.name
        }
      },
      {
        key: 'roleLevel',
        dataIndex: 'roleLevel',
        title: 'Nível',
        render: function(text) {
          return roleLevelTypesTranslate[text]
        }
      },
      {
        key: 'startAt',
        dataIndex: 'startAt',
        title: 'Dt. Inicio',
        render: function(text) {
          return formatDate(text)
        }
      },
      {
        key: 'endAt',
        dataIndex: 'endAt',
        title: 'Dt. Fim',
        render: function(text) {
          return formatDate(text)
        }
      },
      {
        key: 'price',
        dataIndex: 'price',
        title: 'Custo/hora',
        render: function(text) {
          return formatMoney(text)
        }
      },
      {
        key: 'estimateEffort',
        dataIndex: 'estimateEffort',
        title: 'Estimativa Esforço / Realizado',
        render: function(text, record) {
          return `${formatMinutesToHour(text)} / ${formatMinutesToHour(
            record.effort
          )}`
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
                    self.handleOpenModalProjectRoleContributor({}, record)
                  }}
                />

                <Popconfirm
                  placement="topRight"
                  title="Tem certeza que deseja deletar?"
                  okText="Sim"
                  cancelText="Não"
                  onConfirm={function() {
                    self.handleDeleteProjectRoleContributor(record)
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

    this.handleDeleteProjectRole = this.handleDeleteProjectRole.bind(this)
    this.handleDeleteProjectRoleContributor = this.handleDeleteProjectRoleContributor.bind(
      this
    )
    this.handleOpenModalProjectRole = this.handleOpenModalProjectRole.bind(this)
    this.handleOpenModalProjectRoleContributor = this.handleOpenModalProjectRoleContributor.bind(
      this
    )
    this.handleCloseModalProjectRole = this.handleCloseModalProjectRole.bind(
      this
    )
    this.handleCloseModalProjectRoleContributor = this.handleCloseModalProjectRoleContributor.bind(
      this
    )
  }

  async handleDeleteProjectRole(item) {
    try {
      await this.props.deleteProjectRole({
        variables: {
          id: item.id
        },
        refetchQueries: ['GetProject']
      })

      // Exibe mensagem de sucesso
      message.success(`Papel removido com sucesso`)
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }

    return true
  }

  async handleDeleteProjectRoleContributor(item) {
    try {
      await this.props.deleteProjectRoleContributor({
        variables: {
          id: item.id
        },
        refetchQueries: ['GetProject']
      })

      // Exibe mensagem de sucesso
      message.success(`Colaborador removido com sucesso`)
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }

    return true
  }

  handleOpenModalProjectRole(item) {
    this.setState({
      projectRole: item,
      modalProjectRoleVisible: true
    })
  }

  handleOpenModalProjectRoleContributor(projectRole, item) {
    this.setState({
      projectRole,
      projectRoleContributor: item,
      modalProjectRoleContributorVisible: true
    })
  }

  handleCloseModalProjectRole() {
    this.setState({
      projectRole: null,
      modalProjectRoleVisible: false
    })
  }

  handleCloseModalProjectRoleContributor() {
    this.setState({
      projectRole: null,
      projectRoleContributor: null,
      modalProjectRoleContributorVisible: false
    })
  }

  render() {
    const self = this

    return (
      <div>
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <Button
            type="primary"
            onClick={() => self.handleOpenModalProjectRole()}
          >
            <Icon type="plus" theme="outlined" />
            <span>Novo papel</span>
          </Button>
        </div>

        <Table
          rowKey="id"
          columns={self.columns}
          dataSource={self.props.project.projectRoles}
          expandedRowRender={function(projectRole) {
            return (
              <Table
                rowKey="id"
                columns={self.nestedColumns}
                dataSource={projectRole.contributors}
                pagination={false}
              />
            )
          }}
        />

        {self.state.modalProjectRoleVisible && (
          <ModalProjectRole
            item={self.state.projectRole}
            project={self.props.project}
            visible={self.state.modalProjectRoleVisible}
            onClose={function() {
              self.handleCloseModalProjectRole()
            }}
          />
        )}

        {self.state.modalProjectRoleContributorVisible && (
          <ModalProjectRoleContributor
            item={self.state.projectRoleContributor}
            projectRole={self.state.projectRole}
            visible={self.state.modalProjectRoleContributorVisible}
            onClose={function() {
              self.handleCloseModalProjectRoleContributor()
            }}
          />
        )}
      </div>
    )
  }
}

const DELETE_PROJECT_ROLE = gql`
  mutation DeleteProjectRole($id: ID!) {
    deleteProjectRole(where: { id: $id }) {
      id
    }
  }
`

const DELETE_PROJECT_ROLE_CONTRIBUTOR = gql`
  mutation DeleteProjectRoleContributor($id: ID!) {
    deleteProjectRoleContributor(where: { id: $id }) {
      id
    }
  }
`

const withGraphql = compose(
  graphql(DELETE_PROJECT_ROLE, {
    name: 'deleteProjectRole'
  }),
  graphql(DELETE_PROJECT_ROLE_CONTRIBUTOR, {
    name: 'deleteProjectRoleContributor'
  })
)

export default withGraphql(ProjectTeam)
