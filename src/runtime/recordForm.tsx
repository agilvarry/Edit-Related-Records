import { React, ImmutableObject, DataRecord, FieldSchema, ImmutableArray } from 'jimu-core'

interface Props {
  dataRecord: DataRecord
  selectedFields: any[] | ImmutableArray<string>
  fieldSchema: ImmutableObject<{ [jimuName: string]: FieldSchema }>
  updateRecord: (record: DataRecord) => Promise<boolean>
}

export default function RecordForm ({ dataRecord, selectedFields, fieldSchema, updateRecord }: Props) {
  const getValues = (dataRecord: DataRecord): Object => {
    const entries = Object.entries(dataRecord)

    const values = {}
    entries.forEach(v => {
      const type = fieldSchema[v[0]].esriType
      if (type === 'esriFieldTypeDate') {
        const date = new Date(v[1])
        const iso = date.toISOString() //TODO: we need iso string for stuff, update in handle change and getValues
        values[v[0]] = iso.split('T')[0]
      } else {
        values[v[0]] = v[1]
      }
    })
    return values
  }

  const [formValues, setFormValues] = React.useState<Object>(getValues(dataRecord))

  const onSubmit = () => {
    const record = { ...dataRecord }
    for (const key of selectedFields) {
      record[key] = formValues[key]
    }
    console.log(record)
    updateRecord(record).then(res => {
      console.log(res)
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(e.target.value)
    const v = {
      ...formValues, [e.target.id]: e.target.value
    }
    setFormValues(v)
  }
  //   const objectid = Object.prototype.hasOwnProperty.call(dataRecord, 'OBJECTID') ? 'OBJECTID' : 'objectid'
  return <div>
    {
      selectedFields.map((f: string) => {
        const type = fieldSchema[f].esriType
        let val: JSX.Element
        if (type === 'esriFieldTypeString') {
          val = <input type='text' id={f} name={f} onChange={handleChange} value={formValues[f]}></input>
        } else if (type === 'esriFieldTypeDate') {
          val = <input type='date' id={f} name={f} onChange={handleChange} value={formValues[f]}></input>
        } else if (type === 'esriFieldTypeInteger') {
          val = <input type='number' id={f} name={f} onChange={handleChange} value={formValues[f]}></input>
        } else {
          val = <p>{f} {type} {dataRecord[f]}</p>
        }
        return (<>
          <label htmlFor={f}>{f}</label> <br />
          {val}<br />
        </>)
      })
    }
    < div > <button onClick={onSubmit}>Submit</button></div>
  </div >
}
