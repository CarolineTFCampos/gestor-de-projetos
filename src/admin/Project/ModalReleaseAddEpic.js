import React, { Component } from 'react'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { Form, Field } from 'react-final-form'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Modal from 'antd/lib/modal'
import Select from 'antd/lib/select'
import message from 'antd/lib/message'

import { epicStatusTranslate } from '../../utils'

import FormInput from '../../components/FormInput'

function validate(values) {
  const errors = {}

  if (!values.epic || values.epic.id.trim() === '') {
    errors.epic = {
      id: 'Épico é obrigatório!'
    }
  }

  return errors
}

class ModalReleaseAddEpic extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    try {
      await this.props.mutate({
        variables: {
          where: {
            id: this.props.release.id
          },
          data: {
            epics: {
              connect: {
                id: values.epic.id
              }
            }
          }
        },
        refetchQueries: ['GetProject']
      })

      // Exibe mensagem de sucesso
      message.success(`Épico (${values.name}) adicionado com sucesso`)

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
        initialValues={{ epic: { id: '' } }}
      >
        {function({ handleSubmit, submitting, invalid }) {
          return (
            <Modal
              title="Adicionar Épico"
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
                    name="epic.id"
                    type="select"
                    label="Épico"
                    placeholder="Épico"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    component={FormInput}
                  >
                    <Select.Option value="">Nenhum</Select.Option>
                    {self.props.project.epics
                      .filter(function(epic) {
                        return !epic.release
                      })
                      .map(function(epic) {
                        return (
                          <Select.Option key={epic.id} value={epic.id}>
                            {epic.name} ({epicStatusTranslate[epic.status]})
                          </Select.Option>
                        )
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

const withGraphql = graphql(UPDATE_RELEASE)

export default withGraphql(ModalReleaseAddEpic)
