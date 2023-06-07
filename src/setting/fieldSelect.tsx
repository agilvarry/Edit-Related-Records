import { React, DataSource, ImmutableArray, UseDataSource, ImmutableObject, DataSourceComponent, FeatureLayerQueryParams, IMDataSourceInfo, FieldSchema, DataSourceManager } from 'jimu-core'

import { AdvancedSelect, AdvancedSelectItem, Switch } from 'jimu-ui'
import { ChangeEvent } from 'react'
interface Props {
  useDataSource: ImmutableArray<UseDataSource>
  selectedFields: ImmutableArray<any> | ImmutableObject<any>
  widgetId: string
  onChange: (fields: Array<string | number>, sourceId: string) => void
  configs: any //TODO: what is the type of config?
  configChange: (sourceId: string, configProp: string, value: any) => void
}
//TODO: lot of repetition in this file, need to see if i can minimize that
export default function FieldSelect (props: Props) {
  const fetchSourceNames = (): AdvancedSelectItem[] => {
    const dsm = DataSourceManager.getInstance()
    const dss = dsm.getDataSources()
    const items = Object.keys(dss).filter(ds => dss[ds].order > -1).map(ds => {
      const select = {} as AdvancedSelectItem
      select.label = dss[ds].getLabel()
      select.value = dss[ds].order
      return select
    }) as unknown as AdvancedSelectItem[]
    console.log(items)
    return items
  }

  const idTypes = ['esriFieldTypeGlobalID', 'esriFieldTypeOID', 'esriFieldTypeGUID']
  const [source, setSource] = React.useState<number>(0)
  const [sourceValues] = React.useState<AdvancedSelectItem[]>(fetchSourceNames())
  const [fieldSelectOpen, setFieldSelectOpen] = React.useState<boolean>(false)
  /**
   * These only exist becasue it allows me to update my selects. need a better solution
   */
  const [joinSelectOpen, setJoinSelectOpen] = React.useState<boolean>(false)
  const [headSelectOpen, setHeadSelectOpen] = React.useState<boolean>(false)
  const [subHeadSelectOpen, setSubHeadSelectOpen] = React.useState<boolean>(false)
  const [sourceSelectOpen, setSourceSelectOpen] = React.useState<boolean>(false)

  const datasourceUpdate = (e: AdvancedSelectItem[]) => {
    setSource(e[0].value as number)
  }

  const DataSourceSelect = () => {
    const sourceSelected = sourceValues.filter(s => s.value === source)
    return <>
      <h3>Selected Data Source</h3>
      <AdvancedSelect
        fluid
        strategy={'fixed'}
        staticValues={sourceValues}
        selectedValues={sourceSelected}
        onChange={datasourceUpdate}
        isOpen={sourceSelectOpen}
        toggle={(isOpen) => setSourceSelectOpen(isOpen)}
      />
    </>
  }

  const Fields = () => {
    return <DataSourceComponent useDataSource={props.useDataSource[source]} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.widgetId}>
      {DataSourceFields}
    </DataSourceComponent>
  }

  const joinChange = (event: AdvancedSelectItem[]) => {
    props.configChange(props.useDataSource[source].dataSourceId, 'foreignKey', event[0].value)
  }
  const headChange = (event: AdvancedSelectItem[]) => {
    props.configChange(props.useDataSource[source].dataSourceId, 'header', event[0].value)
  }
  const subHeadChange = (event: AdvancedSelectItem[]) => {
    props.configChange(props.useDataSource[source].dataSourceId, 'subHeader', event[0].value)
  }
  const toggleChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    console.log(event, checked)
    props.configChange(props.useDataSource[source].dataSourceId, 'newFeatures', checked)
  }

  const selectChange = (event: AdvancedSelectItem[]) => {
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

  const fetchNewFeaturesToggle = (): boolean => {
    if (Object.prototype.hasOwnProperty.call(props.configs, props.useDataSource[source].dataSourceId)) {
      return !!props.configs[props.useDataSource[source].dataSourceId].newFeatures
    }
    return false
  }

  const DataSourceFields = (ds: DataSource, info: IMDataSourceInfo) => {
    if (info.status !== 'LOADED') {
      return null
    }

    const fieldSchema = Object.values(ds.getSchema().fields)
    const previouslySelectedFields = props.useDataSource[source].fields
    const selectedSchema = previouslySelectedFields ? fieldSchema.filter(s => previouslySelectedFields.includes(s.jimuName)) : []
    const selectedValues = makeAdvancedSelectItems(selectedSchema)
    const idsSchema = fieldSchema.filter(s => idTypes.includes(s.esriType))
    const idValues = makeAdvancedSelectItems(idsSchema)
    const editableValues = makeAdvancedSelectItems(fieldSchema.filter(s => !idTypes.includes(s.esriType)))

    const foreignKeySelect = idValues.filter(v => v.value === fetchForeignKey())
    const headerSelect = editableValues.filter(v => v.value === fetchHeader())
    const subHeaderSelect = editableValues.filter(v => v.value === fetchSubHeader())
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

      <h3>Create New Features</h3>
      <Switch
        aria-label="Switch"
        checked={fetchNewFeaturesToggle()}
        onChange={toggleChange}
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
