import React from 'react'

import { Form, Field } from 'react-final-form'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Card from 'antd/lib/card'
import Button from 'antd/lib/button'
import Table from 'antd/lib/table'
import Popconfirm from 'antd/lib/popconfirm'
import ButtonGroup from 'antd/lib/button/button-group'
// import message from 'antd/lib/message'

import FormInput from '../../components/FormInput'
import FixedFooter from '../../components/FixedFooter'

const styles = {
  card: {
    marginBottom: '10px',
    backgroundColor: '#fff'
  },
  prices: {
    width: '100%'
  },
  headerCollapse: {
    fontWeight: '500'
  }
}

function validate(values) {
  const errors = {}

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Campo nome é obrigatório!'
  }

  if (!values.email || values.email.trim() === '') {
    errors.email = 'Campo email é obrigatório!'
  }

  if (!values.doc || values.doc.trim() === '') {
    errors.doc = 'Campo CPF é obrigatório!'
  }

  return errors
}

function formatFloatToMoney(value) {
  return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function parserMoneyToFloat(value) {
  return value.replace(/\$\s?|(,*)/g, '')
}

function ContributorForm(props) {
  const columnsFormation = [
    {
      key: 'name',
      title: 'Período',
      dataIndex: 'name'
    },
    {
      key: 'role',
      title: 'Curso',
      dataIndex: 'role'
    },
    {
      key: 'action',
      title: 'Ações',
      align: 'right',
      render: function(text, record) {
        return (
          <span>
            <ButtonGroup>
              <Button
                icon="edit"
                onClick={function() {
                  this.handleEdit(record.id)
                }}
              />

              <Popconfirm
                placement="topRight"
                title="Tem certeza que deseja deletar?"
                okText="Sim"
                cancelText="Não"
                onConfirm={function() {
                  this.handleDelete(record.id)
                }}
              >
                <Button type="danger" icon="delete" />
              </Popconfirm>
            </ButtonGroup>
          </span>
        )
      }
    }
  ]

  const columnsExperience = [
    {
      key: 'name',
      title: 'Período',
      dataIndex: 'name'
    },
    {
      key: 'role',
      title: 'Cargo',
      dataIndex: 'role'
    },
    {
      key: 'action',
      title: 'Ações',
      align: 'right',
      render: function(text, record) {
        return (
          <span>
            <ButtonGroup>
              <Button
                icon="edit"
                onClick={function() {
                  this.handleEdit(record.id)
                }}
              />

              <Popconfirm
                placement="topRight"
                title="Tem certeza que deseja deletar?"
                okText="Sim"
                cancelText="Não"
                onConfirm={function() {
                  this.handleDelete(record.id)
                }}
              >
                <Button type="danger" icon="delete" />
              </Popconfirm>
            </ButtonGroup>
          </span>
        )
      }
    }
  ]

  return (
    <Form
      validate={validate}
      onSubmit={props.onSubmit}
      initialValues={props.initialValues}
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
                    name="price"
                    type="number"
                    label="Valor p/ Hora"
                    placeholder="0,00"
                    formatter={formatFloatToMoney}
                    parser={parserMoneyToFloat}
                    style={styles.prices}
                    min={0}
                    component={FormInput}
                  />
                </Col>
              </Row>

              <Row type="flex" justify="space-between">
                <Col sm={24} md={15}>
                  <Field
                    name="email"
                    type="text"
                    label="Email"
                    placeholder="Email"
                    component={FormInput}
                  />
                </Col>
                <Col sm={24} md={8}>
                  <Field
                    name="doc"
                    type="text"
                    label="CPF"
                    placeholder="CPF"
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
                      // onClick={   }
                    />
                  </ButtonGroup>
                </span>
              }
            >
              <Table
                rowKey="id"
                columns={columnsExperience}
                dataSource={values.experiences || []}
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
                      // onClick={   }
                    />
                  </ButtonGroup>
                </span>
              }
            >
              <Table
                rowKey="id"
                columns={columnsFormation}
                dataSource={values.formations || []}
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
          </>
        )
      }}
    </Form>
  )
}

export default ContributorForm
