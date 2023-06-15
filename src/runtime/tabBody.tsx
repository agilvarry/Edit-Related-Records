import { React, UseDataSource, ImmutableObject, DataSourceComponent, FeatureLayerQueryParams, FeatureLayerDataSource, FeatureDataRecord, IMDataSourceInfo } from 'jimu-core'
import RecordForm from './recordForm'
import {
  CalciteList, CalciteListItem
} from 'calcite-components'

import Graphic from 'esri/Graphic'
import { configProps } from '../types'

interface Props {
  dataSource: ImmutableObject<UseDataSource>
  globalId: string
  widgetId: string
  config: configProps
  isParent: boolean
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

  const formatIfDate = (esriType: string, attribute: any): string => {
    const res = esriType === 'esriFieldTypeDate' && attribute ? new Date(attribute).toLocaleDateString() : attribute
    if (res === 0) {
      return 'No Date git '
    }
    return res
  }

  const tabRender = (ds: FeatureLayerDataSource, info: IMDataSourceInfo) => {
    if (info.status !== 'LOADED') {
      return null
    }
    setDS(ds)

    const allRecords = ds.getRecords()
    const allData = allRecords.map(r => r.getData())
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
                const header = formatIfDate(schema[props.config.header].esriType, d[props.config.header])
                const subheader = props.config.subHeader ? formatIfDate(schema[props.config.subHeader].esriType, d[props.config.subHeader]) : null //TODO: Can evaluate to 0 currently
                return <CalciteListItem label={header} description={subheader} onCalciteListItemSelect={() => itemSelected(d)} ></CalciteListItem>
              })
              : <CalciteListItem label="No Available Records"></CalciteListItem>}
          </CalciteList>
        }
      </div>
  }
  if (props.globalId === null) {
    return <p>
     No Record Selected {/* TODO: Style this better somehow */}
  </p>
  } else if (props.config && props.config.header && props.dataSource.fields && (props.config.foreignKey || props.isParent)) {
    return <DataSourceComponent useDataSource={props.dataSource} query={query} widgetId={props.widgetId} queryCount>
    {tabRender}
  </DataSourceComponent>
  } else {
    return <p>
      Configure the data source.
    </p>
  }
}
