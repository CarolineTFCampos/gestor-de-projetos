import React from 'react'

import Tabs from 'antd/lib/tabs'

import ProjectRelease from './ProjectRelease'

const TabPane = Tabs.TabPane

function ProjectSchedulea(props) {
  return (
    <Tabs defaultActiveKey="releases">
      <TabPane tab="Releases" key="releases">
        <ProjectRelease project={props.project} />
      </TabPane>
      <TabPane tab="Sprints" key="sprints">
        <h2>SPRINTS</h2>
      </TabPane>
      <TabPane tab="Gantt" key="gantt">
        <h2>GANTT</h2>
      </TabPane>
    </Tabs>
  )
}

export default ProjectSchedulea
