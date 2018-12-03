import React, { Component } from 'react'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import { Form, Field } from 'react-final-form'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Modal from 'antd/lib/modal'
import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import message from 'antd/lib/message'

import FormInput from '../../components/FormInput'

function validate(values) {
  const errors = {}

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Nome é obrigatório!'
  }

  if (!values.plan || values.plan.trim() === '') {
    errors.plan = 'Plano é obrigatório!'
  }

  if (!values.status) {
    errors.status = 'Estado é obrigatório!'
  }

  return errors
}

class ModalRisk extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    try {
      if (values.id) {
        await this.props.updateRisk({
          variables: {
            where: {
              id: values.id
            },
            data: {
              name: values.name,
              plan: values.plan,
              priority: parseInt(values.priority),
              probability: parseInt(values.probability),
              impact: parseInt(values.impact),
              status: values.status
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Risco (${values.name}) atualizado com sucesso`)
      } else {
        await this.props.createRisk({
          variables: {
            data: {
              project: {
                connect: {
                  id: this.props.project.id
                }
              },
              name: values.name,
              plan: values.plan,
              priority: parseInt(values.priority),
              probability: parseInt(values.probability),
              impact: parseInt(values.impact),
              status: values.status
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Risco (${values.name}) criado com sucesso`)
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

    if (!visible) {
      return null
    }

    if (item) {
      item.impact = item.impact.toString()
      item.probability = item.probability.toString()
    }

    return (
      <Form
        validate={validate}
        onSubmit={this.handleSubmit}
        initialValues={item || { priority: '1', probability: '1', impact: '1' }}
      >
        {function({ handleSubmit, submitting, invalid }) {
          return (
            <Modal
              title={item ? item.name : 'Novo Risco'}
              visible={visible}
              onOk={handleSubmit}
              okText="Salvar"
              onCancel={onClose}
              okButtonDisabled={invalid}
              confirmLoading={submitting}
              width="80%"
            >
              <Row type="flex" justify="space-between">
                <Col xs={24} sm={16}>
                  <Field
                    name="name"
                    type="text"
                    label="Nome"
                    placeholder="Nome"
                    component={FormInput}
                  />
                </Col>

                <Col xs={24} sm={7}>
                  <Field
                    name="status"
                    type="radiobutton"
                    label="Estado"
                    component={FormInput}
                  >
                    <Radio.Button value="OPEN">Aberto</Radio.Button>
                    <Radio.Button value="PENDING">Pendente</Radio.Button>
                    <Radio.Button value="DONE">Fechado</Radio.Button>
                  </Field>
                </Col>
              </Row>

              <Row type="flex" justify="space-between">
                <Col xs={24} sm={8}>
                  <Field
                    name="priority"
                    type="select"
                    label="Prioridade"
                    placeholder="Prioridade"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    component={FormInput}
                  >
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(
                      function(priority) {
                        return (
                          <Select.Option key={priority} value={priority}>
                            {priority}
                          </Select.Option>
                        )
                      }
                    )}
                  </Field>
                </Col>

                <Col xs={24} sm={7}>
                  <Field
                    name="probability"
                    type="select"
                    label="Probabilidade"
                    placeholder="Probabilidade"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    component={FormInput}
                  >
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(
                      function(probability) {
                        return (
                          <Select.Option key={probability} value={probability}>
                            {probability}
                          </Select.Option>
                        )
                      }
                    )}
                  </Field>
                </Col>

                <Col xs={24} sm={7}>
                  <Field
                    name="impact"
                    type="select"
                    label="Impacto"
                    placeholder="Impacto"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    component={FormInput}
                  >
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(
                      function(impact) {
                        return (
                          <Select.Option key={impact} value={impact}>
                            {impact}
                          </Select.Option>
                        )
                      }
                    )}
                  </Field>
                </Col>
              </Row>

              <Row type="flex">
                <Col xs={24}>
                  <Field
                    name="plan"
                    type="textarea"
                    label="Plano de Mitigação / Resposta"
                    placeholder="Plano de Mitigação / Resposta"
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

const CREATE_RISK = gql`
  mutation CreateRisk($data: RiskCreateInput!) {
    createRisk(data: $data) {
      id
      name
    }
  }
`

const UPDATE_RISK = gql`
  mutation UpdateRisk($where: RiskWhereUniqueInput!, $data: RiskUpdateInput!) {
    updateRisk(where: $where, data: $data) {
      id
      name
    }
  }
`

const withGraphql = compose(
  graphql(CREATE_RISK, {
    name: 'createRisk'
  }),
  graphql(UPDATE_RISK, {
    name: 'updateRisk'
  })
)

export default withGraphql(ModalRisk)
