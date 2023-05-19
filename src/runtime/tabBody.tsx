import { React, DataSource, UseDataSource, ImmutableObject, DataSourceComponent, FeatureLayerQueryParams, FeatureLayerDataSource } from 'jimu-core'
import RecordForm from './recordForm'
// import FeatureLayer from 'esri/layers/FeatureLayer'

interface Props {
  dataSource: ImmutableObject<UseDataSource>
  globalId: string
  setGlobalId: (globalId: string) => void
  widgetId: string
}

export default function TabBody (props: Props) {
  // const updateRecord = (updates) => {

  // }

  const tabRender = (ds: FeatureLayerDataSource) => {
    const fieldSchema = ds.getFetchedSchema().fields
    const selectedFields = props.dataSource.fields || []
    const selectedRecords = ds.getSelectedRecords().map(r => r.getData())
    if (selectedRecords[0] && selectedRecords[0].globalid !== props.globalId) {
      props.setGlobalId(selectedRecords[0].globalid)
      return null
    } else {
      console.log(ds.url)
      const allRecords = ds.getRecords()
      const allData = allRecords.map(r => r.getData())
      const res = allData.filter(res => res.globalid === props.globalId || res.parentglobalid === props.globalId || res.ParentGlobalID === props.globalId)
      if (selectedFields.length > 0) {
        return <div className="tab-content" style={{ overflow: 'auto' }}>
          {res && res.map(r => (
            <RecordForm
            fieldSchema={fieldSchema}
            dataRecord={r}
            selectedFields={selectedFields}
            // updateRecord={ds.updateRecord}
            />
          ))}
        </div>
      } else {
        //TODO: IDK if this is ever returned
        return <h3>
          Configure the data source.
        </h3>
      }
    }
  }

  return (<div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
    <DataSourceComponent useDataSource={props.dataSource} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.widgetId} queryCount>
      {tabRender}
    </DataSourceComponent>
  </div>)
}
