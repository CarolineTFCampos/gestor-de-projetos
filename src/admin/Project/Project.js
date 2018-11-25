import React from 'react'
// import { Switch, Route } from 'react-router-dom'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import Tabs from 'antd/lib/tabs'
import Card from 'antd/lib/card'

import Loading from '../../components/Loading'

import ProjectInfo from './ProjectInfo'
import ProjectTeam from './ProjectTeam'
import ProjectScope from './ProjectScope'
import ProjectGantt from './ProjectGantt'
import ProjectMilestone from './ProjectMilestone'

const TabPane = Tabs.TabPane

function Project(props) {
  return (
    <>
      {props.data.loading && <Loading />}

      {props.data.project && <ProjectInfo project={props.data.project} />}

      {props.data.project && (
        <Card>
          <Tabs defaultActiveKey="team">
            <TabPane tab="Sobre" key="plan">
              <h2>Sobre</h2>
            </TabPane>
            <TabPane tab="Escopo" key="scope">
              <ProjectScope project={props.data.project} />
            </TabPane>
            <TabPane tab="Equipe" key="team">
              <ProjectTeam project={props.data.project} />
            </TabPane>
            <TabPane tab="Riscos" key="risk">
              <h2>Riscos</h2>
            </TabPane>
            <TabPane tab="Marcos" key="milestones">
              <ProjectMilestone project={props.data.project} />
            </TabPane>
            <TabPane tab="Cronograma" key="gantt">
              <ProjectGantt project={props.data.project} />
            </TabPane>
            <TabPane tab="Recursos" key="resources">
              <h2>Recursos Fisico</h2>
            </TabPane>
            <TabPane tab="Orçamento ??" key="price">
              <h2>Orçamento TeamWork</h2>
            </TabPane>
          </Tabs>
        </Card>
      )}
    </>
  )
}

const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(where: { id: $id }) {
      id
      name
      sponsor
      status
      startAt
      endAt
      objectives
      motivations
      limitations
      restrictions
      createdAt
      updatedAt
      projectRoles {
        id
        estimatePrice
        estimateEffort
        role {
          id
          name
        }
        contributors {
          id
          price
          effort
          estimateEffort
          startAt
          endAt
          roleLevel
          contributor {
            id
            name
            twPeopleId
          }
          projectRole {
            project {
              twProjectId
            }
          }
        }
      }
      milestones {
        id
        name
        status
        dueDate
        description
        contributor {
          id
          name
        }
      }
      features {
        id
        name
        description
        priority
        estimateSize
        estimatePrice
        estimateEffort
        estimateStart
        estimateEnd
        twTaskId
        epics {
          id
          name
          description
          priority
          estimateSize
          estimatePrice
          estimateEffort
          estimateStart
          estimateEnd
          twTaskId
          userStories {
            id
            name
            description
            priority
            estimateEffort
            estimateStart
            estimateEnd
            twTaskId
          }
        }
      }
    }
  }
`

const withGraphql = graphql(GET_PROJECT, {
  options: function(props) {
    return {
      variables: {
        id: props.match.params.id
      }
    }
  }
})

export default withGraphql(Project)
