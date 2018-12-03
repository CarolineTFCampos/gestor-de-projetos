import React from 'react'

import { Footer } from 'antd/lib/layout'

const styles = {
  footer: {
    position: 'fixed',
    width: '100%',
    bottom: '0',
    right: '0',
    height: '56px',
    lineHeight: '56px',
    boxShadow: '0 -1px 2px rgba(0, 0, 0, .03)',
    borderTop: '1px solid #e8e8e8',
    padding: '0 24px',
    zIndex: '9',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
}

function FixedFooter(props) {
  return <Footer style={styles.footer}>{props.children}</Footer>
}

export default FixedFooter
