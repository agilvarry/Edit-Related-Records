import { React, DataSource, ImmutableArray, UseDataSource, ImmutableObject, DataSourceComponent, FeatureLayerQueryParams, IMDataSourceInfo, FieldSchema } from 'jimu-core'

import {
  CalciteSelect, CalciteOption
} from 'calcite-components'
import { AdvancedSelect, AdvancedSelectItem } from 'jimu-ui'
interface Props {
  useDataSource: ImmutableArray<UseDataSource>
  selectedFields: ImmutableArray<any> | ImmutableObject<any>
  widgetId: string
  onChange: (fields: Array<string | number>, sourceId: string) => void
  configs: any //TODO: what is the type of config?
  configChange: (sourceId: string, configProp: string, value: any) => void
}

export default function FieldSelect (props: Props) {
  const idTypes = ['esriFieldTypeGlobalID', 'esriFieldTypeOID', 'esriFieldTypeGUID']
  const [source, setSource] = React.useState<number>(0)
  const [sourceNames, setSourceNames] = React.useState<string[]>([])
  const [fieldSelectOpen, setFieldSelectOpen] = React.useState<boolean>(false)
  /**
   * These only exist becasue it allows me to update my selects. need a better solution
   */
  const [joinSelectOpen, setJoinSelectOpen] = React.useState<boolean>(false)
  const [headSelectOpen, setHeadSelectOpen] = React.useState<boolean>(false)
  const [subHeadSelectOpen, setSubHeadSelectOpen] = React.useState<boolean>(false)
  const datasourceUpdate = (e: any) => {
    const ds = props.useDataSource.filter(ds => ds.dataSourceId === e.target.value)[0] as unknown as UseDataSource //TODO: this fix is real iffy
    const index = props.useDataSource.indexOf(ds)
    setSource(index)
  }
  //TODO: swap data soure to advanced Select
  const checkSourceSelect = (ds) => {
    if (!sourceNames.includes(label)) {
      const newNames = [...sourceNames]
      newNames.push(label)
      setSourceNames(newNames)
    }
  }
  const DataSourceSelect = () => {
    const items = sourceNames.map(s => {
      const select = {} as AdvancedSelectItem
      select.label = s
      select.value = s
      return select
    }) as unknown as AdvancedSelectItem[]

    return <>
      <h3>Selected Data Source</h3>
      <AdvancedSelect
        fluid
        strategy={'fixed'}
        isMultiple
        staticValues={items}
        selectedValues={selectedValues}
        onChange={selectChange}
        isOpen={fieldSelectOpen}
        toggle={(isOpen) => setFieldSelectOpen(isOpen)}
      />
      <CalciteSelect //TODO: need select that fits style and also works
        id="datSourceSelect"
        label="datSourceSelect"
        onCalciteSelectChange={datasourceUpdate}>
        {props.useDataSource.map(ds => {
          console.log(ds)
          return <DataSourceComponent useDataSource={ds} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.widgetId}>
            {DataSourceOptions}
          </DataSourceComponent>
        }
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

  const joinChange = (event: any) => {
    props.configChange(props.useDataSource[source].dataSourceId, 'foreignKey', event[0].value)
  }
  const headChange = (event: any) => {
    props.configChange(props.useDataSource[source].dataSourceId, 'header', event[0].value)
  }
  const subHeadChange = (event: any) => {
    props.configChange(props.useDataSource[source].dataSourceId, 'subHeader', event[0].value)
  }

  const selectChange = (event: AdvancedSelectItem[]) => {
    console.log(event)
    const selected = event.map(item => item.value)
    props.onChange(selected, props.useDataSource[source].dataSourceId)
  }

  const makeAdvancedSelectItems = (schema: Array<ImmutableObject<FieldSchema>>) => {
    return schema.map(s => {
      const select = {} as AdvancedSelectItem
      select.label = s.alias
      select.value = s.jimuName
      return select
    }) as unknown as AdvancedSelectItem[]
  }

  const fetchForeignKey = () => {
    if (Object.prototype.hasOwnProperty.call(props.configs, props.useDataSource[source].dataSourceId)) {
      return props.configs[props.useDataSource[source].dataSourceId].foreignKey
    }
    return null
  }

  const fetchHeader = () => {
    if (Object.prototype.hasOwnProperty.call(props.configs, props.useDataSource[source].dataSourceId)) {
      return props.configs[props.useDataSource[source].dataSourceId].header
    }
    return null
  }

  const fetchSubHeader = () => {
    if (Object.prototype.hasOwnProperty.call(props.configs, props.useDataSource[source].dataSourceId)) {
      return props.configs[props.useDataSource[source].dataSourceId].subHeader
    }
    return null
  }

  const DataSourceFields = (ds: DataSource, info: IMDataSourceInfo) => {
    if (info.status !== 'LOADED') {
      return null
    }
    checkSourceSelect(ds.getLabel())

    const fieldSchema = Object.values(ds.getSchema().fields)
    const previouslySelectedFields = props.useDataSource[source].fields
    const selectedSchema = previouslySelectedFields ? fieldSchema.filter(s => previouslySelectedFields.includes(s.jimuName)) : []
    const selectedValues = makeAdvancedSelectItems(selectedSchema)
    const idsSchema = fieldSchema.filter(s => idTypes.includes(s.esriType))
    const idValues = makeAdvancedSelectItems(idsSchema)
    const editableValues = makeAdvancedSelectItems(fieldSchema.filter(s => !idTypes.includes(s.esriType)))
    const foreignKey = fetchForeignKey()
    const header = fetchHeader()
    const subHeader = fetchSubHeader()

    const foreignKeySelect = idValues.filter(v => v.value === foreignKey)
    const headerSelect = editableValues.filter(v => v.value === header)
    const subHeaderSelect = editableValues.filter(v => v.value === subHeader)
    console.log(header, subHeader)
    return <>
      <h3>Editable Fields</h3>
      <AdvancedSelect
        fluid
        strategy={'fixed'}
        isMultiple
        staticValues={editableValues}
        selectedValues={selectedValues}
        onChange={selectChange}
        isOpen={fieldSelectOpen}
        toggle={(isOpen) => setFieldSelectOpen(isOpen)}
      />
      <h3>List Header</h3>
      <AdvancedSelect
        fluid
        strategy={'fixed'}
        staticValues={editableValues}
        selectedValues={headerSelect}
        onChange={headChange}
        isOpen={headSelectOpen}
        toggle={(isOpen) => setHeadSelectOpen(isOpen)}
      />
      <h3>List SubHeader</h3>
      <AdvancedSelect
        fluid
        strategy={'fixed'}
        staticValues={editableValues}
        selectedValues={subHeaderSelect}
        onChange={subHeadChange}
        isOpen={subHeadSelectOpen}
        toggle={(isOpen) => setSubHeadSelectOpen(isOpen)}
      />
      <h3>Join Field</h3>
      <AdvancedSelect
        fluid
        strategy={'fixed'}
        selectedValues={foreignKeySelect}
        staticValues={idValues}
        onChange={joinChange}
        isOpen={joinSelectOpen}
        toggle={(isOpen) => setJoinSelectOpen(isOpen)}
      />
    </>
  }

  return (<>
    <form id="fieldSelect">
      <DataSourceSelect />
      <Fields />
    </form>

  </>)
}
