import { React, ImmutableObject, FeatureDataRecord, FieldSchema, ImmutableArray } from 'jimu-core'
import {
  CalciteButton, CalciteInputText, CalciteLabel, CalciteInputDatePicker, CalciteInputNumber, CalciteInput
} from 'calcite-components'
import Field from 'esri/layers/support/Field'

interface Props {
  sourceFields: Field[]
  dataRecord: FeatureDataRecord
  editType: string
  selectedFields: string[] | ImmutableArray<string>
  fieldSchema: ImmutableObject<{ [jimuName: string]: FieldSchema }>
  updateRecord: (record: FeatureDataRecord, editType: string) => void
  cancelUpdate: () => void
}

export default function RecordForm ({ sourceFields, cancelUpdate, dataRecord, selectedFields, fieldSchema, updateRecord, editType }: Props) {
  const getValues = (dataRecord: FeatureDataRecord) => {
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

  const getLongFields = () => {
    return sourceFields.filter(f => f.length > 500).map(f => f.name)
  }

  const [formValues, setFormValues] = React.useState<Object>(getValues(dataRecord))
  const longFields = getLongFields()
  const onSubmit = () => {
    const record = { ...dataRecord }
    for (const key of selectedFields) {
      const type = fieldSchema[key].esriType
      if (type === 'esriFieldTypeDate') {
        const date = Date.parse(formValues[key])
        console.log(date)
        record[key] = date
      } else {
        record[key] = formValues[key]
      }
    }
    updateRecord(record, editType)
  }

  const handleChange = (e: any): void => { //TODO: need to figure Calcite Event Type
    const v = {
      ...formValues, [e.target.id]: e.target.value
    }
    setFormValues(v)
  }
  return <div>
    {
      selectedFields.map((f: string) => {
        const type = fieldSchema[f].esriType
        const alias = fieldSchema[f].alias
        let val: JSX.Element
        if (type === 'esriFieldTypeString') {
          if (longFields.includes(f)) {
            val = <textarea id={f} onChange={handleChange} value={formValues[f]}> </textarea>
          } else {
            val = <CalciteInputText id={f} onCalciteInputTextInput={handleChange} value={formValues[f]}></CalciteInputText>
          }
        } else if (type === 'esriFieldTypeDate') {
          val = <CalciteInputDatePicker id={f} onCalciteInputDatePickerChange={handleChange} value={formValues[f]}></CalciteInputDatePicker>
        } else if (type === 'esriFieldTypeInteger') {
          val = <CalciteInputNumber id={f} onCalciteInputNumberInput={handleChange} value={formValues[f]}></CalciteInputNumber>
        } else {
          val = <CalciteInput id={f} read-only>{f} {type} {dataRecord[f]}</CalciteInput>
        }
        return <CalciteLabel>
          {alias}
          {val}
        </CalciteLabel>
      })
    }
    <CalciteButton width="half" slot="footer" appearance="outline" onClick={cancelUpdate}>Cancel</CalciteButton>
    <CalciteButton width="half" slot="footer" onClick={onSubmit}>Submit</CalciteButton>
  </div >
}
