import React, { Component } from 'react'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import Tag from 'antd/lib/tag'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Button from 'antd/lib/button'
import Popconfirm from 'antd/lib/popconfirm'
import ButtonGroup from 'antd/lib/button/button-group'
import message from 'antd/lib/message'

import {
  releaseStatusTranslate,
  epicStatusTranslate,
  formatMinutesToHour,
  formatMoney
} from '../../utils'

import ModalEpic from './ModalEpic'
import ModalUserStory from './ModalUserStory'

class ProjectScope extends Component {
  constructor(props) {
    super(props)

    this.state = {
      epic: null,
      userStory: null,
      modalEpicVisible: false,
      modalUserStoryVisible: false
    }

    this.handleDelete = this.handleDelete.bind(this)
    this.handleOpenModalEpic = this.handleOpenModalEpic.bind(this)
    this.handleCloseModalEpic = this.handleCloseModalEpic.bind(this)
    this.handleOpenModalUserStory = this.handleOpenModalUserStory.bind(this)
    this.handleCloseModalUserStory = this.handleCloseModalUserStory.bind(this)

    const self = this

    this.columns = [
      {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
        render: function(text, record, index) {
          return (
            <>
              <Tag color="cyan">
                {record.__typename.charAt(0).toUpperCase()}
              </Tag>
              {text}
            </>
          )
        }
      },
      {
        title: 'Prioridade',
        dataIndex: 'priority',
        key: 'priority',
        align: 'left',
        defaultSortOrder: 'descend',
        sorter: function(a, b) {
          return parseInt(a.priority) - parseInt(b.priority)
        }
      },
      {
        title: 'Esforço Estimado / Atual',
        dataIndex: 'estimateEffort',
        key: 'estimateEffort',
        align: 'center',
        render: function(text, record) {
          if (record.__typename === 'Epic') {
            const effort = formatMinutesToHour(
              record.userStories.reduce(function(prev, current) {
                return prev + current.effort
              }, 0)
            )
            const estimateEffort = formatMinutesToHour(text)

            return `${estimateEffort} / ${effort}`
          } else {
            return `${formatMinutesToHour(text)} / ${formatMinutesToHour(
              record.effort
            )}`
          }
        }
      },
      {
        title: 'Custo Estimado',
        dataIndex: 'estimatePrice',
        key: 'estimatePrice',
        align: 'center',
        render: function(text, record) {
          if (record.__typename !== 'UserStory') {
            return formatMoney(text)
          }

          return ''
        }
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: 'Estado',
        align: 'center',
        render: function(text) {
          return text ? (
            <Tag color="blue">{epicStatusTranslate[text] || text}</Tag>
          ) : (
            ''
          )
        }
      },
      {
        key: 'releaseSprint',
        dataIndex: 'releaseSprint',
        title: 'Release | Sprint',
        render: function(text, record) {
          return record.release
            ? `${record.release.name} (${
                releaseStatusTranslate[record.release.status]
              })`
            : ''
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
                {record.__typename === 'Epic' && (
                  <Button
                    icon="plus"
                    onClick={function() {
                      self.handleOpenModalUserStory(record)
                    }}
                  />
                )}

                <Button
                  icon="edit"
                  onClick={function() {
                    if (record.__typename === 'Epic') {
                      self.handleOpenModalEpic(record, true)
                    } else {
                      self.handleOpenModalUserStory(record, true)
                    }
                  }}
                />

                {(!record.children || record.children.length === 0) && (
                  <Popconfirm
                    placement="topRight"
                    title="Tem certeza que deseja deletar?"
                    okText="Sim"
                    cancelText="Não"
                    onConfirm={function() {
                      self.handleDelete(record)
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
  }

  handleDelete(item) {
    if (item.children && item.children.length > 0) {
      message.error('É necessário delete as sub-tasks antes', 10)
      return
    }

    if (item.__typename === 'Epic') {
      this.props.deleteEpic({
        variables: {
          id: item.id
        },
        refetchQueries: ['GetProject']
      })
    }

    if (item.__typename === 'UserStory') {
      this.props.deleteUserStory({
        variables: {
          id: item.id
        },
        refetchQueries: ['GetProject']
      })
    }
  }

  handleOpenModalEpic(item, edit) {
    this.setState({
      epic: edit ? item : null,
      modalEpicVisible: true
    })
  }

  handleCloseModalEpic() {
    this.setState({
      epic: null,
      modalEpicVisible: false
    })
  }

  handleOpenModalUserStory(item, edit) {
    this.setState({
      epic: edit ? null : item,
      userStory: edit ? item : null,
      modalUserStoryVisible: true
    })
  }

  handleCloseModalUserStory() {
    this.setState({
      epic: null,
      userStory: null,
      modalUserStoryVisible: false
    })
  }

  render() {
    const self = this

    return (
      <div>
        <div
          style={{
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div>
              <strong>Esforço Estimado Total: </strong>
              <span>
                {formatMinutesToHour(
                  self.props.project.epics.reduce(function(prev, current) {
                    return prev + current.estimateEffort
                  }, 0)
                )}
              </span>
            </div>
            <div>
              <strong>Custo Estimado Total: </strong>
              <span>
                {formatMoney(
                  self.props.project.epics.reduce(function(prev, current) {
                    return prev + current.estimatePrice
                  }, 0)
                )}
              </span>
            </div>
          </div>

          <Button type="primary" onClick={() => self.handleOpenModalEpic()}>
            <Icon type="plus" theme="outlined" />
            <span>Novo épico</span>
          </Button>
        </div>

        <Table
          defaultExpandAllRows={true}
          columns={self.columns}
          dataSource={self.props.project.epics.map(function(epic) {
            return {
              ...epic,
              children: epic.userStories
            }
          })}
          rowKey="id"
        />

        {self.state.modalEpicVisible && (
          <ModalEpic
            item={self.state.epic}
            project={self.props.project}
            visible={self.state.modalEpicVisible}
            onClose={function() {
              self.handleCloseModalEpic()
            }}
          />
        )}

        {self.state.modalUserStoryVisible && (
          <ModalUserStory
            epic={self.state.epic}
            item={self.state.userStory}
            visible={self.state.modalUserStoryVisible}
            onClose={function() {
              self.handleCloseModalUserStory()
            }}
          />
        )}
      </div>
    )
  }
}

const DELETE_EPIC = gql`
  mutation DeleteEpic($id: ID!) {
    deleteEpic(where: { id: $id }) {
      id
    }
  }
`

const DELETE_USER_STORY = gql`
  mutation DeleteUserStory($id: ID!) {
    deleteUserStory(where: { id: $id }) {
      id
    }
  }
`

const withGraphql = compose(
  graphql(DELETE_EPIC, {
    name: 'deleteEpic'
  }),
  graphql(DELETE_USER_STORY, {
    name: 'deleteUserStory'
  })
)

export default withGraphql(ProjectScope)
