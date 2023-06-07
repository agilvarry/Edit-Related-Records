import { React, UseDataSource, ImmutableObject, DataSourceComponent, FeatureLayerQueryParams, FeatureLayerDataSource, FeatureDataRecord, IMDataSourceInfo } from 'jimu-core'
import RecordForm from './recordForm'
import {
  CalciteFlow, CalciteFlowItem, CalciteList, CalciteListItem, CalcitePanel
} from 'calcite-components'

import Graphic from 'esri/Graphic'
interface configProps {
  foreignKey: string
  header: string
  subHeader: string
  newFeatures: boolean
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
  const query: FeatureLayerQueryParams = { where: '1=1', pageSize: 1000 } //TODO: setting this to 1000 fixed my perplexing issue but it makes things load slower, also think it won't work once we go over 1000 records.
  const [selected, setSelected] = React.useState<FeatureDataRecord>(null)
  const [editType, setEditType] = React.useState<string>(null)
  const flowID = `${props.dataSource.dataSourceId}_flow`

  const updateRecord = (record: FeatureDataRecord, editType: string): void => {
    const updates = new Graphic({
      attributes: record
    })

    if (editType === 'update') {
      const edits = { updateFeatures: [updates] }
      applyEditsToTable(edits)
    } else if (editType === 'create') {
      const edits = { addFeatures: [updates] }
      applyEditsToTable(edits)
    }
    removeSelected()
  }

  const canMakeNewFeatures = (): boolean => {
    return !!props.config.newFeatures
  }
  const applyEditsToTable = (edits: any): void => {
    ds.layer.applyEdits(edits).then(_res => {
      ds.setSourceRecords(ds.getRecords())
    }).catch((error) => {
      console.log('error = ', error)
    })
  }

  const itemSelected = (data: FeatureDataRecord) => {
    setEditType('update')
    setSelected(data)
  }
  const removeSelected = () => {
    setSelected(null)
  }

  const fetchAttributes = (): FeatureDataRecord => {
    const attributes = {} as FeatureDataRecord
    props.dataSource.fields.forEach(f => { attributes[f] = null })
    attributes[props.config.foreignKey] = props.globalId

    return attributes
  }
  const newItem = () => {
    // const newGraphic = new Graphic({
    //   attributes: fetchAttributes()
    // })
    const newFeature = fetchAttributes()
    setEditType('create')
    setSelected(newFeature)
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

    const data = allData.filter(res => res.globalid === props.globalId || res[props.config.foreignKey] === props.globalId)
    console.log(canMakeNewFeatures())
    if (ds && props.config.foreignKey && props.config.header && props.config.subHeader) {
      return <CalcitePanel>
        {selected
          ? <RecordForm
            fieldSchema={ds.getFetchedSchema().fields}
            dataRecord={selected}
            selectedFields={props.dataSource.fields}
            updateRecord={updateRecord}
            cancelUpdate={removeSelected}
            editType={editType}
          />
          : <div className="tab-content" style={{ overflow: 'auto' }}>
            <CalciteList>
              {canMakeNewFeatures() && <CalciteListItem label="Create New Feature" onCalciteListItemSelect={() => newItem()} ></CalciteListItem>}
              {data.length > 1
                ? data.map(d => {
                  console.log(d)
                  return <CalciteListItem label={d[props.config.header]} description={d[props.config.subHeader]} onCalciteListItemSelect={() => itemSelected(d)} ></CalciteListItem>
                })
                : <CalciteListItem label="No Available Records"></CalciteListItem>}
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
