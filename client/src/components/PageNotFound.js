import React from 'react'

import Row from 'antd/lib/row'
import Col from 'antd/lib/col'

function PageNotFound() {
  return (
    <Row type="flex" align="center" justify="center" style={{ height: '100%' }}>
      <Row type="flex" align="middle" justify="space-between">
        <Col xs={24} md={12} align="right" justify="center">
          <img
            src="/images/404-notfound.svg"
            alt="Oooops"
            style={{ width: '70%', align: 'right' }}
          />
        </Col>
        <Col xs={24} md={11}>
          <h1>404</h1>
          <h4>Página não encontrada!</h4>
        </Col>
      </Row>
    </Row>
  )
}

export default PageNotFound
