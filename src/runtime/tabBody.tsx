import { React, UseDataSource, ImmutableObject, DataSourceComponent, FeatureLayerQueryParams, FeatureLayerDataSource, FeatureDataRecord, ImmutableArray } from 'jimu-core'
import RecordForm from './recordForm'

interface Props {
  dataSource: ImmutableObject<UseDataSource>
  globalId: string
  setGlobalId: (globalId: string) => void
  widgetId: string
}

export default function TabBody (props: Props) {
  const [layer, setLayer] = React.useState<__esri.FeatureLayer>(null)
  const [ds, setDS] = React.useState<FeatureLayerDataSource>(null)
  const [selectedFields, setSelectedFields] = React.useState<string[] | ImmutableArray<string>>([])
  const query: FeatureLayerQueryParams = { where: '1=1' }

  const updateRecord = (updates: FeatureDataRecord, objectIdField: string): void => {
    layer.queryFeatures({
      objectIds: [updates[objectIdField]],
      outFields: ['*']
    }).then(res => {
      if (res.features.length > 0) {
        const editFeature = res.features[0]
        for (const field of selectedFields) {
          editFeature.attributes[field] = updates[field]
        }
        console.log(editFeature)
        const edits = {
          updateFeatures: [editFeature]
        }
        applyEditsToTable(edits, updates[objectIdField])
      }
    })
  }

  const applyEditsToTable = (edits: any, id: string): void => {
    layer.applyEdits(edits).then(res => {
      ds.setSourceRecords(ds.getRecords())
      ds.updateSelectionInfo([id], ds, true)
    }).catch((error) => {
      console.log('error = ', error)
    })
  }

  const tabRender = (ds: FeatureLayerDataSource) => {
    setDS(ds)
    setLayer(ds.layer)
    setSelectedFields(props.dataSource.fields || [] as string[])

    const fieldSchema = ds.getFetchedSchema().fields
    const selectedRecords = ds.getSelectedRecords().map(r => r.getData())
    if (selectedRecords[0] && selectedRecords[0].globalid !== props.globalId) {
      props.setGlobalId(selectedRecords[0].globalid)
      return null
    }

    const allRecords = ds.getRecords()
    const allData = allRecords.map(r => r.getData())
    const res = allData.filter(res => res.globalid === props.globalId || res.parentglobalid === props.globalId || res.ParentGlobalID === props.globalId)
    console.log(allData, ds.id)
    if (selectedFields.length > 0) {
      return <div className="tab-content" style={{ overflow: 'auto' }}>
        {res && res.map(r => (
          <RecordForm
            fieldSchema={fieldSchema}
            dataRecord={r}
            selectedFields={selectedFields}
            updateRecord={updateRecord}
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

  return (<div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
    <DataSourceComponent useDataSource={props.dataSource} query={query} widgetId={props.widgetId} queryCount>
      {tabRender}
    </DataSourceComponent>
  </div>)
}
