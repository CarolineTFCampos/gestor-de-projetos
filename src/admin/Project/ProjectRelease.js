import React, { Component } from 'react'

import moment from 'moment'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Button from 'antd/lib/button'
import Popconfirm from 'antd/lib/popconfirm'
import ButtonGroup from 'antd/lib/button/button-group'
import message from 'antd/lib/message'

import {
  epicStatusTranslate,
  releaseStatusTranslate,
  formatDate,
  formatMinutesToHour
} from '../../utils'

import ModalRelease from './ModalRelease'
import ModalReleaseAddEpic from './ModalReleaseAddEpic'

class ProjectRelease extends Component {
  constructor(props) {
    super(props)

    this.state = {
      release: null,
      modalReleaseVisible: false,
      modalReleaseAddEpicVisible: false
    }

    const self = this

    this.columns = [
      {
        key: 'name',
        dataIndex: 'name',
        title: 'Nome'
      },
      {
        key: 'startAt',
        dataIndex: 'startAt',
        title: 'Inicio',
        render: function(text) {
          return formatDate(text)
        }
      },
      {
        key: 'endAt',
        dataIndex: 'endAt',
        title: 'Fim',
        render: function(text) {
          return formatDate(text)
        }
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: 'Estado',
        render: function(text) {
          return releaseStatusTranslate[text] || epicStatusTranslate[text]
        }
      },
      {
        key: 'estimateEffort',
        dataIndex: 'estimateEffort',
        title: 'Esforço estimado',
        render: function(text, record) {
          if (record.__typename === 'Epic') {
            return formatMinutesToHour(text)
          }

          return formatMinutesToHour(
            record.children.reduce(function(prev, current) {
              return prev + current.estimateEffort
            }, 0)
          )
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
                {record.__typename === 'Release' && (
                  <>
                    <Button
                      icon="plus"
                      onClick={function() {
                        self.handleOpenModalAddEpic(record)
                      }}
                    />
                    <Button
                      icon="edit"
                      onClick={function() {
                        self.handleOpenModalRelease(record)
                      }}
                    />
                  </>
                )}
                ​
                <Popconfirm
                  placement="topRight"
                  title="Tem certeza que deseja deletar?"
                  okText="Sim"
                  cancelText="Não"
                  onConfirm={function() {
                    if (record.__typename === 'Release') {
                      self.handleDeleteRelease(record)
                    } else {
                      self.handleDeleteEpic(record)
                    }
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

    this.handleDeleteEpic = this.handleDeleteEpic.bind(this)
    this.handleDeleteRelease = this.handleDeleteRelease.bind(this)
    this.handleOpenModalRelease = this.handleOpenModalRelease.bind(this)
    this.handleCloseModalRelease = this.handleCloseModalRelease.bind(this)
    this.handleOpenModalAddEpic = this.handleOpenModalAddEpic.bind(this)
    this.handleCloseModalAddEpic = this.handleCloseModalAddEpic.bind(this)
  }

  async handleDeleteEpic(item) {
    try {
      await this.props.updateRelease({
        variables: {
          where: {
            id: item.release.id
          },
          data: {
            epics: {
              disconnect: {
                id: item.id
              }
            }
          }
        },
        refetchQueries: ['GetProject']
      })

      // Exibe mensagem de sucesso
      message.success(`Epic removida com sucesso`)
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }

    return true
  }

  async handleDeleteRelease(item) {
    try {
      await this.props.deleteRelease({
        variables: {
          id: item.id
        },
        refetchQueries: ['GetProject']
      })

      // Exibe mensagem de sucesso
      message.success(`Release removida com sucesso`)
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }

    return true
  }

  handleOpenModalRelease(item) {
    this.setState({
      release: item,
      modalReleaseVisible: true
    })
  }

  handleCloseModalRelease() {
    this.setState({
      release: null,
      modalReleaseVisible: false
    })
  }

  handleOpenModalAddEpic(item) {
    this.setState({
      release: item,
      modalReleaseAddEpicVisible: true
    })
  }

  handleCloseModalAddEpic() {
    this.setState({
      release: null,
      modalReleaseAddEpicVisible: false
    })
  }

  render() {
    const self = this

    return (
      <div>
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <Button type="primary" onClick={() => self.handleOpenModalRelease()}>
            <Icon type="plus" theme="outlined" />
            <span>Nova release</span>
          </Button>
        </div>

        <Table
          rowKey="id"
          columns={self.columns}
          dataSource={self.props.project.releases.map(function(release) {
            return {
              ...release,
              children: self.props.project.epics.filter(function(epic) {
                return epic.release && epic.release.id === release.id
              })
            }
          })}
        />

        {self.state.modalReleaseVisible && (
          <ModalRelease
            item={self.state.release}
            project={self.props.project}
            visible={self.state.modalReleaseVisible}
            onClose={function() {
              self.handleCloseModalRelease()
            }}
          />
        )}

        {self.state.modalReleaseAddEpicVisible && (
          <ModalReleaseAddEpic
            release={self.state.release}
            project={self.props.project}
            visible={self.state.modalReleaseAddEpicVisible}
            onClose={function() {
              self.handleCloseModalAddEpic()
            }}
          />
        )}
      </div>
    )
  }
}

const UPDATE_RELEASE = gql`
  mutation UpdateRelease(
    $where: ReleaseWhereUniqueInput!
    $data: ReleaseUpdateInput!
  ) {
    updateRelease(where: $where, data: $data) {
      id
      name
    }
  }
`

const DELETE_RELEASE = gql`
  mutation DeleteRelease($id: ID!) {
    deleteRelease(where: { id: $id }) {
      id
    }
  }
`

const withGraphql = compose(
  graphql(UPDATE_RELEASE, {
    name: 'updateRelease'
  }),
  graphql(DELETE_RELEASE, {
    name: 'deleteRelease'
  })
)

export default withGraphql(ProjectRelease)
