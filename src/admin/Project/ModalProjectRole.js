import React, { Component } from 'react'

import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

import { Form, Field } from 'react-final-form'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Modal from 'antd/lib/modal'
import Select from 'antd/lib/select'
import message from 'antd/lib/message'

import { formatFloatToMoney, parserMoneyToFloat } from '../../utils'

import FormInput from '../../components/FormInput'

function validate(values) {
  const errors = {}

  if (!values.role || !values.role.id) {
    errors.role = {
      id: 'Papel é obrigatório!'
    }
  }

  if (values.estimatePrice && values.estimatePrice < 0) {
    errors.estimatePrice = 'Est. de preço deve ser maior que 0!'
  }

  if (values.estimateEffort && values.estimateEffort < 0) {
    errors.estimateEffort = 'Est. de esforço deve ser maior que 0!'
  }

  return errors
}

class ModalProjectRole extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    try {
      if (values.id) {
        await this.props.updateProjectRole({
          variables: {
            where: {
              id: values.id
            },
            data: {
              role: {
                connect: {
                  id: values.role.id
                }
              },
              estimatePrice: values.estimatePrice,
              estimateEffort: values.estimateEffort
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Papel atualizado com sucesso`)
      } else {
        await this.props.createProjectRole({
          variables: {
            data: {
              role: {
                connect: {
                  id: values.role.id
                }
              },
              project: {
                connect: {
                  id: this.props.project.id
                }
              },
              estimatePrice: values.estimatePrice,
              estimateEffort: values.estimateEffort
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Papel adicionado com sucesso`)
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

    const self = this

    return (
      <Form
        validate={validate}
        onSubmit={this.handleSubmit}
        initialValues={item || {}}
      >
        {function({ handleSubmit, submitting, invalid }) {
          return (
            <Modal
              title={item ? item.name : 'Nova Papel'}
              visible={visible}
              onOk={handleSubmit}
              okText="Salvar"
              onCancel={onClose}
              okButtonDisabled={invalid}
              confirmLoading={submitting}
            >
              <Row type="flex">
                <Col xs={24}>
                  <Field
                    name="role.id"
                    type="select"
                    label="Papel"
                    placeholder="Papel"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    disabled={(self.props.roles.roles || []).length === 0}
                    component={FormInput}
                  >
                    {(self.props.roles.roles || []).map(function(role) {
                      return (
                        <Select.Option key={role.id} value={role.id}>
                          {role.name}
                        </Select.Option>
                      )
                    })}
                  </Field>
                </Col>
              </Row>

              <Row type="flex" justify="space-between">
                <Col xs={24} sm={11}>
                  <Field
                    name="estimateEffort"
                    type="number"
                    label="Est. de esforço"
                    placeholder="Estimativa de esforço"
                    component={FormInput}
                  />
                </Col>

                <Col xs={24} sm={11}>
                  <Field
                    name="estimatePrice"
                    type="number"
                    label="Est. Custo/hora"
                    placeholder="0,00"
                    formatter={formatFloatToMoney}
                    parser={parserMoneyToFloat}
                    min={0}
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

const GET_ROLES = gql`
  query GetRoles {
    roles {
      id
      name
    }
  }
`

const CREATE_PROJECT_ROLE = gql`
  mutation CreateProjectRole($data: ProjectRoleCreateInput!) {
    createProjectRole(data: $data) {
      id
    }
  }
`

const UPDATE_PROJECT_ROLE = gql`
  mutation UpdateProjectRole(
    $where: ProjectRoleWhereUniqueInput!
    $data: ProjectRoleUpdateInput!
  ) {
    updateProjectRole(where: $where, data: $data) {
      id
    }
  }
`

const withGraphql = compose(
  graphql(GET_ROLES, {
    name: 'roles'
  }),
  graphql(CREATE_PROJECT_ROLE, {
    name: 'createProjectRole'
  }),
  graphql(UPDATE_PROJECT_ROLE, {
    name: 'updateProjectRole'
  })
)

export default withGraphql(ModalProjectRole)
