import { React, ImmutableArray, UseDataSource, ImmutableObject, DataSourceComponent, getAppStore, appActions, FeatureLayerQueryParams, IMDataSourceInfo, FeatureLayerDataSource, DataSourceManager } from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { AdvancedSelect, AdvancedSelectItem, Switch, TextInput } from 'jimu-ui'
import { ChangeEvent } from 'react'
import DataSourceFieldSettings from './dataSourceFieldSettings'
import { Config, DSProp } from '../types'

interface Props {
  useDataSource: ImmutableArray<UseDataSource>
  selectedFields: ImmutableArray<any> | ImmutableObject<any>
  widgetId: string
  onFieldChange: (fields: Array<string | number>, sourceId: string) => void
  config: Config
  dsPropChange: (sourceId: string, prop: string, value: any) => void
  configRootParam: (param: string, value: (string | boolean)) => void
}

//TODO: lot of repetition in this file, need to see if i can minimize that
export default function DataSourceSettings (props: Props) {
  const ids = props.useDataSource.map(ds => ds.dataSourceId)
  const grabDS = (): UseDataSource => {
    return props.useDataSource.find(ds => ds.dataSourceId === source)
  }
  const fetchSourceNames = (): AdvancedSelectItem[] => {
    const dsm = DataSourceManager.getInstance()
    const dss = dsm.getDataSources()
    const items = Object.keys(dss).filter(ds => ids.includes(dss[ds].id)).map(ds => {
      const select = {} as AdvancedSelectItem
      select.label = fetchProp('label', dss[ds].id) || dss[ds].getLabel()
      select.value = dss[ds].id
      return select
    }) as unknown as AdvancedSelectItem[]

    return items
  }

  const fetchProp = (prop: string, id: string): string => {
    if (Object.prototype.hasOwnProperty.call(props.config, 'dsProps') && Object.prototype.hasOwnProperty.call(props.config.dsProps, id)) {
      return props.config.dsProps[id][prop]
    }
    return null
  }

  interface Labels { [sourceID: string]: string }

  const getLabels = (): Labels => {
    const labels = {}
    ids.forEach(id => {
      labels[id] = fetchProp('label', id)
    })
    return labels
  }

  const [labels, setLabels] = React.useState<Labels>(() => getLabels())
  const [source, setSource] = React.useState<string>(ids[0])
  //checks to see if our datasource ids includes the current source, in case we deselect a datasource that is currently visible in settings
  if (!ids.includes(source)) {
    setSource(ids[0])
  }
  const [sourceSelectOpen, setSourceSelectOpen] = React.useState<boolean>(false)
  const datasourceUpdate = (e: AdvancedSelectItem[]) => {
    setSource(e[0].value as string)
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

  const labelChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newLabels = { ...labels }
    newLabels[source] = event.target.value
    setLabels(newLabels)
  }

  const fetchDSProp = (id: string): DSProp => {
    if (Object.prototype.hasOwnProperty.call(props.config, 'dsProps') && Object.prototype.hasOwnProperty.call(props.config.dsProps, id)) {
      return props.config.dsProps[id] || {} as DSProp
    }
    return {} as DSProp
  }
  const DataSourceFields = (ds: FeatureLayerDataSource, info: IMDataSourceInfo) => {
    if (info.status !== 'LOADED') {
      return null
    }
    const fieldSchema = ds.layer.fields
    const previouslySelectedFields = grabDS().fields
    const selectedSchema = previouslySelectedFields ? fieldSchema.filter(s => previouslySelectedFields.includes(s.name)) : []

    return <DataSourceFieldSettings
      dsProp={fetchDSProp(source)}
      dsPropChange={props.dsPropChange}
      onFieldChange={props.onFieldChange}
      source={source}
      fieldSchema={fieldSchema}
      selectedSchema={selectedSchema}
      geometryType={ds.getGeometryType()}
      parentSource={fetchParentSourceToggle}
      parentDisplay={fetchParentDisplayToggle}
    />
  }

  const fetchParentSourceToggle = (): string => {
    if (Object.prototype.hasOwnProperty.call(props.config, 'parentDataSource')) { //TODO these fetch functions may not be necessary with the new config type
      return props.config.parentDataSource
    }
    return null
  }

  const fetchParentDisplayToggle = (): boolean => {
    if (Object.prototype.hasOwnProperty.call(props.config, 'displayParent')) {
      return props.config.displayParent
    }
    return false
  }

  const sourceToggleChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      getAppStore().dispatch(appActions.widgetStatePropChange(props.widgetId, 'parentDataSource', source))
      props.configRootParam(event.target.id, source)
    } else {
      getAppStore().dispatch(appActions.widgetStatePropChange(props.widgetId, 'parentDataSource', null))
      props.configRootParam(event.target.id, null)
    }
  }

  const displayParentToggleChange = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    props.configRootParam(event.target.id, checked)
  }

  const labelSet = (event: string) => {
    props.dsPropChange(source, 'label', event)
  }

  const sourceValues = fetchSourceNames()
  const sourceSelected = sourceValues.filter(s => s.value === source)
  return <>
    <SettingSection title="Select Data Source">
      <SettingRow>
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
      <SettingRow label='Label' flow='wrap'>
        <TextInput
          key="labelInput"
          value={labels[source] || ''}
          onChange={labelChange}
          onAcceptValue={labelSet}
          type="text"
          size='sm'
          className='w-100'
          placeholder="Data Source Label"
          aria-label={'label'}
        />
      </SettingRow>
      {(!fetchParentSourceToggle() || fetchParentSourceToggle() === source) &&
      <SettingRow>
        <div className='w-100 table-options' >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} className='table-options-item'>
              <span className='setting-text-level-1' style={{ width: '80%' }}>
                Parent Data Source?
              </span>
              <Switch
                className='can-x-switch'
                id="parentDataSource"
                checked={props.config.parentDataSource === source}
                onChange={sourceToggleChange}
              />
            </div>
          </div>
      </SettingRow>
      }
      {(fetchParentSourceToggle() === source) &&
      <SettingRow>
        <div className='w-100 table-options' >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} className='table-options-item'>
              <span className='setting-text-level-1' style={{ width: '80%' }}>
                Show in Widget?
              </span>
              <Switch
                className='can-x-switch'
                id="displayParent"
                checked={fetchParentDisplayToggle()}
                onChange={displayParentToggleChange}
              />
            </div>
          </div>
      </SettingRow>
      }
    </SettingSection>
    {Fields()}
  </>
}
