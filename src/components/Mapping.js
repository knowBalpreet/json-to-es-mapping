import React, { Component } from 'react'
import { Button } from 'antd'
import MappingModal from './MappingModal'
import { mapper } from './service'

class Mapping extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ReactJson: null,
      mappedData: { ...this.props.data },
      editData: {},
    }
  }

  componentDidMount() {
    import('react-json-view')
      .then(({ default: module }) => {
        console.log('module', module)
        this.setState({ ReactJson: module })
      })
      .catch(error => console.error(error))

    const output = mapper(this.props.data)
    this.setState({ mappedData: output })
  }

  render() {
    const { ReactJson, mappedData, editData } = this.state
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
        <pre style={{ padding: 5 }}>
          Click on type value to edit mapping <br />
        </pre>
        {editData.status && (
          <MappingModal
            editData={editData}
            setEditData={editData => this.setState({ editData })}
            mappedData={mappedData}
            setMappedData={mappedData => this.setState({ mappedData })}
          />
        )}
        {Boolean(ReactJson) && (
          <ReactJson
            indentWidth={2}
            displayDataTypes={false}
            src={mappedData}
            // onEdit={edit => console.log('Edit', edit)}
            defaultValue="keyword"
            onSelect={select => {
              select.status = true
              this.setState({ editData: select })
            }}
            enableClipboard={false}
          />
        )}
      </div>
    )
  }
}
export default Mapping
