import React, { useState } from 'react'

import { Row, Col, Tabs, Input, Button, message } from 'antd'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Mapping from '../components/Mapping'

const { TabPane } = Tabs
const { TextArea } = Input

const IndexPage = () => {
  const [data, setData] = useState({})
  const [isSubmitted, submit] = useState(false)
  const submitJson = () => {
    try {
      const _data = JSON.parse(data.trim())
      setData({ ..._data })
      submit(true)
    } catch (e) {
      message.error('Invalid JSON. Please check')
    }
  }
  return (
    <Layout>
      <SEO title="JSON to ES mapping transformer" />

      {!isSubmitted && (
        <>
          <TextArea
            placeholder="Please put your raw json here."
            autosize={{ minRows: 24 }}
            onChange={e => setData(e.target.value)}
          />
          <br />
          <br />
          <center>
            <Button onClick={() => submitJson()} type="primary">
              Submit
            </Button>
          </center>
        </>
      )}
      {isSubmitted && (
        <Row>
          <Col span={11}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Data" key="1">
                <pre>
                  <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
              </TabPane>
            </Tabs>
          </Col>
          <Col span={11} offset={2}>
            <Tabs defaultActiveKey="0">
              <TabPane tab="Mapping" key="0">
                <Mapping data={data} />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      )}
    </Layout>
  )
}

export default IndexPage
