import { React, DataSource, ImmutableArray, UseDataSource, ImmutableObject, DataSourceComponent, FeatureLayerQueryParams } from 'jimu-core'

interface Props {
  useDataSource: ImmutableArray<UseDataSource>
  selectedFields: ImmutableArray<any> | ImmutableObject<any>
  widgetId: string

}
export default function FieldSelect (props: Props) {
  const [dataId, setDataId] = React.useState<string>(props.useDataSource[0].dataSourceId)
  const [source, setSource] = React.useState<ImmutableObject<UseDataSource>>(props.useDataSource[0])
  const datasourceUpdate = () => {
    const ds = props.useDataSource.filter(ds => ds.dataSourceId === document.getElementById('datSourceSelect').value)[0]
    setSource(ds)
  }
  const DataSourceSelect = () => {
    return (<>
            Data Source <br/>
            <select
                id="datSourceSelect"
                aria-describedby="id1 id2"
                onChange={datasourceUpdate}>
                {props.useDataSource.map(ds => (
                    <DataSourceComponent useDataSource={ds} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.widgetId}>
                        {DataSourceOptions}
                    </DataSourceComponent>)
                )}
            </select>
        </>)
  }

  const DataSourceOptions = (ds: DataSource) => {
    console.log(ds)
    return (<><option value={ds.id} selected={ds.id === dataId}>
            {ds.getLabel()}
        </option></>)
  }
  const Fields = () => {
    return (<DataSourceComponent useDataSource={source} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.widgetId}>
            {DataSourceFields}
        </DataSourceComponent>)
  }

    const fieldChange = (allSelectedFields: IMFieldSchema[], ds: DataSource) => {
    props.onSettingChange({
      id: props.id,
      useDataSources: [...props.useDataSources].map(item => item.dataSourceId === ds.id ? { ...item, ...{ fields: allSelectedFields.map(f => f.jimuName) } } : item)
    })
  }

  const checkChange = (event: any) => {
    const field = event.target.id
    const selected = [...source.fields]
    if (selected.includes(field)){
    }
    console.log(document.getElementById(event.target.id).checked)
  }

  const DataSourceFields = (ds: DataSource) => {
    const alreadySelected = source.fields || []
    console.log(alreadySelected)
    const fields = ds.getRecords().map(r => r.getData())[0]
    const keys = Object.keys(fields)
    return (<fieldset>
            Fields
            {keys.map(k => (
                <div>
                    <input type="checkbox" onChange={checkChange} id={k} name={k} checked={alreadySelected.includes(k)}/>
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
