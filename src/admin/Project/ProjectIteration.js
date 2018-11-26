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
  iterationStatusTranslate,
  formatDate,
  formatMinutesToHour
} from '../../utils'

import ModalIteration from './ModalIteration'
import ModalIterationAddUserStory from './ModalIterationAddUserStory'

class ProjectIteration extends Component {
  constructor(props) {
    super(props)

    this.state = {
      iteration: null,
      modalIterationVisible: false,
      modalIterationAddUserStoryVisible: false
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
          return iterationStatusTranslate[text] || text
        }
      },
      {
        key: 'estimateEffort',
        dataIndex: 'estimateEffort',
        title: 'Esforço estimado',
        render: function(text, record) {
          if (record.__typename === 'UserStory') {
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
                {record.__typename === 'Iteration' && (
                  <>
                    <Button
                      icon="plus"
                      onClick={function() {
                        self.handleOpenModalAddUserStory(record)
                      }}
                    />
                    <Button
                      icon="edit"
                      onClick={function() {
                        self.handleOpenModalIteration(record)
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
                    if (record.__typename === 'Iteration') {
                      self.handleDeleteIteration(record)
                    } else {
                      self.handleDeleteUserStory(record)
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

    this.handleDeleteUserStory = this.handleDeleteUserStory.bind(this)
    this.handleDeleteIteration = this.handleDeleteIteration.bind(this)
    this.handleOpenModalIteration = this.handleOpenModalIteration.bind(this)
    this.handleCloseModalIteration = this.handleCloseModalIteration.bind(this)
    this.handleOpenModalAddUserStory = this.handleOpenModalAddUserStory.bind(
      this
    )
    this.handleCloseModalAddUserStory = this.handleCloseModalAddUserStory.bind(
      this
    )
  }

  async handleDeleteUserStory(item) {
    try {
      await this.props.updateIteration({
        variables: {
          where: {
            id: item.iteration.id
          },
          data: {
            userStories: {
              disconnect: {
                id: item.id
              }
            }
          }
        },
        refetchQueries: ['GetProject']
      })

      // Exibe mensagem de sucesso
      message.success(`História de Usuario removida com sucesso`)
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }

    return true
  }

  async handleDeleteIteration(item) {
    try {
      await this.props.deleteIteration({
        variables: {
          id: item.id
        },
        refetchQueries: ['GetProject']
      })

      // Exibe mensagem de sucesso
      message.success(`Iteração removida com sucesso`)
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }

    return true
  }

  handleOpenModalIteration(item) {
    this.setState({
      iteration: item,
      modalIterationVisible: true
    })
  }

  handleCloseModalIteration() {
    this.setState({
      iteration: null,
      modalIterationVisible: false
    })
  }

  handleOpenModalAddUserStory(item) {
    this.setState({
      iteration: item,
      modalIterationAddUserStoryVisible: true
    })
  }

  handleCloseModalAddUserStory() {
    this.setState({
      iteration: null,
      modalIterationAddUserStoryVisible: false
    })
  }

  render() {
    const self = this

    return (
      <div>
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <Button
            type="primary"
            onClick={() => self.handleOpenModalIteration()}
          >
            <Icon type="plus" theme="outlined" />
            <span>Nova Iteração</span>
          </Button>
        </div>

        <Table
          rowKey="id"
          columns={self.columns}
          dataSource={self.props.project.iterations.map(function(iteration) {
            return {
              ...iteration,
              children: self.props.project.epics
                .map(function(epic) {
                  return epic.userStories.filter(function(userStory) {
                    return (
                      userStory.iteration &&
                      userStory.iteration.id === iteration.id
                    )
                  })
                })
                .flat()
            }
          })}
        />

        {self.state.modalIterationVisible && (
          <ModalIteration
            item={self.state.iteration}
            project={self.props.project}
            visible={self.state.modalIterationVisible}
            onClose={function() {
              self.handleCloseModalIteration()
            }}
          />
        )}

        {self.state.modalIterationAddUserStoryVisible && (
          <ModalIterationAddUserStory
            iteration={self.state.iteration}
            project={self.props.project}
            visible={self.state.modalIterationAddUserStoryVisible}
            onClose={function() {
              self.handleCloseModalAddUserStory()
            }}
          />
        )}
      </div>
    )
  }
}

const UPDATE_ITERATION = gql`
  mutation UpdateIteration(
    $where: IterationWhereUniqueInput!
    $data: IterationUpdateInput!
  ) {
    updateIteration(where: $where, data: $data) {
      id
      name
    }
  }
`

const DELETE_ITERATION = gql`
  mutation DeleteIteration($id: ID!) {
    deleteIteration(where: { id: $id }) {
      id
    }
  }
`

const withGraphql = compose(
  graphql(UPDATE_ITERATION, {
    name: 'updateIteration'
  }),
  graphql(DELETE_ITERATION, {
    name: 'deleteIteration'
  })
)

export default withGraphql(ProjectIteration)
