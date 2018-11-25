import React, { Component } from 'react'

import moment from 'moment'

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

  if (!values.contributor || !values.contributor.id) {
    errors.contributor = {
      id: 'Colaborador é obrigatório!'
    }
  }

  if (!values.roleLevel) {
    errors.roleLevel = 'Nível é obrigatório!'
  }

  if (values.price && values.price < 0) {
    errors.price = 'Preço deve ser maior que 0!'
  }

  if (values.estimateEffort && values.estimateEffort < 0) {
    errors.estimateEffort = 'Est. de esforço deve ser maior que 0!'
  }

  if (!values.startAt || !values.startAt.isValid()) {
    errors.startAt = 'Data inicial é obrigatório!'
  }

  if (!values.endAt || !values.endAt.isValid()) {
    errors.endAt = 'Data final é obrigatório!'
  }

  if (values.startAt && values.endAt && values.startAt > values.endAt) {
    errors.startAt = 'Data inicial deve ser anterior à Data final!'
    errors.endAt = 'Data final deve ser posterior à Data inicial'
  }

  return errors
}

class ModalProjectRoleContributor extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    try {
      if (values.id) {
        await this.props.updateProjectRoleContributor({
          variables: {
            where: {
              id: values.id
            },
            data: {
              contributor: {
                connect: {
                  id: values.contributor.id
                }
              },
              roleLevel: values.roleLevel,
              price: values.price,
              estimateEffort: values.estimateEffort,
              startAt: values.startAt.format(),
              endAt: values.endAt.format()
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Colaborador atualizado com sucesso`)
      } else {
        await this.props.createProjectRoleContributor({
          variables: {
            data: {
              contributor: {
                connect: {
                  id: values.contributor.id
                }
              },
              projectRole: {
                connect: {
                  id: this.props.projectRole.id
                }
              },
              roleLevel: values.roleLevel,
              price: values.price,
              estimateEffort: values.estimateEffort,
              startAt: values.startAt.format(),
              endAt: values.endAt.format()
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Colaborador adicionado com sucesso`)
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
      item.startAt = moment(item.startAt)
      item.endAt = moment(item.endAt)
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
              title={item ? item.name : 'Novo Colaborador'}
              visible={visible}
              onOk={handleSubmit}
              okText="Salvar"
              onCancel={onClose}
              okButtonDisabled={invalid}
              confirmLoading={submitting}
            >
              <Row type="flex" justify="space-between">
                <Col xs={24} sm={11}>
                  <Field
                    name="contributor.id"
                    type="select"
                    label="Colaborador"
                    placeholder="Colaborador"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    disabled={
                      (self.props.contributors.contributors || []).length === 0
                    }
                    component={FormInput}
                  >
                    {(self.props.contributors.contributors || []).map(function(
                      contributor
                    ) {
                      return (
                        <Select.Option
                          key={contributor.id}
                          value={contributor.id}
                        >
                          {contributor.name}
                        </Select.Option>
                      )
                    })}
                  </Field>
                </Col>

                <Col xs={24} sm={11}>
                  <Field
                    name="roleLevel"
                    type="select"
                    label="Nível"
                    placeholder="Nível"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    component={FormInput}
                  >
                    <Select.Option value="TRAINEE">Trainee</Select.Option>
                    <Select.Option value="JUNIOR">Junior</Select.Option>
                    <Select.Option value="INTERMEDIATE">Pleno</Select.Option>
                    <Select.Option value="SENIOR">Sênior</Select.Option>
                    <Select.Option value="EXPERT">Especialista</Select.Option>
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
                    name="price"
                    type="number"
                    label="Custo/hora"
                    placeholder="0,00"
                    formatter={formatFloatToMoney}
                    parser={parserMoneyToFloat}
                    min={0}
                    component={FormInput}
                  />
                </Col>
              </Row>

              <Row type="flex" justify="space-between">
                <Col sm={24} md={11}>
                  <Field
                    name="startAt"
                    type="datepicker"
                    label="Data Início"
                    placeholder="00/00/0000"
                    component={FormInput}
                  />
                </Col>

                <Col sm={24} md={11}>
                  <Field
                    name="endAt"
                    type="datepicker"
                    label="Data Fim"
                    placeholder="00/00/0000"
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

const GET_CONTRIBUTORS = gql`
  query GetRoles {
    contributors {
      id
      name
    }
  }
`

const CREATE_PROJECT_ROLE_CONTRIBUTOR = gql`
  mutation CreateProjectRoleContributor(
    $data: ProjectRoleContributorCreateInput!
  ) {
    createProjectRoleContributor(data: $data) {
      id
    }
  }
`

const UPDATE_PROJECT_ROLE_CONTRIBUTOR = gql`
  mutation UpdateProjectRoleContributor(
    $data: ProjectRoleContributorUpdateInput!
    $where: ProjectRoleContributorWhereUniqueInput!
  ) {
    updateProjectRoleContributor(where: $where, data: $data) {
      id
    }
  }
`

const withGraphql = compose(
  graphql(GET_CONTRIBUTORS, {
    name: 'contributors'
  }),
  graphql(CREATE_PROJECT_ROLE_CONTRIBUTOR, {
    name: 'createProjectRoleContributor'
  }),
  graphql(UPDATE_PROJECT_ROLE_CONTRIBUTOR, {
    name: 'updateProjectRoleContributor'
  })
)

export default withGraphql(ModalProjectRoleContributor)
