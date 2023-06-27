import { React, FeatureLayerQueryParams, FeatureLayerDataSource, FeatureDataRecord, ImmutableArray, appActions, getAppStore } from 'jimu-core'
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
  async function otherQueryDataSource () { //TODO: code duplication
    const query: FeatureLayerQueryParams = { where: `${props.dsProp.foreignKey} = '${props.globalId}'` }
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
      otherQueryDataSource() //to Refresh Widget data
      props.dataSource.setSourceRecords(props.dataSource.getRecords()) //To refresh other widgets
      getAppStore().dispatch(appActions.widgetStatePropChange(props.widgetId, 'changed', `${props.dsProp.foreignKey} = '${props.globalId}'`)) //set this to trigger a widget refresh consistent with the feature table refresh. TODO: Need to test this with the map widget
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
    if (!res) {
      return 'No Value'
    }
    return res
  }

  React.useEffect(() => {
    async function queryDataSource () {
      const queryParams = { where: `${props.dsProp.foreignKey} = '${props.globalId}'` } as FeatureLayerQueryParams

      // if (props.isParent) {
      //   queryParams = { where: `${props.dsProp.foreignKey} = '${props.globalId}'` }
      // } else {
      //   queryParams = props.dataSource.getCurrentQueryParams()
      // }
      const res = await props.dataSource.query(queryParams)
      console.log(res)

      setData(res.records as FeatureDataRecord[])
    }
    if (props.globalId) {
      queryDataSource()
      removeSelected()
    }
  }, [props, setData])

  const schema = props.dataSource.getFetchedSchema().fields
  if (props.globalId === null) {
    return <CalciteList><CalciteListItem label="No Record Selected"></CalciteListItem></CalciteList>
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
    return <CalciteList><CalciteListItem label="Configure the Data Source"></CalciteListItem></CalciteList>
  }
}
