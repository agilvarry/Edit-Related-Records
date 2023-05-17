import { React, Immutable, UseDataSource, AllDataSourceTypes, ImmutableObject } from 'jimu-core'
import { AllWidgetSettingProps } from 'jimu-for-builder'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import FieldSelect from './fieldSelect'
export default function Setting (props: AllWidgetSettingProps<{}>) {
  const onFieldChange = (allSelectedFields: string[], sourceId: string) => {
    props.onSettingChange({
      id: props.id,
      useDataSources: [...props.useDataSources].map(item => item.dataSourceId === sourceId ? { ...item, ...{ fields: allSelectedFields } } : item)
    })
  }

  const selectedFields = () => {
    let newFields = Immutable({}) as ImmutableObject<{ [dataSourceId: string]: string[] }>
    props.useDataSources.forEach(ds => {
      newFields = newFields.set(ds.dataSourceId, ds.fields ? ds.fields : [])
    })
    return newFields
  }

  const onDataSourceChange = (useDataSources: UseDataSource[]) => {
    props.onSettingChange({
      id: props.id,
      useDataSources: useDataSources
    })
  }

  return <div className="use-feature-layer-setting p-2">
    <DataSourceSelector
      types={Immutable([AllDataSourceTypes.FeatureLayer])}
      useDataSources={props.useDataSources}
      useDataSourcesEnabled={props.useDataSourcesEnabled}
      // onToggleUseDataEnabled={onToggleUseDataEnabled}
      onChange={onDataSourceChange}
      widgetId={props.id}
      isMultiple={true}
    />
    {
      props.useDataSources && props.useDataSources.length > 0 && //TODO: check loaded status
      <FieldSelect
        useDataSource={props.useDataSources}
        onChange={onFieldChange}
        selectedFields={selectedFields() || Immutable([])}
        widgetId={props.id}
      />
    }
  </div>
}
