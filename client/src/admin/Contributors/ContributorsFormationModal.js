import React, { Component } from 'react'

import { Form, Field } from 'react-final-form'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Modal from 'antd/lib/modal'

import FormInput from '../../components/FormInput'

function validate(values) {
  const errors = {}

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Nome é obrigatório!'
  }

  if (!values.institution || values.institution.trim() === '') {
    errors.institution = 'Instituição é obrigatório!'
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

class ContributorsFormationModal extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit({ index, ...values }) {
    const formations = this.props.form.getState().values.formations

    if (this.props.edit) {
      this.props.form.change(
        'formations',
        formations.map(function(item, idx) {
          return (item.id && item.id === values.id) || idx === index
            ? values
            : item
        })
      )
    } else {
      this.props.form.change('formations', [...formations, values])
    }

    this.props.onClose()
  }

  render() {
    const { visible, onClose, item = {} } = this.props

    if (!visible) return null

    return (
      <Form
        validate={validate}
        onSubmit={this.handleSubmit}
        initialValues={item}
      >
        {function({ handleSubmit, submitting, invalid }) {
          return (
            <Modal
              title="Formação"
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
                    name="name"
                    type="text"
                    label="Nome"
                    placeholder="Nome"
                    component={FormInput}
                  />
                </Col>

                <Col xs={24} sm={11}>
                  <Field
                    name="institution"
                    type="text"
                    label="Instatituição"
                    placeholder="Instatituição"
                    component={FormInput}
                  />
                </Col>
              </Row>

              <Row type="flex" justify="space-between">
                <Col xs={24} sm={11}>
                  <Field
                    name="startAt"
                    type="datepicker"
                    label="Inicio"
                    placeholder="Inicio"
                    component={FormInput}
                  />
                </Col>

                <Col xs={24} sm={11}>
                  <Field
                    name="endAt"
                    type="datepicker"
                    label="Fim"
                    placeholder="Fim"
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

export default ContributorsFormationModal
