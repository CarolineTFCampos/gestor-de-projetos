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

import FormInput from '../../components/FormInput'

function validate(values) {
  const errors = {}

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Nome é obrigatório!'
  }

  if (!values.status) {
    errors.status = 'Estado é obrigatório!'
  }

  if (!values.contributor || !values.contributor.id) {
    errors.contributor = {
      id: 'Colaborador é obrigatório!'
    }
  }

  if (!values.dueDate || !values.dueDate.isValid()) {
    errors.dueDate = 'Data de vencimento é obrigatória!'
  }

  return errors
}

class ModalMilestone extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async handleSubmit(values) {
    try {
      if (values.id) {
        await this.props.updateMilestone({
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
              name: values.name,
              description: values.description,
              dueDate: values.dueDate,
              status: values.status
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Marco (${values.name}) atualizado com sucesso`)
      } else {
        await this.props.createMilestone({
          variables: {
            data: {
              project: {
                connect: {
                  id: this.props.project.id
                }
              },
              contributor: {
                connect: {
                  id: values.contributor.id
                }
              },
              name: values.name,
              description: values.description,
              dueDate: values.dueDate,
              status: values.status
            }
          },
          refetchQueries: ['GetProject']
        })

        // Exibe mensagem de sucesso
        message.success(`Marco (${values.name}) criado com sucesso`)
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
      item.dueDate = moment(item.dueDate)
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
              title="Novo Marco"
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
                    <Radio.Button value="OPEN">Aberto</Radio.Button>
                    <Radio.Button value="DONE">Concluído</Radio.Button>
                    <Radio.Button value="CANCELED">Cancelado</Radio.Button>
                  </Field>
                </Col>
              </Row>

              <Row type="flex" justify="space-between">
                <Col xs={24} sm={11}>
                  <Field
                    name="contributor.id"
                    type="select"
                    label="Responsável"
                    placeholder="Responsável"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    component={FormInput}
                  >
                    {self.props.project.projectRoles.map(function(projectRole) {
                      return projectRole.contributors.map(function(
                        projectRoleContributor
                      ) {
                        return (
                          <Select.Option
                            key={projectRoleContributor.contributor.id}
                            value={projectRoleContributor.contributor.id}
                          >
                            {projectRoleContributor.contributor.name}
                          </Select.Option>
                        )
                      })
                    })}
                  </Field>
                </Col>

                <Col xs={24} sm={11}>
                  <Field
                    name="dueDate"
                    type="datepicker"
                    label="Data de vencimento"
                    placeholder="Data de vencimento"
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

const CREATE_MILESTONE = gql`
  mutation CreateMilestone($data: MilestoneCreateInput!) {
    createMilestone(data: $data) {
      id
      name
    }
  }
`

const UPDATE_MILESTONE = gql`
  mutation UpdateMilestone(
    $where: MilestoneWhereUniqueInput!
    $data: MilestoneUpdateInput!
  ) {
    updateMilestone(where: $where, data: $data) {
      id
      name
    }
  }
`

const withGraphql = compose(
  graphql(CREATE_MILESTONE, {
    name: 'createMilestone'
  }),
  graphql(UPDATE_MILESTONE, {
    name: 'updateMilestone'
  })
)

export default withGraphql(ModalMilestone)
