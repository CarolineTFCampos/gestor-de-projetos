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

import { formatMinutesToHour, formatMoney } from '../../utils'

import ModalEpic from './ModalEpic'
import ModalFeature from './ModalFeature'
import ModalUserStory from './ModalUserStory'

class ProjectScope extends Component {
  constructor(props) {
    super(props)

    this.state = {
      epic: null,
      feature: null,
      userStory: null,
      modalEpicVisible: false,
      modalFeatureVisible: false,
      modalUserStoryVisible: false
    }

    this.handleDelete = this.handleDelete.bind(this)
    this.handleOpenModalEpic = this.handleOpenModalEpic.bind(this)
    this.handleCloseModalEpic = this.handleCloseModalEpic.bind(this)
    this.handleOpenModalFeature = this.handleOpenModalFeature.bind(this)
    this.handleCloseModalFeature = this.handleCloseModalFeature.bind(this)
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
        title: 'Esforço Hrs',
        dataIndex: 'estimateEffort',
        key: 'estimateEffort',
        align: 'center',
        render: function(text) {
          return formatMinutesToHour(text)
        }
      },
      {
        title: 'Custo R$',
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
      // {
      //   title: 'Estado',
      //   dataIndex: 'status',
      //   key: 'status',
      //   align: 'center'
      // },
      // {
      //   title: 'Entrega',
      //   dataIndex: 'release',
      //   key: 'release',
      //   align: 'center'
      // },
      {
        key: 'action',
        title: 'Ações',
        align: 'right',
        render: function(text, record) {
          return (
            <span>
              <ButtonGroup>
                {['Feature', 'Epic'].includes(record.__typename) && (
                  <Button
                    icon="plus"
                    onClick={function() {
                      if (record.__typename === 'Feature') {
                        self.handleOpenModalEpic(record)
                      } else {
                        self.handleOpenModalUserStory(record)
                      }
                    }}
                  />
                )}

                <Button
                  icon="edit"
                  onClick={function() {
                    if (record.__typename === 'Feature') {
                      self.handleOpenModalFeature(record, true)
                    } else if (record.__typename === 'Epic') {
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

    if (item.__typename === 'Feature') {
      this.props.deleteFeature({
        variables: {
          id: item.id
        },
        refetchQueries: ['GetProject']
      })
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
      feature: edit ? null : item,
      modalEpicVisible: true
    })
  }

  handleCloseModalEpic() {
    this.setState({
      epic: null,
      feature: null,
      modalEpicVisible: false
    })
  }

  handleOpenModalFeature(item, edit) {
    this.setState({
      feature: edit ? item : null,
      modalFeatureVisible: true
    })
  }

  handleCloseModalFeature() {
    this.setState({
      feature: null,
      modalFeatureVisible: false
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
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <Button type="primary" onClick={() => self.handleOpenModalFeature()}>
            <Icon type="plus" theme="outlined" />
            <span>Nova feature</span>
          </Button>
        </div>

        <Table
          defaultExpandAllRows={true}
          columns={self.columns}
          dataSource={self.props.project.features.map(function(feature) {
            return {
              ...feature,
              children: feature.epics.map(function(epic) {
                return {
                  ...epic,
                  children: epic.userStories
                }
              })
            }
          })}
          rowKey="id"
        />

        {self.state.modalEpicVisible && (
          <ModalEpic
            item={self.state.epic}
            feature={self.state.feature}
            visible={self.state.modalEpicVisible}
            onClose={function() {
              self.handleCloseModalEpic()
            }}
          />
        )}

        {self.state.modalFeatureVisible && (
          <ModalFeature
            item={self.state.feature}
            project={self.props.project}
            visible={self.state.modalFeatureVisible}
            onClose={function() {
              self.handleCloseModalFeature()
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

const DELETE_FEATURE = gql`
  mutation DeleteFeature($id: ID!) {
    deleteFeature(where: { id: $id }) {
      id
    }
  }
`

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
  graphql(DELETE_FEATURE, {
    name: 'deleteFeature'
  }),
  graphql(DELETE_EPIC, {
    name: 'deleteEpic'
  }),
  graphql(DELETE_USER_STORY, {
    name: 'deleteUserStory'
  })
)

export default withGraphql(ProjectScope)
