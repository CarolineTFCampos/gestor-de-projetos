import React, { Component } from 'react'

import moment from 'moment'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import { Form, Field } from 'react-final-form'

import Tag from 'antd/lib/tag'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Modal from 'antd/lib/modal'
import Select from 'antd/lib/select'
import message from 'antd/lib/message'

import { iterationStatusTranslate } from '../../utils'

import FormInput from '../../components/FormInput'

function validate(values) {
  const errors = {}

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Nome é obrigatório!'
  }

  if (values.estimateEffort && values.estimateEffort < 0) {
    errors.estimateEffort = 'Est. de esforço deve ser maior que 0!'
  }

  if (!values.estimateStart || !values.estimateStart.isValid()) {
    errors.estimateStart = 'Data inicial é obrigatório!'
  }

  if (!values.estimateEnd || !values.estimateEnd.isValid()) {
    errors.estimateEnd = 'Data final é obrigatório!'
  }

  if (
    values.estimateStart &&
    values.estimateEnd &&
    values.estimateStart > values.estimateEnd
  ) {
    errors.estimateStart = 'Data inicial deve ser anterior à Data final!'
    errors.estimateEnd = 'Data final deve ser posterior à Data inicial'
  }

  return errors
}

class ModalUserStory extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    try {
      if (values.id) {
        await this.props.updateUserStory({
          variables: {
            where: {
              id: values.id
            },
            data: {
              iteration:
                values.iteration &&
                !!values.iteration.id &&
                values.iteration.id !== ''
                  ? {
                      connect: {
                        id: values.iteration.id
                      }
                    }
                  : this.props.item.iteration &&
                    this.props.item.iteration.id !== ''
                  ? {
                      disconnect: true
                    }
                  : {},
              name: values.name,
              description: values.description,
              priority: values.priority,
              estimateEffort: values.estimateEffort,
              estimateStart: values.estimateStart,
              estimateEnd: values.estimateEnd
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(
          `História de Usuário (${values.name}) atualizada com sucesso`
        )
      } else {
        await this.props.createUserStory({
          variables: {
            data: {
              epic: {
                connect: {
                  id: this.props.epic.id
                }
              },
              iteration:
                values.iteration &&
                !!values.iteration.id &&
                values.iteration.id !== ''
                  ? {
                      connect: {
                        id: values.iteration.id
                      }
                    }
                  : {},
              name: values.name,
              description: values.description,
              priority: values.priority,
              estimateEffort: values.estimateEffort,
              estimateStart: values.estimateStart,
              estimateEnd: values.estimateEnd
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(
          `História de Usuário (${values.name}) criada com sucesso`
        )
      }

      // Fecha modal
      this.props.onClose()
    } catch (err) {
      // Mensagem de erro do graphql
      const error = err.graphQLErrors[0].message

      // Exibe a mensagem de erro por 10 segundos
      message.error(error, 10)
    }

    return true
  }

  render() {
    const { visible, onClose, item } = this.props

    const self = this

    if (item) {
      item.estimateStart = moment(item.estimateStart)
      item.estimateEnd = moment(item.estimateEnd)
      item.iteration = item.iteration || { id: '' }
    }

    if (!visible) {
      return null
    }

    return (
      <Form
        validate={validate}
        onSubmit={this.handleSubmit}
        initialValues={item || {}}
      >
        {function({ handleSubmit, submitting, invalid }) {
          return (
            <Modal
              title={
                <>
                  <Tag color="cyan">U</Tag>
                  {item ? item.name : 'Nova História de Usuário'}
                </>
              }
              visible={visible}
              onOk={handleSubmit}
              okText="Salvar"
              onCancel={onClose}
              okButtonDisabled={invalid}
              confirmLoading={submitting}
              width="80%"
            >
              <Row type="flex" justify="space-between">
                <Col xs={24} sm={11}>
                  <Field
                    name="name"
                    type="text"
                    label="Nome"
                    placeholder="Nome"
                    component={FormInput}
                  />
                </Col>

                <Col xs={24} sm={11}>
                  <Field
                    name="iteration.id"
                    type="select"
                    label="Iteração"
                    placeholder="Iteração"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    component={FormInput}
                  >
                    <Select.Option value="">Nenhuma</Select.Option>
                    {self.props.project.iterations.map(function(iteration) {
                      return (
                        <Select.Option key={iteration.id} value={iteration.id}>
                          {iteration.name} (
                          {iterationStatusTranslate[iteration.status]})
                        </Select.Option>
                      )
                    })}
                  </Field>
                </Col>
              </Row>

              <Row type="flex">
                <Col xs={24}>
                  <Field
                    name="description"
                    type="textarea"
                    label="Descrição"
                    placeholder="Descrição"
                    component={FormInput}
                  />
                </Col>
              </Row>

              <Row type="flex" justify="space-between">
                <Col xs={24} sm={11}>
                  <Field
                    name="priority"
                    type="number"
                    label="Prioridade"
                    placeholder="Prioridade"
                    component={FormInput}
                  />
                </Col>

                <Col xs={24} sm={11}>
                  <Field
                    name="estimateEffort"
                    type="number"
                    label="Est. de esforço"
                    placeholder="Estimativa de esforço"
                    component={FormInput}
                  />
                </Col>
              </Row>

              <Row type="flex" justify="space-between">
                <Col xs={24} sm={11}>
                  <Field
                    name="estimateStart"
                    type="datepicker"
                    label="Estimativa de início"
                    placeholder="Estimativa de início"
                    component={FormInput}
                  />
                </Col>

                <Col xs={24} sm={11}>
                  <Field
                    name="estimateEnd"
                    type="datepicker"
                    label="Estimativa de fim"
                    placeholder="Estimativa de fim"
                    component={FormInput}
                  />
                </Col>
              </Row>
            </Modal>
          )
        }}
      </Form>
    )
  }
}

const CREATE_USER_STORY = gql`
  mutation CreateUserStory($data: UserStoryCreateInput!) {
    createUserStory(data: $data) {
      id
      name
    }
  }
`

const UPDATE_USER_STORY = gql`
  mutation UpdateUserStory(
    $where: UserStoryWhereUniqueInput!
    $data: UserStoryUpdateInput!
  ) {
    updateUserStory(where: $where, data: $data) {
      id
      name
    }
  }
`

const withGraphql = compose(
  graphql(CREATE_USER_STORY, {
    name: 'createUserStory'
  }),
  graphql(UPDATE_USER_STORY, {
    name: 'updateUserStory'
  })
)

export default withGraphql(ModalUserStory)
