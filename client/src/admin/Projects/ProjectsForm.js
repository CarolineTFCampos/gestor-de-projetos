import React from 'react'

import { Form, Field } from 'react-final-form'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Card from 'antd/lib/card'
import Button from 'antd/lib/button'

import FormInput from '../../components/FormInput'
import FixedFooter from '../../components/FixedFooter'

const styles = {
  card: {
    marginBottom: '10px',
    backgroundColor: '#fff'
  }
}

function validate(values) {
  const errors = {}

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Nome é obrigatório!'
  }

  if (!values.sponsor || values.sponsor.trim() === '') {
    errors.sponsor = 'Patrocinador é obrigatório!'
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

function ProjectsForm(props) {
  return (
    <Form
      validate={validate}
      onSubmit={props.onSubmit}
      initialValues={props.initialValues || {}}
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
                    label="Nome"
                    placeholder="Nome"
                    component={FormInput}
                  />
                </Col>
                <Col sm={24} md={8}>
                  <Field
                    name="startAt"
                    type="datepicker"
                    label="Data Início"
                    placeholder="00/00/0000"
                    component={FormInput}
                  />
                </Col>
              </Row>
              <Row type="flex" justify="space-between">
                <Col sm={24} md={15}>
                  <Field
                    name="sponsor"
                    type="text"
                    label="Patrocinador"
                    placeholder="Patrocinador"
                    component={FormInput}
                  />
                </Col>
                <Col sm={24} md={8}>
                  <Field
                    name="endAt"
                    type="datepicker"
                    label="Data Fim"
                    placeholder="00/00/0000"
                    component={FormInput}
                  />
                </Col>
              </Row>
            </Card>

            {/* <Col sm={24} md={8}>
                <Card title="Status" style={styles.card}>
                  <Progress type="circle" percent={75} />
                </Card>
              </Col> */}

            <Card title="Dados de Abertura" style={styles.card}>
              <Col sm={24} md={24}>
                <Field
                  name="objectives"
                  type="textarea"
                  label="Objetivos"
                  placeholder="Descreva os objetivos do projeto"
                  component={FormInput}
                />
              </Col>
              <Col sm={24} md={24}>
                <Field
                  name="motivations"
                  type="textarea"
                  label="Motivações"
                  placeholder="Descreva as motivações do projeto"
                  component={FormInput}
                />
              </Col>
              <Col sm={24} md={24}>
                <Field
                  name="limitations"
                  type="textarea"
                  label="Limitações"
                  placeholder="Descreva as limitações do projeto"
                  component={FormInput}
                />
              </Col>
              <Col sm={24} md={24}>
                <Field
                  name="restrictions"
                  type="textarea"
                  label="Restrições"
                  placeholder="Descreva as restrições do projeto"
                  component={FormInput}
                />
              </Col>
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
          </>
        )
      }}
    </Form>
  )
}

export default ProjectsForm
