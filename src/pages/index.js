import React, { useState } from 'react'

import { Row, Col, Tabs, Input, Button, message } from 'antd'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Mapping from '../components/Mapping'

const { TabPane } = Tabs
const { TextArea } = Input

const sampleData = {
  users: [
    {
      name: 'Balpreet Singh',
      email: 'knowbalpreet@gmail.com',
      createdOn: '',
      modifiedOn: '',
      permissions: {},
      customAttributes: {
        fonts: [1, 2, 3],
        templates: [1, 2, 3],
        audios: [1, 2, 3],
      },
    },
  ],
  permissions: {},
  profiles: [],
  createdOn: '',
  customAttributes: {
    fonts: [1, 2, 3],
    templates: [1, 2, 3],
    audios: [1, 2, 3],
  },
}

const IndexPage = () => {
  const [data, setData] = useState({})
  const [isSubmitted, submit] = useState(false)
  const submitJson = () => {
    try {
      const _data = JSON.parse(data.trim())
      console.log('_data', _data)
      setData({ ..._data })
      submit(true)
    } catch (e) {
      message.error('Invalid JSON. Please check')
      console.log('Invalid JSON. Please check', data, e, typeof data)
    }
  }
  console.log('data', data, isSubmitted)
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
            <Tabs defaultActiveKey="1" onChange={e => console.log(e)}>
              <TabPane tab="Data" key="1">
                <pre>
                  <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
              </TabPane>
            </Tabs>
          </Col>
          <Col span={11} offset={2}>
            <Tabs defaultActiveKey="0" onChange={e => console.log(e)}>
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
