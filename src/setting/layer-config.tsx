import { React, Immutable, IMFieldSchema, DataSource, UseDataSource, AllDataSourceTypes } from 'jimu-core'
import { AllWidgetSettingProps } from 'jimu-for-builder'
import { DataSourceSelector, FieldSelector } from 'jimu-ui/advanced/data-source-selector'

export default function LayerConfig (props: AllWidgetSettingProps<{}>) {
  const onDataSourceChange = (useDataSources: UseDataSource[]) => {
    console.log(useDatasources)
    props.onSettingChange({
      id: props.id,
      useDataSources: useDataSources
    })
  }
  const onFieldChange = (allSelectedFields: IMFieldSchema[], ds: DataSource) => {
    props.onSettingChange({
      id: props.id,
      useDataSources: [...props.useDataSources].map(item => item.dataSourceId === ds.id ? { ...item, ...{ fields: allSelectedFields.map(f => f.jimuName) } } : item)
    })
  }

  return <>
    < DataSourceSelector
      types={Immutable([AllDataSourceTypes.FeatureLayer])}
    //   isMultiple={true}
      isMultipleDataView={false}
      useDataSources={props.useDataSources}
      disableDataView={true}
      useDataSourcesEnabled={true}
      onChange={onDataSourceChange}
      widgetId={props.id}
    //   disableDataSourceList={true}
      closeDataSourceListOnChange
      mustUseDataSource
    />
    {
      props.useDataSources && props.useDataSources.length > 0 &&
      <FieldSelector
      useDataSources={props.useDataSources}
      onChange={onFieldChange}
      isMultiple={true}
      useDropdown={true}
      selectedFields={props.useDataSources[0].fields || Immutable([])}
    />}
  </>
}
