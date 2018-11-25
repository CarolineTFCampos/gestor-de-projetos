import React, { Component } from 'react'

import moment from 'moment'

import { Form, Field } from 'react-final-form'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Card from 'antd/lib/card'
import Button from 'antd/lib/button'
import Table from 'antd/lib/table'
import Popconfirm from 'antd/lib/popconfirm'
import ButtonGroup from 'antd/lib/button/button-group'
// import message from 'antd/lib/message'

import { formatFloatToMoney, parserMoneyToFloat, formatDate } from '../../utils'

import FormInput from '../../components/FormInput'
import FixedFooter from '../../components/FixedFooter'

import ContributorsFormationModal from './ContributorsFormationModal'
import ContributorsExperienceModal from './ContributorsExperienceModal'

const styles = {
  card: {
    marginBottom: '10px',
    backgroundColor: '#fff'
  },
  headerCollapse: {
    fontWeight: '500'
  }
}

function validate(values) {
  const errors = {}
  const emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Nome é obrigatório!'
  }

  if (!values.email || values.email.trim() === '') {
    errors.email = 'Campo email é obrigatório!'
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Email inválido!'
  }

  if (values.emailPrivate && !emailRegex.test(values.emailPrivate)) {
    errors.emailPrivate = 'Email inválido!'
  }

  if (!values.doc || values.doc.trim() === '') {
    errors.doc = 'Documento é obrigatório!'
  }

  if (!phoneRegex.test(values.phone)) {
    errors.phone = 'Telefone inválido!'
  }

  return errors
}

class ContributorsForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      formation: null,
      experience: null,
      modalFormationEdit: false,
      modalFormationVisible: false,
      modalExperienceEdit: false,
      modalExperienceVisible: false
    }

    this.handleOpenModalFormation = this.handleOpenModalFormation.bind(this)
    this.handleCloseModalFormation = this.handleCloseModalFormation.bind(this)
    this.handleOpenModalExperience = this.handleOpenModalExperience.bind(this)
    this.handleCloseModalExperience = this.handleCloseModalExperience.bind(this)
  }

  handleOpenModalFormation(item, edit = false) {
    this.setState({
      formation: item,
      modalFormationEdit: edit,
      modalFormationVisible: true
    })
  }

  handleCloseModalFormation() {
    this.setState({
      formation: null,
      modalFormationVisible: false
    })
  }

  handleOpenModalExperience(item, edit = false) {
    this.setState({
      experience: item,
      modalExperienceEdit: edit,
      modalExperienceVisible: true
    })
  }

  handleCloseModalExperience() {
    this.setState({
      experience: null,
      modalExperienceVisible: false
    })
  }

  render() {
    const self = this

    return (
      <Form
        validate={validate}
        onSubmit={this.props.onSubmit}
        initialValues={this.props.initialValues}
      >
        {function({ handleSubmit, submitting, invalid, values, form }) {
          return (
            <>
              <Card title="Dados Principais" style={styles.card}>
                <Row type="flex" justify="space-between">
                  <Col sm={24} md={15}>
                    <Field
                      name="name"
                      type="text"
                      label="Nome Completo"
                      placeholder="Nome Completo"
                      component={FormInput}
                    />
                  </Col>
                  <Col sm={24} md={8}>
                    <Field
                      name="doc"
                      type="text"
                      label="Documento"
                      placeholder="Documento"
                      component={FormInput}
                    />
                  </Col>
                </Row>

                <Row type="flex" justify="space-between">
                  <Col sm={24} md={8}>
                    <Field
                      name="email"
                      type="text"
                      label="Email"
                      placeholder="Email corporativo"
                      component={FormInput}
                      disabled={!!self.props.initialValues.id}
                    />
                  </Col>
                  <Col sm={24} md={8}>
                    <Field
                      name="emailPrivate"
                      type="text"
                      label="Email pessoal"
                      placeholder="Email pessoal"
                      component={FormInput}
                    />
                  </Col>
                  <Col sm={24} md={7}>
                    <Field
                      name="price"
                      type="number"
                      label="Valor p/ Hora"
                      placeholder="0,00"
                      formatter={formatFloatToMoney}
                      parser={parserMoneyToFloat}
                      min={0}
                      component={FormInput}
                    />
                  </Col>
                </Row>

                <Row type="flex" justify="space-between">
                  <Col sm={24} md={15}>
                    <Field
                      name="address"
                      type="text"
                      label="Endereço"
                      placeholder="Endereço"
                      component={FormInput}
                    />
                  </Col>
                  <Col sm={24} md={8}>
                    <Field
                      name="phone"
                      type="text"
                      label="Telefone"
                      placeholder="Telefone"
                      component={FormInput}
                    />
                  </Col>
                </Row>
              </Card>

              <Card
                title="Experiência Profissional"
                style={styles.card}
                extra={
                  <span>
                    <ButtonGroup>
                      <Button
                        icon="plus"
                        onClick={function() {
                          self.handleOpenModalExperience()
                        }}
                      />
                    </ButtonGroup>
                  </span>
                }
              >
                <Table
                  rowKey={function(record) {
                    return (
                      record.id ||
                      Math.random()
                        .toString(36)
                        .substring(2) + new Date().getTime().toString(36)
                    )
                  }}
                  dataSource={values.experiences || []}
                  columns={[
                    {
                      key: 'startAt',
                      title: 'Dt Início',
                      dataIndex: 'startAt',
                      align: 'center',
                      width: '115px',
                      defaultSortOrder: 'ascend',
                      sorter: function(a, b) {
                        return moment(a.startAt) - moment(b.startAt)
                      },
                      render: function(text) {
                        return formatDate(text)
                      }
                    },
                    {
                      key: 'endAt',
                      title: 'Dt Fim',
                      dataIndex: 'endAt',
                      align: 'center',
                      width: '115px',
                      defaultSortOrder: 'ascend',
                      sorter: function(a, b) {
                        return moment(a.endAt) - moment(b.endAt)
                      },
                      render: function(text) {
                        return formatDate(text)
                      }
                    },
                    {
                      key: 'name',
                      title: 'Nome',
                      dataIndex: 'name'
                    },
                    {
                      key: 'company',
                      title: 'Empresa',
                      dataIndex: 'company'
                    },
                    {
                      key: 'action',
                      title: 'Ações',
                      align: 'right',
                      render: function(text, record, index) {
                        return (
                          <span>
                            <ButtonGroup>
                              <Button
                                icon="edit"
                                onClick={function() {
                                  self.handleOpenModalExperience(
                                    { ...record, index },
                                    true
                                  )
                                }}
                              />

                              <Popconfirm
                                placement="topRight"
                                title="Tem certeza que deseja deletar?"
                                okText="Sim"
                                cancelText="Não"
                                onConfirm={function() {
                                  const experiences = form.getState().values
                                    .experiences

                                  form.change(
                                    'experiences',
                                    experiences.filter(function(item, idx) {
                                      return record.id
                                        ? item.id !== record.id
                                        : idx !== index
                                    })
                                  )
                                }}
                              >
                                <Button type="danger" icon="delete" />
                              </Popconfirm>
                            </ButtonGroup>
                          </span>
                        )
                      }
                    }
                  ]}
                />
              </Card>

              <Card
                title="Formação Acadêmica"
                style={styles.card}
                extra={
                  <span>
                    <ButtonGroup>
                      <Button
                        icon="plus"
                        onClick={function() {
                          self.handleOpenModalFormation()
                        }}
                      />
                    </ButtonGroup>
                  </span>
                }
              >
                <Table
                  rowKey={function(record) {
                    return (
                      record.id ||
                      Math.random()
                        .toString(36)
                        .substring(2) + new Date().getTime().toString(36)
                    )
                  }}
                  dataSource={values.formations || []}
                  columns={[
                    {
                      key: 'startAt',
                      title: 'Dt Início',
                      dataIndex: 'startAt',
                      align: 'center',
                      width: '115px',
                      defaultSortOrder: 'ascend',
                      sorter: function(a, b) {
                        return moment(a.startAt) - moment(b.startAt)
                      },
                      render: function(text) {
                        return formatDate(text)
                      }
                    },
                    {
                      key: 'endAt',
                      title: 'Dt Fim',
                      dataIndex: 'endAt',
                      align: 'center',
                      width: '115px',
                      defaultSortOrder: 'ascend',
                      sorter: function(a, b) {
                        return moment(a.endAt) - moment(b.endAt)
                      },
                      render: function(text) {
                        return formatDate(text)
                      }
                    },
                    {
                      key: 'name',
                      title: 'Nome',
                      dataIndex: 'name'
                    },
                    {
                      key: 'institution',
                      title: 'Instituição',
                      dataIndex: 'institution'
                    },
                    {
                      key: 'action',
                      title: 'Ações',
                      align: 'right',
                      render: function(text, record, index) {
                        return (
                          <span>
                            <ButtonGroup>
                              <Button
                                icon="edit"
                                onClick={function() {
                                  self.handleOpenModalFormation(
                                    { ...record, index },
                                    true
                                  )
                                }}
                              />

                              <Popconfirm
                                placement="topRight"
                                title="Tem certeza que deseja deletar?"
                                okText="Sim"
                                cancelText="Não"
                                onConfirm={function() {
                                  const formations = form.getState().values
                                    .formations

                                  form.change(
                                    'formations',
                                    formations.filter(function(item, idx) {
                                      return record.id
                                        ? item.id !== record.id
                                        : idx !== index
                                    })
                                  )
                                }}
                              >
                                <Button type="danger" icon="delete" />
                              </Popconfirm>
                            </ButtonGroup>
                          </span>
                        )
                      }
                    }
                  ]}
                />
              </Card>

              <FixedFooter>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={invalid}
                  loading={submitting}
                  onClick={handleSubmit}
                >
                  Salvar
                </Button>
              </FixedFooter>

              <ContributorsFormationModal
                form={form}
                item={self.state.formation}
                edit={self.state.modalFormationEdit}
                visible={self.state.modalFormationVisible}
                onClose={function() {
                  self.handleCloseModalFormation()
                }}
              />

              <ContributorsExperienceModal
                form={form}
                item={self.state.experience}
                edit={self.state.modalExperienceEdit}
                visible={self.state.modalExperienceVisible}
                onClose={function() {
                  self.handleCloseModalExperience()
                }}
              />
            </>
          )
        }}
      </Form>
    )
  }
}

export default ContributorsForm
