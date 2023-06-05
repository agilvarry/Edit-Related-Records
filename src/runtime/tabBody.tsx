import { React, UseDataSource, ImmutableObject, DataSourceComponent, FeatureLayerQueryParams, FeatureLayerDataSource, FeatureDataRecord, IMDataSourceInfo } from 'jimu-core'
import RecordForm from './recordForm'
import {
  CalciteFlow, CalciteFlowItem, CalciteList, CalciteListItem, CalcitePanel
} from 'calcite-components'

interface configProps {
  foreignKey: string
  header: string
  subHeader: string
}
interface Props {
  dataSource: ImmutableObject<UseDataSource>
  globalId: string
  setGlobalId: (globalId: string) => void
  widgetId: string
  config: configProps
}

export default function TabBody (props: Props) {
  const [ds, setDS] = React.useState<FeatureLayerDataSource>(null)
  const query: FeatureLayerQueryParams = { where: '1=1', pageSize: 1000 } //TODO: setting this to 1000 fixed my perplexing issue but it makes things load slow.
  const [selected, setSelected] = React.useState<FeatureDataRecord>(null)
  const flowID = `${props.dataSource.dataSourceId}_flow`
  const updateRecord = (updates: FeatureDataRecord, objectIdField: string): void => {
    ds.layer.queryFeatures({
      objectIds: [updates[objectIdField]],
      outFields: ['*']
    }).then(res => {
      if (res.features.length > 0) {
        const editFeature = res.features[0]
        for (const field of props.dataSource.fields) {
          editFeature.attributes[field] = updates[field]
        }
        const edits = {
          updateFeatures: [editFeature]
        }
        applyEditsToTable(edits, updates[objectIdField])
        removeSelected()
      }
    })
  }

  const applyEditsToTable = (edits: any, id: string): void => {
    ds.layer.applyEdits(edits).then(_res => {
      ds.setSourceRecords(ds.getRecords())
    }).catch((error) => {
      console.log('error = ', error)
    })
  }

  const itemSelected = (data: FeatureDataRecord) => {
    setSelected(data)
  }
  const removeSelected = () => {
    setSelected(null)
  }

  const tabRender = (ds: FeatureLayerDataSource, info: IMDataSourceInfo) => {
    if (info.status !== 'LOADED') {
      return null
    }

    const selectedRecords = ds.getSelectedRecords().map(r => r.getData())
    if (selectedRecords[0] && selectedRecords[0].globalid !== props.globalId) {
      props.setGlobalId(selectedRecords[0].globalid)
      return null
    }
    setDS(ds)

    const allRecords = ds.getRecords()
    const allData = allRecords.map(r => r.getData())
    console.log(props.config.foreignKey)
    const data = allData.filter(res => res.globalid === props.globalId || res[props.config.foreignKey] === props.globalId)

    if (ds && props.config.foreignKey && props.config.header && props.config.subHeader) {
      return <CalcitePanel>
        {selected
          ? <RecordForm
            fieldSchema={ds.getFetchedSchema().fields}
            dataRecord={selected}
            selectedFields={props.dataSource.fields}
            updateRecord={updateRecord}
            cancelUpdate={removeSelected}
          />
          : <div className="tab-content" style={{ overflow: 'auto' }}>
            <CalciteList>
              {data.map(d => {
                return <CalciteListItem label={props.config.header} description={props.config.subHeader} onCalciteListItemSelect={() => itemSelected(d)} ></CalciteListItem>
              })}
            </CalciteList>
          </div >}
      </CalcitePanel>
    } else {
      //TODO: IDK if this is ever returned
      return <h3>
        Configure the data source.
      </h3>
    }
  }

  return (<div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
    <CalciteFlow id={flowID}>
      <CalciteFlowItem>
        <DataSourceComponent useDataSource={props.dataSource} query={query} widgetId={props.widgetId} queryCount>
          {tabRender}
        </DataSourceComponent>
      </CalciteFlowItem>
    </CalciteFlow>

  </div>)
}
