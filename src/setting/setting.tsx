import { React, Immutable, UseDataSource, AllDataSourceTypes, ImmutableObject } from 'jimu-core'

import { AllWidgetSettingProps } from 'jimu-for-builder'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import DataSourceSettings from './dataSourceSettings'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { Config, DSProp, DSProps } from '../types'

export default function Setting (props: AllWidgetSettingProps<{}>) {
  const onFieldChange = (allSelectedFields: string[], sourceId: string) => {
    props.onSettingChange({
      id: props.id,
      useDataSources: [...props.useDataSources].map(item => item.dataSourceId === sourceId ? { ...item, ...{ fields: allSelectedFields } } : item)
    })
  }
  const onDSPropChange = (sourceId: string, prop: string, value: any) => {
    const config = props.config as Config

    const newDsProps = config.dsProps || {} as DSProps
    const newProp = newDsProps[sourceId] || {} as DSProp
    newProp[prop] = value
    newDsProps[sourceId] = newProp
    config.dsProps = newDsProps

    props.onSettingChange({
      id: props.id,
      useDataSources: [...props.useDataSources], //updating this seems to trigger experience builder to register that a change was made. IDK but i dont like it much
      config: config
    })
  }

  const configRootParam = (param: string, value: (string | boolean)) => {
    const newConfig = props.config
    newConfig[param] = value
    props.onSettingChange({
      id: props.id,
      useDataSources: [...props.useDataSources], //updating this seems to trigger experience builder to register that a change was made. IDK but i dont like it much
      config: newConfig
    })
  }

  const selectedFields = () => {
    let newFields = Immutable({}) as ImmutableObject<{ [dataSourceId: string]: string[] }>
    props.useDataSources.forEach(ds => {
      newFields = newFields.set(ds.dataSourceId, ds.fields ? ds.fields : [])
    })
    return newFields
  }

  const onDataSourceChange = (useDataSources: UseDataSource[]): void => {
    props.onSettingChange({
      id: props.id,
      useDataSources: useDataSources
    })
  }

  return <div className="use-feature-layer-setting p-2">
    <SettingSection title="Data">
      <SettingRow>
        <DataSourceSelector
          types={Immutable([AllDataSourceTypes.FeatureLayer])}
          useDataSources={props.useDataSources}
          useDataSourcesEnabled={true}
          mustUseDataSource={true}
          onChange={onDataSourceChange}
          widgetId={props.id}
          isMultiple={true}
        />
      </SettingRow>
    </SettingSection>
    {
      props.useDataSources && props.useDataSources.length > 0 && //TODO: check loaded status
      <DataSourceSettings
        useDataSource={props.useDataSources}
        onFieldChange={onFieldChange}
        selectedFields={selectedFields() || Immutable([])}
        widgetId={props.id}
        config={props.config as Config}
        dsPropChange={onDSPropChange}
        configRootParam={configRootParam}
      />
    }
  </div>
}
