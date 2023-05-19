import '@esri/calcite-components/dist/components/calcite-tabs'
import '@esri/calcite-components/dist/components/calcite-tab'
import '@esri/calcite-components/dist/components/calcite-tab-nav'
import '@esri/calcite-components/dist/components/calcite-tab-title'
import '@esri/calcite-components/dist/components/calcite-notice'
import '@esri/calcite-components/dist/components/calcite-label'

import {
  CalciteTabNav, CalciteTabs, CalciteTabTitle, CalciteTab
} from '@esri/calcite-components-react'
import {
  React, DataSource, AllWidgetProps, DataSourceComponent, FeatureLayerQueryParams
} from 'jimu-core'
import TabBody from './tabBody'
// import { Input } from 'jimu-ui'
// import { Tabs, Tab, Label, Input } from 'jimu-ui'

/**
 * This widget will show features from a configured feature layer
 */
export default function Widget (props: AllWidgetProps<{}>) {
  const isDsConfigured = () => props.useDataSources && props.useDataSources.length >= 0
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
          <TabBody
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
