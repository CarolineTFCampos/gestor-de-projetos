import React from 'react'

import Tabs from 'antd/lib/tabs'

import ProjectRelease from './ProjectRelease'
import ProjectIteration from './ProjectIteration'

const TabPane = Tabs.TabPane

function ProjectSchedulea(props) {
  return (
    <Tabs defaultActiveKey="releases">
      <TabPane tab="Releases" key="releases">
        <ProjectRelease project={props.project} />
      </TabPane>
      <TabPane tab="Iterações" key="iterations">
        <ProjectIteration project={props.project} />
      </TabPane>
    </Tabs>
  )
}

export default ProjectSchedulea
