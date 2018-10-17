import React from 'react'

import { Form, Field } from 'react-final-form'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Card from 'antd/lib/card'
import Button from 'antd/lib/button'
import Collapse, { Panel } from 'antd/lib/collapse'

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

const roleLevelTypesTranslate = {
  TRAINEE: 'Trainee',
  JUNIOR: 'Junior',
  INTERMEDIATE: 'Pleno',
  SENIOR: 'Sênior',
  EXPERT: 'Especialista'
}

function validate(values) {
  const errors = {
    roleLevels: []
  }

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Campo nome é obrigatório!'
  }

  values.roleLevels.forEach(function(item, index) {
    if (item.priceMin > item.priceMax) {
      errors.roleLevels[index] = {
        priceMin: 'Valor Mínimo deve ser menor que Valor Máximo!',
        priceMax: 'Valor Máximo deve ser maior que Valor Mínimo!'
      }
    }
  })

  return errors
}

function formatFloatToMoney(value) {
  return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function parserMoneyToFloat(value) {
  return value.replace(/\$\s?|(,*)/g, '')
}

/**
 * Componente responsável por exibir o crud de Roles
 * e executar metodos de alteracao e criacao
 */
function RolesForm(props) {
  return (
    <Form
      validate={validate}
      onSubmit={props.onSubmit}
      initialValues={props.initialValues}
    >
      {function({ handleSubmit, submitting, invalid, values }) {
        return (
          <>
            <Card title="Papel" style={styles.card}>
              <Row type="flex" justify="space-between">
                <Col sm={24} md={11}>
                  <Field
                    name="name"
                    type="text"
                    label="Name"
                    placeholder="Digite o nome do papel"
                    component={FormInput}
                  />
                </Col>
                <Col sm={24} md={11}>
                  <Field
                    name="department"
                    type="text"
                    label="Departamento"
                    placeholder="Digite o nome do Departamento"
                    component={FormInput}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <Field
                    name="description"
                    type="textarea"
                    label="Descrição"
                    placeholder="Digite o nome do Departamento"
                    component={FormInput}
                  />
                </Col>
              </Row>
            </Card>

            <Card title="Níveis" style={styles.card}>
              <Collapse bordered={true} accordion={true}>
                {/* Percorre os levels criando os itens do colapse */}
                {values.roleLevels.map(function(item, index) {
                  return (
                    <Panel
                      header={roleLevelTypesTranslate[item.level]}
                      key={index}
                      style={styles.headerCollapse}
                    >
                      <Row type="flex" justify="space-between">
                        <Col md={11}>
                          <Field
                            name={`roleLevels[${index}].priceMin`}
                            type="number"
                            label="Valor Mínimo (p/ Hr)"
                            placeholder="0,00"
                            formatter={formatFloatToMoney}
                            parser={parserMoneyToFloat}
                            style={styles.prices}
                            min={0}
                            component={FormInput}
                          />
                        </Col>
                        <Col md={11}>
                          <Field
                            name={`roleLevels[${index}].priceMax`}
                            type="number"
                            label="Valor Máximo (p/ Hr)"
                            placeholder="0,00"
                            formatter={formatFloatToMoney}
                            parser={parserMoneyToFloat}
                            style={styles.prices}
                            min={0}
                            component={FormInput}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Field
                            name={`roleLevels[${index}].experience`}
                            type="textarea"
                            label="Experiência Exigida"
                            placeholder="Descreva o papel"
                            component={FormInput}
                          />
                        </Col>
                      </Row>
                    </Panel>
                  )
                })}
              </Collapse>
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

export default RolesForm
