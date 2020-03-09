import React, { useState } from 'react'

import { Row, Col, Tabs, Input, Button, message, Radio } from 'antd'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Mapping from '../components/Mapping'
import { mapper, addObjectType } from '../components/service'
import { useUndo, usePersistentState } from '../hooks'

const { TabPane } = Tabs
const { TextArea } = Input

const IndexPage = () => {
  // const [data, setData] = useState({})
  const [data, updateData, undo, redo, canUndo, canRedo, key] = useUndo(
    useState({})
  )
  const [inputType, changeInputType] = useState('json')
  const [inputData, changeInputData] = useState('')
  const [isSubmitted, submit] = useState(false)

  const setData = data => {
    updateData(data)
  }

  const submitJson = (type, _inputData) => {
    try {
      const _data = JSON.parse(_inputData.trim())

      if (type === 'mapping') {
        if (!('properties' in _data)) {
          message.error(
            'Invalid mapping. Please check. mappings should be present in root'
          )
        } else {
          setData(addObjectType(_data.properties))
          submit(true)
        }
      } else {
        // JSON type
        setData(mapper(_data))
        submit(true)
      }
    } catch (e) {
      message.error('Invalid JSON. Please check')
    }
  }
  console.log('data section', data, key)
  return (
    <Layout>
      <SEO title="JSON to ES mapping transformer" />

      {!isSubmitted && (
        <>
          <Radio.Group
            defaultValue={inputType}
            onChange={e => changeInputType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="json">JSON</Radio.Button>
            <Radio.Button value="mapping">Mapping</Radio.Button>
          </Radio.Group>
          <TextArea
            placeholder="Please put your raw json here."
            autosize={{ minRows: 24 }}
            onChange={e => changeInputData(e.target.value)}
          />
          <br />
          <br />
          <center>
            <Button
              onClick={() => submitJson(inputType, inputData)}
              type="primary"
            >
              Submit
            </Button>
          </center>
        </>
      )}
      {isSubmitted && (
        <Row>
          <Col span={11}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Input" key="1">
                <pre>
                  <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
              </TabPane>
            </Tabs>
          </Col>
          <Col span={11} offset={2}>
            {/* <Tabs defaultActiveKey="0">
              <TabPane tab="Mapping - Editor" key="0"> */}
            <Mapping
              data={data}
              key={key}
              setData={setData}
              undo={undo}
              redo={redo}
              canRedo={canRedo}
              canUndo={canUndo}
            />
            {/* </TabPane>
            </Tabs> */}
          </Col>
        </Row>
      )}
    </Layout>
  )
}

export default IndexPage
