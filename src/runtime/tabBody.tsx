import { React, DataSource, UseDataSource, ImmutableObject, QueryParams, DataSourceComponent } from 'jimu-core'
import '@esri/calcite-components/dist/components/calcite-input-text'
// import {
//   CalciteInputText
// } from '@esri/calcite-components-react'
interface Props {
  dataSource: ImmutableObject<UseDataSource>
  globalId: string
  setGlobalId: (globalId: string) => void
  widgetId: string
}

export default function TabBody (props: Props) {
  const [formValues, setFormValues] = React.useState<Object>({})
  const onSubmit = () => {
    console.log(formValues)
  }

  const handleChange = (e) => {
    console.log(e.target)
    const v = {
      ...formValues,
      [e.target.name]: {
        ...formValues[e.target.name], [e.target.id]: e.target.value
      }

    }

    setFormValues(v)
  }

  const tabRender = (ds: DataSource) => {
    const fieldSchema = ds.getFetchedSchema().fields
    const selectedFields = props.dataSource.fields || []
    const selectedRecords = ds.getSelectedRecords().map(r => r.getData())
    if (selectedRecords[0] && selectedRecords[0].globalid !== props.globalId) {
      props.setGlobalId(selectedRecords[0].globalid)
    }

    const allRecords = ds.getRecords()
    const allData = allRecords.map(r => r.getData())
    const res = allData.filter(res => res.globalid === props.globalId || res.parentglobalid === props.globalId || res.ParentGlobalID === props.globalId)

    if (selectedFields.length > 0) {
      console.log(ds.getFetchedSchema().fields)
      return <div className="tab-content" style={{ overflow: 'auto' }}>
        {res && res.map(r => {
          const objectid = Object.prototype.hasOwnProperty.call(r, 'OBJECTID') ? 'OBJECTID' : 'objectid'
          return <div>
            {selectedFields.map((f: string) => {
              const type = fieldSchema[f].esriType
              let val: JSX.Element
              if (type === 'esriFieldTypeString') {
                val = <input type='text' id={f} name={objectid} onChange={handleChange} value={formValues[objectid[f]] || r[f]}></input>
              } else if (type === 'esriFieldTypeDate') {
                const date = new Date(r[f])
                const iso = date.toISOString()
                val = <input type='date' id={f} name={objectid} onChange={handleChange} value={formValues[objectid[f]] || iso.split('T')[0]}></input>
              } else if (type === 'esriFieldTypeInteger') {
                val = <input type='number' id={f} name={objectid} onChange={handleChange} value={formValues[objectid[f]] || r[f]}></input>
              } else {
                val = <p>{f} {type} {r[f]}</p>
              }
              return (<>
                <label htmlFor={f}>{f}</label> <br />
                {val}<br />
              </>)
            })}
            <div><button onClick={onSubmit}>Submit</button></div>
          </div>
        })}
      </div>
    } else {
      return <h3>
        Configure the data source.
      </h3>
    }
  }

  return (<div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
    <DataSourceComponent useDataSource={props.dataSource} query={{ where: '1=1' } as QueryParams} widgetId={props.widgetId} queryCount>
      {tabRender}
    </DataSourceComponent>
  </div>)
}
