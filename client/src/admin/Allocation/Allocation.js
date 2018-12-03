import React, { Component } from 'react'

import moment from 'moment'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import Card from 'antd/lib/card'
import Table from 'antd/lib/table'

import Title from '../../components/Title'

import { formatDate, formatMinutesToHour } from '../../utils'

class Allocation extends Component {
  constructor(props) {
    super(props)

    this.columns = [
      {
        key: 'name',
        title: 'Nome',
        dataIndex: 'name'
      }
    ]

    this.nestedColumns = [
      {
        key: 'projectRole.project.name',
        dataIndex: 'projectRole.project.name',
        title: 'Projeto'
      },
      {
        key: 'estimateEffort',
        dataIndex: 'estimateEffort',
        title: 'Esforço Estimado',
        render: function(text) {
          return formatMinutesToHour(text)
        }
      },
      {
        key: 'startAt',
        dataIndex: 'startAt',
        title: 'Dt. Inicio',
        render: function(text) {
          return formatDate(text)
        }
      },
      {
        key: 'endAt',
        dataIndex: 'endAt',
        title: 'Dt. Fim',
        render: function(text) {
          return formatDate(text)
        }
      }
    ]
  }

  render() {
    const self = this

    return (
      <>
        <Title>
          <h2>Alocações</h2>
        </Title>

        <Card>
          <Table
            rowKey="id"
            columns={this.columns}
            dataSource={this.props.data.contributors || []}
            pagination={false}
            expandedRowRender={function(contributor) {
              return (
                <Table
                  rowKey="id"
                  columns={self.nestedColumns}
                  dataSource={contributor.projectRoles}
                  pagination={false}
                />
              )
            }}
            loading={this.props.data.loading}
          />
        </Card>
      </>
    )
  }
}

const GET_CONTRIBUTORS = gql`
  query GetContributors($date: DateTime) {
    contributors {
      id
      name
      projectRoles(where: { endAt_gte: $date }) {
        estimateEffort
        startAt
        endAt
        projectRole {
          project {
            name
          }
        }
      }
    }
  }
`

const withGraphql = graphql(GET_CONTRIBUTORS, {
  options: {
    variables: {
      date: moment().format()
    }
  }
})

export default withGraphql(Allocation)
