import React, { Component } from 'react'

import moment from 'moment'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import { Form, Field } from 'react-final-form'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Modal from 'antd/lib/modal'
import Radio from 'antd/lib/radio'
import message from 'antd/lib/message'

import FormInput from '../../components/FormInput'

function validate(values) {
  const errors = {}

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Nome é obrigatório!'
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

class ModalRelease extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    try {
      if (values.id) {
        await this.props.updateRelease({
          variables: {
            where: {
              id: values.id
            },
            data: {
              name: values.name,
              startAt: values.startAt,
              endAt: values.endAt,
              status: values.status
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Release (${values.name}) atualizada com sucesso`)
      } else {
        await this.props.createRelease({
          variables: {
            data: {
              project: {
                connect: {
                  id: this.props.project.id
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
        message.success(`Release (${values.name}) criada com sucesso`)
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
              title={item ? item.name : 'Nova Release'}
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

const CREATE_RELEASE = gql`
  mutation CreateRelease($data: ReleaseCreateInput!) {
    createRelease(data: $data) {
      id
      name
    }
  }
`

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

const withGraphql = compose(
  graphql(CREATE_RELEASE, {
    name: 'createRelease'
  }),
  graphql(UPDATE_RELEASE, {
    name: 'updateRelease'
  })
)

export default withGraphql(ModalRelease)
