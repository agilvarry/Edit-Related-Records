import { React, Immutable, IMFieldSchema, UseDataSource, AllDataSourceTypes, DataSource, ImmutableObject } from 'jimu-core'
import { AllWidgetSettingProps } from 'jimu-for-builder'
import { DataSourceSelector, FieldSelector } from 'jimu-ui/advanced/data-source-selector'

export default function Setting (props: AllWidgetSettingProps<{}>) {
  const onFieldChange = (allSelectedFields: IMFieldSchema[], ds: DataSource, isSelectedFromRepeatedDataSourceContext: boolean) => {
    props.onSettingChange({
      id: props.id,
      useDataSources: [...props.useDataSources].map(item => item.dataSourceId === ds.id ? { ...item, ...{ fields: allSelectedFields.map(f => f.jimuName) } } : item)
    })
  }

  const onToggleUseDataEnabled = (useDataSourcesEnabled: boolean) => {
    props.onSettingChange({
      id: props.id,
      useDataSourcesEnabled
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
      onToggleUseDataEnabled={onToggleUseDataEnabled}
      onChange={onDataSourceChange}
      widgetId={props.id}
      isMultiple={true}
    />
    {
      props.useDataSources && props.useDataSources.length > 0 &&
      <FieldSelector
        useDataSources={props.useDataSources}
        onChange={onFieldChange}
        selectedFields={selectedFields() || Immutable([])}
      />
    }
  </div>
}
