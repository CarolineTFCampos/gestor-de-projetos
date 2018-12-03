import React from 'react'

import Spin from 'antd/lib/spin'

function Loading() {
  return (
    <Spin size="large" style={{ margin: '100px auto', display: 'block' }} />
  )
}

export default Loading
