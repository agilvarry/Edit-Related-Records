import Field from 'esri/layers/support/Field'
import { React, ImmutableArray, UseDataSource, ImmutableObject, DataSourceComponent, FeatureLayerQueryParams, IMDataSourceInfo, DataSourceManager, FeatureLayerDataSource } from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { AdvancedSelect, AdvancedSelectItem, Switch, TextInput } from 'jimu-ui'
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
  const ids = props.useDataSource.map(ds => ds.dataSourceId)
  const grabDS = (): UseDataSource => {
    return props.useDataSource.find(ds => ds.dataSourceId === source)
  }
  const fetchSourceNames = (): AdvancedSelectItem[] => {
    const dsm = DataSourceManager.getInstance()
    const dss = dsm.getDataSources()
    const items = Object.keys(dss).filter(ds => ids.includes(dss[ds].id)).map(ds => {
      const select = {} as AdvancedSelectItem
      select.label = dss[ds].getLabel()
      select.value = dss[ds].id
      return select
    }) as unknown as AdvancedSelectItem[]

    return items
  }

  const idTypes = ['oid', 'global-id', 'guid']
  const [source, setSource] = React.useState<string>(ids[0])
  const [fieldSelectOpen, setFieldSelectOpen] = React.useState<boolean>(false)
  /**
   * These only exist becasue it allows me to update my selects. need a better solution
   */

  const [joinSelectOpen, setJoinSelectOpen] = React.useState<boolean>(false)
  const [headSelectOpen, setHeadSelectOpen] = React.useState<boolean>(false)
  const [subHeadSelectOpen, setSubHeadSelectOpen] = React.useState<boolean>(false)
  const [sourceSelectOpen, setSourceSelectOpen] = React.useState<boolean>(false)

  const datasourceUpdate = (e: AdvancedSelectItem[]) => {
    setSource(e[0].value as string)
  }

  const DataSourceSelect = () => {
    const sourceValues = fetchSourceNames()
    const sourceSelected = sourceValues.filter(s => s.value === source)
    return <>
      <SettingSection title="Data Source">
        <SettingRow label="Change Data Source" flow='wrap'>
          <AdvancedSelect
            fluid
            strategy={'fixed'}
            staticValues={sourceValues}
            selectedValues={sourceSelected}
            onChange={datasourceUpdate}
            isOpen={sourceSelectOpen}
            toggle={(isOpen) => setSourceSelectOpen(isOpen)}
          />
        </SettingRow>
        <SettingRow label="label" flow='wrap'>
          <TextInput
            allowClear
            onAcceptValue={labelChange}
            type="text"
            placeholder="Data Source Label"
          />
        </SettingRow>
      </SettingSection>
    </>
  }

  const Fields = () => {
    let index = 0
    props.useDataSource.forEach((ds, i) => {
      if (ds.dataSourceId === source) index = i
    })
    return <DataSourceComponent useDataSource={props.useDataSource[index]} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.widgetId}>
      {DataSourceFields}
    </DataSourceComponent>
  }

  const joinChange = (event: AdvancedSelectItem[]) => {
    props.configChange(grabDS().dataSourceId, 'foreignKey', event[0].value)
  }
  const labelChange = (event: string) => {
    props.configChange(grabDS().dataSourceId, 'dslabel', event)
  }
  const headChange = (event: AdvancedSelectItem[]) => {
    props.configChange(grabDS().dataSourceId, 'header', event[0].value)
  }
  const subHeadChange = (event: AdvancedSelectItem[]) => {
    props.configChange(grabDS().dataSourceId, 'subHeader', event[0].value)
  }
  const toggleChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    props.configChange(grabDS().dataSourceId, 'newFeatures', checked)
  }

  const selectChange = (event: AdvancedSelectItem[]) => {
    const selected = event.map(item => item.value)
    props.onChange(selected, grabDS().dataSourceId)
  }

  const makeAdvancedSelectItems = (schema: Field[]) => {
    return schema.map(s => {
      const select = {} as AdvancedSelectItem
      select.label = s.alias
      select.value = s.name
      return select
    }) as unknown as AdvancedSelectItem[]
  }

  const fetchForeignKey = () => {
    if (Object.prototype.hasOwnProperty.call(props.configs, grabDS().dataSourceId)) {
      return props.configs[grabDS().dataSourceId].foreignKey
    }
    return null
  }

  const fetchHeader = () => {
    if (Object.prototype.hasOwnProperty.call(props.configs, grabDS().dataSourceId)) {
      return props.configs[grabDS().dataSourceId].header
    }
    return null
  }

  const fetchSubHeader = () => {
    if (Object.prototype.hasOwnProperty.call(props.configs, grabDS().dataSourceId)) {
      return props.configs[grabDS().dataSourceId].subHeader
    }
    return null
  }

  const fetchNewFeaturesToggle = (): boolean => {
    if (Object.prototype.hasOwnProperty.call(props.configs, grabDS().dataSourceId)) {
      return !!props.configs[grabDS().dataSourceId].newFeatures
    }
    return false
  }

  const DataSourceFields = (ds: FeatureLayerDataSource, info: IMDataSourceInfo) => {
    if (info.status !== 'LOADED') {
      return null
    }
    const fieldSchema = ds.layer.fields
    const previouslySelectedFields = grabDS().fields
    const selectedSchema = previouslySelectedFields ? fieldSchema.filter(s => previouslySelectedFields.includes(s.name)) : []
    const selectedValues = makeAdvancedSelectItems(selectedSchema)
    const idValues = makeAdvancedSelectItems(fieldSchema.filter(s => idTypes.includes(s.type)))
    const selectableValues = makeAdvancedSelectItems(fieldSchema.filter(s => !idTypes.includes(s.type)))

    const foreignKeySelect = idValues.filter(v => v.value === fetchForeignKey())
    const headerSelect = selectableValues.filter(v => v.value === fetchHeader())
    const subHeaderSelect = selectableValues.filter(v => v.value === fetchSubHeader())

    return <>
      <SettingSection title="Editable Fields">
        <SettingRow>
          <AdvancedSelect
            fluid
            strategy={'fixed'}
            isMultiple
            staticValues={selectableValues}
            selectedValues={selectedValues}
            onChange={selectChange}
            isOpen={fieldSelectOpen}
            toggle={(isOpen) => setFieldSelectOpen(isOpen)}
          />
        </SettingRow>
      </SettingSection>

      <SettingSection title="List Labels">
        <SettingRow label="Header" flow='wrap'>
          <AdvancedSelect
            fluid
            strategy={'fixed'}
            staticValues={selectableValues}
            selectedValues={headerSelect}
            onChange={headChange}
            isOpen={headSelectOpen}
            toggle={(isOpen) => setHeadSelectOpen(isOpen)}
          />
        </SettingRow>
        <SettingRow label="SubHeader (optional)" flow='wrap'>
          <AdvancedSelect
            fluid
            strategy={'fixed'}
            staticValues={selectableValues}
            selectedValues={subHeaderSelect}
            onChange={subHeadChange}
            isOpen={subHeadSelectOpen}
            toggle={(isOpen) => setSubHeadSelectOpen(isOpen)}
          />
        </SettingRow>
      </SettingSection>
      <SettingSection title="Join field">
        <SettingRow>
          <AdvancedSelect
            fluid
            strategy={'fixed'}
            selectedValues={foreignKeySelect}
            staticValues={idValues}
            onChange={joinChange}
            isOpen={joinSelectOpen}
            toggle={(isOpen) => setJoinSelectOpen(isOpen)}
          />
        </SettingRow>
      </SettingSection>
      {!ds.getGeometryType() &&
        <SettingSection>
          <div className='w-100 table-options' >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} className='table-options-item'>
              <span className='setting-text-level-1' style={{ width: '80%' }}>
                Create New Records?
              </span>
              <Switch
                className='can-x-switch'
                id="newFeatures"
                checked={fetchNewFeaturesToggle()}
                onChange={toggleChange}
              />
            </div>
          </div>
        </SettingSection>}
    </>
  }

  return (<>
    <form id="fieldSelect">
      <DataSourceSelect />
      <Fields />
    </form>

  </>)
}
