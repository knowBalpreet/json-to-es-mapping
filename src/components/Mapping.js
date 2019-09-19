import React, { useEffect, useState } from 'react'
import ReactJson from 'react-json-view'
import set from 'lodash.set'
import { Button } from 'antd'
import MappingModal from './MappingModal'
import { mapper } from './service'

const Mapping = ({ data }) => {
  const [mappedData, setMappedData] = useState({ ...data })
  const [editData, setEditData] = useState({ status: false })
  useEffect(() => {
    console.log('data', data)
    const output = mapper(data)
    console.log('output', output)
    setMappedData(output)
  }, [data])

  console.log('states', editData, mappedData)

  return (
    <div>
      {/* <pre>
        <code>{JSON.stringify(mappedData, null, 2)}</code>
      </pre> */}
      <Button
        onClick={() => {
          const container = document.createElement('textarea')
          const val = { properties: mappedData }

          container.innerHTML =
            typeof val === 'string' ? val : JSON.stringify(val, null, '  ')

          document.body.appendChild(container)
          container.select()
          document.execCommand('copy')
          document.body.removeChild(container)
        }}
      >
        Copy Mapping
      </Button>
      <pre>
        Click on type value to edit mapping <br />
      </pre>
      {editData.status && (
        <MappingModal
          editData={editData}
          setEditData={setEditData}
          mappedData={mappedData}
          setMappedData={setMappedData}
        />
      )}
      <ReactJson
        indentWidth={2}
        displayDataTypes={false}
        src={mappedData}
        // onEdit={edit => console.log('Edit', edit)}
        defaultValue="keyword"
        onSelect={select => {
          setEditData({ status: true, ...select })
        }}
        enableClipboard={false}
        // enableClipboard={copy => {
        // const container = document.createElement('textarea')
        // const val = { properties: copy.src }

        // container.innerHTML =
        //   typeof val === 'string' ? val : JSON.stringify(val, null, '  ')

        // document.body.appendChild(container)
        // container.select()
        // document.execCommand('copy')
        // document.body.removeChild(container)
        // }}
      />
    </div>
  )
}
export default Mapping
