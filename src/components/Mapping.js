import React, { Component } from 'react'
import { Button, Tooltip } from 'antd'
import MappingModal from './MappingModal'

const ButtonGroup = Button.Group

class Mapping extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ReactJson: null,
      mappedData: {},
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
    const { data } = this.props

    this.setState({ mappedData: data })
  }

  setMappedData = mappedData => {
    this.setState({ mappedData })
    this.props.setData(mappedData)
  }

  render() {
    const { ReactJson, mappedData, editData } = this.state
    const { undo, redo, canUndo, canRedo } = this.props
    return (
      <div>
        <ButtonGroup>
          <Tooltip title="Copy mapping">
            <Button
              size="large"
              onClick={() => {
                const container = document.createElement('textarea')
                const val = { properties: mappedData }

                container.innerHTML =
                  typeof val === 'string'
                    ? val
                    : JSON.stringify(val, null, '  ')

                document.body.appendChild(container)
                container.select()
                document.execCommand('copy')
                document.body.removeChild(container)
              }}
              type="primary"
              icon="copy"
            />
          </Tooltip>
          <Tooltip title="Undo">
            <Button
              size="large"
              disabled={!canUndo}
              onClick={undo}
              type="primary"
              icon="undo"
            />
          </Tooltip>
          <Tooltip title="Rndo">
            <Button
              size="large"
              disabled={!canRedo}
              onClick={redo}
              type="primary"
              icon="redo"
            />
          </Tooltip>
        </ButtonGroup>
        <pre style={{ padding: 5 }}>
          Click on type value to edit mapping <br />
        </pre>
        {editData.status && (
          <MappingModal
            editData={editData}
            setEditData={editData => this.setState({ editData })}
            mappedData={mappedData}
            setMappedData={this.setMappedData}
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
