import { React, FeatureLayerQueryParams, FeatureLayerDataSource, FeatureDataRecord, ImmutableArray } from 'jimu-core'
import RecordForm from './recordForm'
import {
  CalciteList, CalciteListItem
} from 'calcite-components'

import Graphic from 'esri/Graphic'
import { DSProp } from '../types'

interface Props {
  dataSource: FeatureLayerDataSource
  globalId: string
  widgetId: string
  dsProp: DSProp
  isParent: boolean
  fields: ImmutableArray<string>
}

export default function TabBody (props: Props) {
  const [selected, setSelected] = React.useState<FeatureDataRecord>(null)
  const [editType, setEditType] = React.useState<string>(null)
  const [data, setData] = React.useState<FeatureDataRecord[]>(null)
  const where = `${props.dsProp.foreignKey} like '${props.globalId}'` //IDK why this is failing but i think it would make things a lot better if i can just query by globalid

  async function otherQueryDataSource () {
    const query: FeatureLayerQueryParams = { where: where, pageSize: 1000 }
    const res = await props.dataSource.query(query)
    setData(res.records as FeatureDataRecord[])
  }
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
    return !!props.dsProp.newFeatures
  }

  const applyEditsToTable = (edits: any): void => {
    props.dataSource.layer.applyEdits(edits).then(_res => {
      otherQueryDataSource()
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
    props.fields.forEach(f => { attributes[f] = null })
    attributes[props.dsProp.foreignKey] = props.globalId

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
      return 'No Date Set'
    }
    return res
  }

  React.useEffect(() => {
    async function queryDataSource () {
      const query: FeatureLayerQueryParams = { where: where, pageSize: 1000 }
      const res = await props.dataSource.query(query)
      setData(res.records as FeatureDataRecord[])
    }
    queryDataSource()
    removeSelected()
  }, [props.dataSource, props.dsProp.foreignKey, props.globalId, setData, where])

  const schema = props.dataSource.getFetchedSchema().fields
  if (props.globalId === null) {
    return <p>
     No Record Selected {/* TODO: Style this better somehow */}
  </p>
  } else if (props.dsProp && props.dsProp.header && props.fields && props.dsProp.foreignKey && data) {
    return <div>
    {selected
      ? <RecordForm
        sourceFields={props.dataSource.layer.fields}
        fieldSchema={schema}
        dataRecord={selected}
        selectedFields={props.fields}
        updateRecord={updateRecord}
        cancelUpdate={removeSelected}
        editType={editType}
      />
      : <CalciteList>
        {canMakeNewFeatures() && <CalciteListItem label="Create New Record" onCalciteListItemSelect={() => newItem()} ></CalciteListItem>}
        {data.length > 0
          ? data.map(r => {
            const d = r.getData() as FeatureDataRecord
            const header = formatIfDate(schema[props.dsProp.header].esriType, d[props.dsProp.header])
            const subheader = props.dsProp.subHeader ? formatIfDate(schema[props.dsProp.subHeader].esriType, d[props.dsProp.subHeader]) : null //TODO: Can evaluate to 0 currently
            return <CalciteListItem label={header} description={subheader} onCalciteListItemSelect={() => itemSelected(d)} ></CalciteListItem>
          })
          : <CalciteListItem label="No Available Records"></CalciteListItem>}
      </CalciteList>}
  </div>
  } else {
    return <p>
      Configure the data source.
    </p>
  }
}
