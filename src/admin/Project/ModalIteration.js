import React, { Component } from 'react'

import moment from 'moment'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import { Form, Field } from 'react-final-form'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Modal from 'antd/lib/modal'
import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import message from 'antd/lib/message'

import { releaseStatusTranslate } from '../../utils'

import FormInput from '../../components/FormInput'

function validate(values) {
  const errors = {}

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Nome é obrigatório!'
  }

  if (!values.release || values.release.id.trim() === '') {
    errors.release = {
      id: 'Release é obrigatória!'
    }
  }

  if (!values.status) {
    errors.status = 'Estado é obrigatório!'
  }

  if (!values.startAt || !values.startAt.isValid()) {
    errors.startAt = 'Data de inicio é obrigatória!'
  }

  if (!values.endAt || !values.endAt.isValid()) {
    errors.endAt = 'Data de fim é obrigatória!'
  }

  if (values.startAt && values.endAt && values.startAt > values.endAt) {
    errors.startAt = 'Data inicial deve ser anterior à Data final!'
    errors.endAt = 'Data final deve ser posterior à Data inicial'
  }

  return errors
}

class ModalIteration extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    try {
      if (values.id) {
        await this.props.updateIteration({
          variables: {
            where: {
              id: values.id
            },
            data: {
              release: {
                connect: {
                  id: values.release.id
                }
              },
              name: values.name,
              startAt: values.startAt,
              endAt: values.endAt,
              status: values.status
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Iteração (${values.name}) atualizada com sucesso`)
      } else {
        await this.props.createIteration({
          variables: {
            data: {
              project: {
                connect: {
                  id: this.props.project.id
                }
              },
              release: {
                connect: {
                  id: values.release.id
                }
              },
              name: values.name,
              startAt: values.startAt,
              endAt: values.endAt,
              status: values.status
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Iteração (${values.name}) criada com sucesso`)
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
      item.startAt = moment(item.startAt)
      item.endAt = moment(item.endAt)
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
              title="Nova Iteração"
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
                    name="status"
                    type="radiobutton"
                    label="Estado"
                    component={FormInput}
                  >
                    <Radio.Button value="OPEN">Aberta</Radio.Button>
                    <Radio.Button value="DONE">Concluída</Radio.Button>
                  </Field>
                </Col>
              </Row>

              <Row type="flex">
                <Col xs={24} sm={11}>
                  <Field
                    name="release.id"
                    type="select"
                    label="Release"
                    placeholder="Release"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    component={FormInput}
                  >
                    <Select.Option value="">Nenhuma</Select.Option>
                    {self.props.project.releases.map(function(release) {
                      return (
                        <Select.Option key={release.id} value={release.id}>
                          {release.name} (
                          {releaseStatusTranslate[release.status]})
                        </Select.Option>
                      )
                    })}
                  </Field>
                </Col>
              </Row>

              <Row type="flex" justify="space-between">
                <Col xs={24} sm={11}>
                  <Field
                    name="startAt"
                    type="datepicker"
                    label="Data de inicio"
                    placeholder="Data de inicio"
                    component={FormInput}
                  />
                </Col>

                <Col xs={24} sm={11}>
                  <Field
                    name="endAt"
                    type="datepicker"
                    label="Data de fim"
                    placeholder="Data de fim"
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

const CREATE_ITERATION = gql`
  mutation CreateIteration($data: IterationCreateInput!) {
    createIteration(data: $data) {
      id
      name
    }
  }
`

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

const withGraphql = compose(
  graphql(CREATE_ITERATION, {
    name: 'createIteration'
  }),
  graphql(UPDATE_ITERATION, {
    name: 'updateIteration'
  })
)

export default withGraphql(ModalIteration)
