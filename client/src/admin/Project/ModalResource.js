import React, { Component } from 'react'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import { Form, Field } from 'react-final-form'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Modal from 'antd/lib/modal'
import Select from 'antd/lib/select'
import message from 'antd/lib/message'

import FormInput from '../../components/FormInput'

import { formatFloatToMoney, parserMoneyToFloat } from '../../utils'

function validate(values) {
  const errors = {}

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Nome é obrigatório!'
  }

  if (!values.type) {
    errors.type = 'Tipo é obrigatório!'
  }

  if (values.price && values.price < 0) {
    errors.price = 'Preço deve ser maior que 0!'
  }

  return errors
}

class ModalResource extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    try {
      if (values.id) {
        await this.props.updateResource({
          variables: {
            where: {
              id: values.id
            },
            data: {
              name: values.name,
              description: values.description,
              type: values.type,
              price: values.price
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Recurso (${values.name}) atualizado com sucesso`)
      } else {
        await this.props.createResource({
          variables: {
            data: {
              project: {
                connect: {
                  id: this.props.project.id
                }
              },
              name: values.name,
              description: values.description,
              type: values.type,
              price: values.price
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Recurso (${values.name}) criado com sucesso`)
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

    return (
      <Form
        validate={validate}
        onSubmit={this.handleSubmit}
        initialValues={item || {}}
      >
        {function({ handleSubmit, submitting, invalid }) {
          return (
            <Modal
              title={item ? item.name : 'Novo Recurso'}
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
              </Row>

              <Row type="flex" justify="space-between">
                <Col xs={24} sm={11}>
                  <Field
                    name="type"
                    type="select"
                    label="Tipo"
                    placeholder="Tipo"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    component={FormInput}
                  >
                    <Select.Option value="EQUIPAMENT">
                      Equipamento
                    </Select.Option>
                    <Select.Option value="TOOL">Ferramenta</Select.Option>
                    <Select.Option value="SERVICE">Serviço</Select.Option>
                    <Select.Option value="COMPONENT">Componente</Select.Option>
                    <Select.Option value="TRAVEL">Viagem</Select.Option>
                    <Select.Option value="OTHER">Outro</Select.Option>
                  </Field>
                </Col>

                <Col xs={24} sm={11}>
                  <Field
                    name="price"
                    type="number"
                    label="Preço"
                    placeholder="0,00"
                    formatter={formatFloatToMoney}
                    parser={parserMoneyToFloat}
                    min={0}
                    component={FormInput}
                  />
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
            </Modal>
          )
        }}
      </Form>
    )
  }
}

const CREATE_RESOURCE = gql`
  mutation CreateResource($data: ResourceCreateInput!) {
    createResource(data: $data) {
      id
      name
    }
  }
`

const UPDATE_RESOURCE = gql`
  mutation UpdateResource(
    $where: ResourceWhereUniqueInput!
    $data: ResourceUpdateInput!
  ) {
    updateResource(where: $where, data: $data) {
      id
      name
    }
  }
`

const withGraphql = compose(
  graphql(CREATE_RESOURCE, {
    name: 'createResource'
  }),
  graphql(UPDATE_RESOURCE, {
    name: 'updateResource'
  })
)

export default withGraphql(ModalResource)
