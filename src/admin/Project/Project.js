import React from 'react'
// import { Switch, Route } from 'react-router-dom'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import Tabs from 'antd/lib/tabs'
import Card from 'antd/lib/card'

import Loading from '../../components/Loading'

import ProjectInfo from './ProjectInfo'
import ProjectTeam from './ProjectTeam'
import ProjectRisk from './ProjectRisk'
import ProjectScope from './ProjectScope'
import ProjectSchedule from './ProjectSchedule'
import ProjectMilestone from './ProjectMilestone'

const TabPane = Tabs.TabPane

function Project(props) {
  return (
    <>
      {props.data.loading && <Loading />}

      {props.data.project && <ProjectInfo project={props.data.project} />}

      {props.data.project && (
        <Card>
          <Tabs defaultActiveKey="risk">
            <TabPane tab="Sobre" key="about">
              <h2>Sobre</h2>
            </TabPane>
            <TabPane tab="Escopo" key="scope">
              <ProjectScope project={props.data.project} />
            </TabPane>
            <TabPane tab="Equipe" key="team">
              <ProjectTeam project={props.data.project} />
            </TabPane>
            <TabPane tab="Riscos" key="risk">
              <ProjectRisk project={props.data.project} />
            </TabPane>
            <TabPane tab="Marcos" key="milestones">
              <ProjectMilestone project={props.data.project} />
            </TabPane>
            <TabPane tab="Cronograma" key="schedule">
              <ProjectSchedule project={props.data.project} />
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
      risks {
        id
        name
        plan
        probability
        impact
        status
        createdAt
        updatedAt
      }
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
      releases {
        id
        name
        status
        startAt
        endAt
      }
      iterations {
        id
        name
        status
        startAt
        endAt
        release {
          id
          name
          status
        }
      }
      epics {
        id
        name
        description
        priority
        status
        estimateSize
        estimatePrice
        estimateEffort
        estimateStart
        estimateEnd
        twTaskId
        release {
          id
          name
          status
        }
        userStories {
          id
          name
          description
          priority
          status
          effort
          estimateEffort
          estimateStart
          estimateEnd
          twTaskId
          epic {
            project {
              twProjectId
            }
          }
          iteration {
            id
            name
            status
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
