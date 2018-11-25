import React from 'react'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Card from 'antd/lib/card'

import { formatDate } from '../../utils'

const styles = {
  cardInfoCol: {
    margin: '10px'
  }
}

function CardInfoItem(props) {
  return (
    <>
      <strong>{props.title}: </strong> {props.children}
    </>
  )
}

function ProjectInfo(props) {
  return (
    <Card>
      <Row>
        <h1>{props.project.name}</h1>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={11} style={styles.cardInfoCol}>
          <CardInfoItem title="Patrocinador">
            {props.project.sponsor}
          </CardInfoItem>
        </Col>

        <Col xs={24} md={5} style={styles.cardInfoCol}>
          <CardInfoItem title="Data inicio">
            {formatDate(props.project.startAt)}
          </CardInfoItem>
        </Col>

        <Col xs={24} md={5} style={styles.cardInfoCol}>
          <CardInfoItem title="Data fim">
            {formatDate(props.project.endAt)}
          </CardInfoItem>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={11} style={styles.cardInfoCol}>
          <CardInfoItem title="Objetivos">
            {props.project.objectives}
          </CardInfoItem>
        </Col>

        <Col xs={24} md={11} style={styles.cardInfoCol}>
          <CardInfoItem title="Motivações">
            {props.project.motivations}
          </CardInfoItem>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={11} style={styles.cardInfoCol}>
          <CardInfoItem title="Limitações">
            {props.project.limitations}
          </CardInfoItem>
        </Col>

        <Col xs={24} md={11} style={styles.cardInfoCol}>
          <CardInfoItem title="Restrições">
            {props.project.restrictions}
          </CardInfoItem>
        </Col>
      </Row>
    </Card>
  )
}

export default ProjectInfo
