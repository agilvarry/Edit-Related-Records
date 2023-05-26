import '@esri/calcite-components/dist/components/calcite-tabs'
import '@esri/calcite-components/dist/components/calcite-tab'
import '@esri/calcite-components/dist/components/calcite-tab-nav'
import '@esri/calcite-components/dist/components/calcite-tab-title'

import {
  CalciteTabNav, CalciteTabs, CalciteTabTitle, CalciteTab
} from '@esri/calcite-components-react'
import {
  React, DataSource, AllWidgetProps, DataSourceComponent, FeatureLayerQueryParams, getAppStore
} from 'jimu-core'
import TabBody from './tabBody'

/**
 * This widget will show features from a configured feature layer
 */
export default function Widget (props: AllWidgetProps<{}>) {
  const isDsConfigured = () => props.useDataSources && props.useDataSources.length > 0
  const store = getAppStore()
  const dataId = store.getState().queryObject.data_id
  console.log(dataId)
  const [globalId, setGlobalId] = React.useState<string>(null)

  const headerRender = (ds: DataSource) => {
    return <>
      <CalciteTabTitle>
        {ds.getLabel()}
      </CalciteTabTitle>
    </>
  }

  if (!isDsConfigured()) {
    return <h3>
      This widget allows you to edit related tables in a feature layer
      <br />
      Configure the data source.
    </h3>
  } else {
    return <div className="widget-use-feature-layer" style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <CalciteTabs >
        <CalciteTabNav slot="title-group">
          {props.useDataSources.map(ds => (
            <DataSourceComponent useDataSource={ds} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.id} queryCount>
              {headerRender}
            </DataSourceComponent>)
          )}
        </CalciteTabNav>
        {props.useDataSources.map(ds => (
          <CalciteTab>
            <TabBody key={ds.mainDataSourceId}
              globalId={globalId}
              setGlobalId={setGlobalId}
              widgetId={props.id}
              dataSource={ds}
            />
          </CalciteTab>
        )
        )}
      </CalciteTabs>
    </div >
  }
}
