import React, { Component } from 'react'

import moment from 'moment'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import { Form, Field } from 'react-final-form'

import Tag from 'antd/lib/tag'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Modal from 'antd/lib/modal'
import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import message from 'antd/lib/message'

import {
  releaseStatusTranslate,
  formatFloatToMoney,
  parserMoneyToFloat
} from '../../utils'

import FormInput from '../../components/FormInput'

function validate(values) {
  const errors = {}

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Nome é obrigatório!'
  }

  if (!values.status) {
    errors.status = 'Estado é obrigatório!'
  }

  if (values.estimateSize && values.estimateSize < 0) {
    errors.estimateSize = 'Est. de tamanho deve ser maior que 0!'
  }

  if (values.estimatePrice && values.estimatePrice < 0) {
    errors.estimatePrice = 'Est. de preço deve ser maior que 0!'
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

class ModalEpic extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    try {
      if (values.id) {
        await this.props.updateEpic({
          variables: {
            where: {
              id: values.id
            },
            data: {
              release:
                values.release &&
                !!values.release.id &&
                values.release.id !== ''
                  ? {
                      connect: {
                        id: values.release.id
                      }
                    }
                  : {
                      disconnect: true
                    },
              name: values.name,
              description: values.description,
              priority: values.priority,
              status: values.status,
              estimateSize: values.estimateSize,
              estimatePrice: values.estimatePrice,
              estimateEffort: values.estimateEffort,
              estimateStart: values.estimateStart,
              estimateEnd: values.estimateEnd
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Épico (${values.name}) atualizado com sucesso`)
      } else {
        await this.props.createEpic({
          variables: {
            data: {
              project: {
                connect: {
                  id: this.props.project.id
                }
              },
              release:
                values.release &&
                !!values.release.id &&
                values.release.id !== ''
                  ? {
                      connect: {
                        id: values.release.id
                      }
                    }
                  : {
                      disconnect: true
                    },
              name: values.name,
              description: values.description,
              priority: values.priority,
              status: values.status,
              estimateSize: values.estimateSize,
              estimatePrice: values.estimatePrice,
              estimateEffort: values.estimateEffort,
              estimateStart: values.estimateStart,
              estimateEnd: values.estimateEnd
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Épico (${values.name}) criado com sucesso`)
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
      item.release = item.release || { id: '' }
    }

    if (!visible) {
      return null
    }

    return (
      <Form
        validate={validate}
        onSubmit={this.handleSubmit}
        initialValues={item || { release: { id: '' } }}
      >
        {function({ handleSubmit, submitting, invalid }) {
          return (
            <Modal
              title={
                <>
                  <Tag color="cyan">E</Tag>
                  {item ? item.name : 'Novo Épico'}
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
                    name="status"
                    type="radiobutton"
                    label="Estado"
                    component={FormInput}
                  >
                    <Radio.Button value="TODO">A fazer</Radio.Button>
                    <Radio.Button value="INPROGRESS">Em progresso</Radio.Button>
                    <Radio.Button value="DONE">Concluído</Radio.Button>
                  </Field>
                </Col>
              </Row>

              <Row type="flex" justify="space-between">
                <Col xs={24} sm={11}>
                  <Field
                    name="description"
                    type="textarea"
                    label="Descrição"
                    placeholder="Descrição"
                    component={FormInput}
                  />
                </Col>

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
                    name="priority"
                    type="number"
                    label="Prioridade"
                    placeholder="Prioridade"
                    component={FormInput}
                  />
                </Col>

                <Col xs={24} sm={11}>
                  <Field
                    name="estimatePrice"
                    type="number"
                    label="Est. de preço"
                    placeholder="0,00"
                    formatter={formatFloatToMoney}
                    parser={parserMoneyToFloat}
                    min={0}
                    component={FormInput}
                  />
                </Col>
              </Row>

              <Row type="flex" justify="space-between">
                <Col xs={24} sm={11}>
                  <Field
                    name="estimateSize"
                    type="number"
                    label="Est. de tamanho"
                    placeholder="Estimativa de tamanho"
                    min={0}
                    component={FormInput}
                  />
                </Col>

                <Col xs={24} sm={11}>
                  <Field
                    name="estimateEffort"
                    type="number"
                    label="Est. de esforço"
                    placeholder="Estimativa de esforço"
                    min={0}
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

const CREATE_EPIC = gql`
  mutation CreateEpic($data: EpicCreateInput!) {
    createEpic(data: $data) {
      id
      name
    }
  }
`

const UPDATE_EPIC = gql`
  mutation UpdateEpic($where: EpicWhereUniqueInput!, $data: EpicUpdateInput!) {
    updateEpic(where: $where, data: $data) {
      id
      name
    }
  }
`

const withGraphql = compose(
  graphql(CREATE_EPIC, {
    name: 'createEpic'
  }),
  graphql(UPDATE_EPIC, {
    name: 'updateEpic'
  })
)

export default withGraphql(ModalEpic)
