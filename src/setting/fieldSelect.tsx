import { React, DataSource, ImmutableArray, UseDataSource, ImmutableObject, DataSourceComponent, FeatureLayerQueryParams, IMDataSourceInfo } from 'jimu-core'

import {
  CalciteSelect, CalciteOption
} from 'calcite-components'
interface Props {
  useDataSource: ImmutableArray<UseDataSource>
  selectedFields: ImmutableArray<any> | ImmutableObject<any>
  widgetId: string
  onChange: (fields: string[], sourceId: string) => void
}

export default function FieldSelect (props: Props) {
  const excludeFields = ['parentglobalid', 'objectid', 'globalid']
  const [source, setSource] = React.useState<number>(0)

  const datasourceUpdate = (e: any) => {
    const ds = props.useDataSource.filter(ds => ds.dataSourceId === e.target.value)[0] as unknown as UseDataSource //TODO: this fix is real iffy
    const index = props.useDataSource.indexOf(ds)
    setSource(index)
  }
  const DataSourceSelect = () => {
    return <>
      Data Source
      <CalciteSelect
        id= "datSourceSelect"
        label="datSourceSelect"
        onCalciteSelectChange={datasourceUpdate}>
        {props.useDataSource.map(ds => (
          <DataSourceComponent useDataSource={ds} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.widgetId}>
            {DataSourceOptions}
          </DataSourceComponent>)
        )}
      </CalciteSelect>
    </>
  }

  const DataSourceOptions = (ds: DataSource, info: IMDataSourceInfo) => {
    if (info.status !== 'LOADED') {
      return null
    }
    return <CalciteOption key={ds.id} value={ds.id} selected={ds.id === props.useDataSource[source].dataSourceId}>
      {ds.getLabel()}
    </CalciteOption>
  }

  const Fields = () => {
    return <DataSourceComponent useDataSource={props.useDataSource[source]} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.widgetId}>
      {DataSourceFields}
    </DataSourceComponent>
  }

  const checkChange = (event: any) => {
    const field = event.target.id
    const selected = props.useDataSource[source].fields ? [...props.useDataSource[source].fields] : []
    if (selected.includes(field)) {
      const result = selected.filter(f => f !== field)
      props.onChange(result, props.useDataSource[source].dataSourceId)
    } else {
      selected.push(field)
      props.onChange(selected, props.useDataSource[source].dataSourceId)
    }
  }

  const DataSourceFields = (ds: DataSource, info: IMDataSourceInfo) => {
    if (info.status !== 'LOADED') {
      return null
    }
    const alreadySelected = props.useDataSource[source].fields || []
    const records = ds.getRecords()
    const fields = records.map(r => r.getData())[0]

    const keys = fields && Object.keys(fields).filter(k => !excludeFields.includes(k.toLowerCase()))
    console.log(keys)
    return (<fieldset>
      Fields
      {keys.map(k => (
        <div>
          <input type="checkbox" onChange={checkChange} id={k} name={k} checked={alreadySelected.includes(k)} />
          <label htmlFor={k}>{k}</label>
        </div>
      ))}
    </fieldset>)
  }

  return (<>
    <form id="fieldSelect">
      <DataSourceSelect />
      <Fields />
    </form>

  </>)
}
