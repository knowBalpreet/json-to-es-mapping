import React, { useState, useEffect } from 'react'
import { Modal, Row, Col, Switch, Tooltip, Select } from 'antd'
import set from 'lodash.set'
import get from 'lodash.get'

const { Option, OptGroup } = Select

const core = {
  string: {
    label: 'String',
    children: {
      text: {
        label: 'Text',
      },
      keyword: {
        label: 'Keyword',
      },
    },
  },
  numeric: {
    label: 'Numeric',
    children: {
      long: {
        label: 'Long',
      },
      integer: {
        label: 'Integer',
      },
      short: {
        label: 'Short',
      },
      byte: {
        label: 'Byte',
      },
      double: {
        label: 'Double',
      },
      float: {
        label: 'Float',
      },
      half_float: {
        label: 'Half Float',
      },
      scaled_float: {
        label: 'Scaled Float',
      },
    },
  },
  date: {
    label: 'Date',
  },
  date_nanos: {
    label: 'Date nanoseconds',
  },
  boolean: {
    label: 'Boolean',
  },
  binary: {
    label: 'Binary',
  },
  range: {
    label: 'Range',
    children: {
      integer_range: {
        label: 'Integer Range',
      },
      float_range: {
        label: 'Float Range',
      },
      long_range: {
        label: 'Long Range',
      },
      double_range: {
        label: 'Double Range',
      },
      date_range: {
        label: 'Date Range',
      },
    },
  },
}
const complex = {
  object: {
    label: 'Object',
  },
  nested: {
    label: 'Nested',
  },
}
const geo = {
  geo_point: {
    label: 'Geo Point',
  },
  geo_shape: {
    label: 'Geo Shape',
  },
}

const special = {
  flattened: {
    label: 'Flattened',
  },
}

const options = {
  core,
  complex,
  geo,
  special,
}

const MappingSelect = ({ type, changeType, mode, options, disabled }) => (
  <Select
    style={{ width: '100%' }}
    onChange={newType => changeType(newType)}
    defaultValue={type}
    mode={mode}
  >
    {Object.entries(options).map(([label, properties], index) => (
      <OptGroup key={index} label={label}>
        {Object.entries(properties).map(([label, property], index) =>
          !property.children ? (
            <Option
              key={index}
              value={label}
              disabled={disabled.includes(label)}
            >
              {property.label}
            </Option>
          ) : (
            Object.entries(property.children).map(([label, props], index) =>
              Object.entries(props).map(([label3, option], index) => (
                <Option
                  value={label}
                  disabled={disabled.includes(label)}
                  key={index}
                >{`${property.label} - ${props.label}`}</Option>
              ))
            )
          )
        )}
      </OptGroup>
    ))}
  </Select>
)

const MappingModal = ({ editData, setEditData, mappedData, setMappedData }) => {
  const [type, setType] = useState(editData.value)
  const [isSearchable, changeSearchable] = useState(false)
  const [multiFields, changeMultiFields] = useState(['keyword'])

  useEffect(() => {
    if (editData.namespace.includes('fields')) {
      const index = editData.namespace.findIndex(field => field === 'fields')
      editData.namespace = editData.namespace.slice(0, index)
      const fieldValue = get(mappedData, editData.namespace.join('.'))
      editData.value = fieldValue.type
      setType(editData.value)
      changeSearchable(true)
      changeMultiFields(Object.keys(fieldValue.fields))
      setEditData({ ...editData })
    } else if (get(mappedData, editData.namespace.join('.')).fields) {
      changeSearchable(true)
      changeMultiFields(
        Object.keys(get(mappedData, editData.namespace.join('.')).fields)
      )
    }
  }, [editData, mappedData, setEditData])

  const changeType = newType => {
    // setEditData({ ...editData, value: newType })
    setType(newType)
  }

  const updateMapping = () => {
    let field = { type }
    const nodes = {}
    if (isSearchable && multiFields.length && type === 'text') {
      multiFields.forEach(node => {
        nodes[node] = {
          type: node,
          ignore_above: 256,
        }
      })
      field = {
        type,
        fields: { ...nodes },
      }
    }
    const _mappedData = set(
      mappedData,
      `${editData.namespace.join('.')}`,
      field
    )
    setMappedData({ ..._mappedData })

    setEditData({})
  }

  const { value } = editData
  const path = editData.namespace
    .filter(elem => elem !== 'properties')
    .join('.')
  return (
    <Modal
      centered
      width="80vw"
      visible={editData.status}
      title="Change Default Mapping"
      onCancel={() => setEditData({})}
      onOk={() => updateMapping({})}
    >
      <pre style={{ padding: 5 }}>
        Confused, on what type to chose for this field?
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html"
        >
          &nbsp; Refer to this
        </a>
      </pre>
      <Row type="flex" justify="center" align="middle">
        <Col span={8}>
          <pre>
            JSON Path: <br />
            {path}
          </pre>
        </Col>
        <Col span={8}>
          <pre>
            Default Mapping: <br /> {value}
          </pre>
        </Col>
        <Col span={8}>
          <center>
            <pre>
              Change Mapping: <br />
              <MappingSelect
                type={type}
                changeType={changeType}
                mode=""
                options={options}
                disabled={[]}
              />
              <br />
              <br />
              {type === 'text' && (
                <>
                  <Tooltip title="Make it Searchable. Enable full text search">
                    <Switch
                      defaultChecked={isSearchable}
                      onChange={val => changeSearchable(val)}
                    />
                  </Tooltip>
                  {isSearchable && (
                    <>
                      <br />
                      <br />
                      Add Multifields: <br />
                      <MappingSelect
                        type={multiFields}
                        changeType={selected => changeMultiFields(selected)}
                        mode="multiple"
                        options={options}
                        disabled={[type]}
                      />
                    </>
                  )}
                </>
              )}
            </pre>
          </center>
        </Col>
      </Row>
    </Modal>
  )
}

export default MappingModal
