import React, { Component } from 'react'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { Form, Field } from 'react-final-form'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Modal from 'antd/lib/modal'
import Select from 'antd/lib/select'
import message from 'antd/lib/message'

import FormInput from '../../components/FormInput'

function validate(values) {
  const errors = {}

  if (!values.userStory || values.userStory.id.trim() === '') {
    errors.userStory = {
      id: 'História de Usuário é obrigatória!'
    }
  }

  return errors
}

class ModalIterationAddUserStory extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    try {
      await this.props.mutate({
        variables: {
          where: {
            id: this.props.iteration.id
          },
          data: {
            userStories: {
              connect: {
                id: values.userStory.id
              }
            }
          }
        },
        refetchQueries: ['GetProject']
      })

      // Exibe mensagem de sucesso
      message.success(
        `História de Usuário (${values.name}) adicionada com sucesso`
      )

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
    const { visible, onClose } = this.props

    const self = this

    if (!visible) {
      return null
    }

    return (
      <Form
        validate={validate}
        onSubmit={this.handleSubmit}
        initialValues={{ userStory: { id: '' } }}
      >
        {function({ handleSubmit, submitting, invalid }) {
          return (
            <Modal
              title="Adicionar História de Usuário"
              visible={visible}
              onOk={handleSubmit}
              okText="Salvar"
              onCancel={onClose}
              okButtonDisabled={invalid}
              confirmLoading={submitting}
              width="40%"
            >
              <Row type="flex">
                <Col xs={24}>
                  <Field
                    name="userStory.id"
                    type="select"
                    label="História de Usuário"
                    placeholder="História de Usuário"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    component={FormInput}
                  >
                    <Select.Option value="">Nenhum</Select.Option>
                    {self.props.project.epics.map(function(epic) {
                      return epic.userStories
                        .filter(function(userStory) {
                          return !userStory.iteration
                        })
                        .map(function(userStory) {
                          return (
                            <Select.Option
                              key={userStory.id}
                              value={userStory.id}
                            >
                              {userStory.name} ({userStory.status})
                            </Select.Option>
                          )
                        })
                        .flat()
                    })}
                  </Field>
                </Col>
              </Row>
            </Modal>
          )
        }}
      </Form>
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

const withGraphql = graphql(UPDATE_ITERATION)

export default withGraphql(ModalIterationAddUserStory)
