import { React, UseDataSource, ImmutableObject, DataSourceComponent, FeatureLayerQueryParams, FeatureLayerDataSource, FeatureDataRecord, IMDataSourceInfo } from 'jimu-core'
import RecordForm from './recordForm'
import {
  CalciteList, CalciteListItem
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
  const query: FeatureLayerQueryParams = { where: '1=1', pageSize: 1000 }
  const [selected, setSelected] = React.useState<FeatureDataRecord>(null)
  const [editType, setEditType] = React.useState<string>(null)

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
    const newFeature = fetchAttributes()
    setEditType('create')
    setSelected(newFeature)
  }

  const tabRender = (ds: FeatureLayerDataSource, info: IMDataSourceInfo) => {
    if (info.status !== 'LOADED') {
      return null
    }
    setDS(ds)
    const selectedRecords = ds.getSelectedRecords().map(r => r.getData())
    if (selectedRecords[0] && selectedRecords[0].globalid !== props.globalId) {
      props.setGlobalId(selectedRecords[0].globalid)
      return null
    }

    const allRecords = ds.getRecords()
    const allData = allRecords.map(r => r.getData())

    if (ds && props.config && props.config.foreignKey && props.config.header && props.dataSource.fields) {
      const data = allData.filter(res => res.globalid === props.globalId || res[props.config.foreignKey] === props.globalId)
      const schema = ds.getFetchedSchema().fields
      return <div>
        {selected
          ? <RecordForm
            sourceFields={ds.layer.fields}
            fieldSchema={schema}
            dataRecord={selected}
            selectedFields={props.dataSource.fields}
            updateRecord={updateRecord}
            cancelUpdate={removeSelected}
            editType={editType}
          />
          : <CalciteList>
            {canMakeNewFeatures() && <CalciteListItem label="Create New Record" onCalciteListItemSelect={() => newItem()} ></CalciteListItem>}
            {data.length > 0
              ? data.map(d => {
                const header = schema[props.config.header].esriType === 'esriFieldTypeDate' && d[props.config.header] ? new Date(d[props.config.header]).toLocaleDateString() : d[props.config.header]
                const subheader = props.config.subHeader ? schema[props.config.subHeader].esriType === 'esriFieldTypeDate' && d[props.config.subHeader] ? new Date(d[props.config.subHeader]).toLocaleDateString() : d[props.config.subHeader] : null //TODO: Can evaluate to 0 currently
                return <CalciteListItem label={header} description={subheader} onCalciteListItemSelect={() => itemSelected(d)} ></CalciteListItem>
              })
              : <CalciteListItem label="No Available Records"></CalciteListItem>}
          </CalciteList>
        }
      </div>
    } else {
      //TODO: IDK if this is ever returned
      return <h3>
        Configure the data source.
      </h3>
    }
  }

  return <DataSourceComponent useDataSource={props.dataSource} query={query} widgetId={props.widgetId} queryCount>
    {tabRender}
  </DataSourceComponent>
}
