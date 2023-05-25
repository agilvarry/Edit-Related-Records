import '@esri/calcite-components/dist/components/calcite-tabs'
import '@esri/calcite-components/dist/components/calcite-tab'
import '@esri/calcite-components/dist/components/calcite-tab-nav'
import '@esri/calcite-components/dist/components/calcite-tab-title'

import {
  CalciteTabNav, CalciteTabs, CalciteTabTitle, CalciteTab
} from '@esri/calcite-components-react'
import {
  React, DataSource, AllWidgetProps, DataSourceComponent, FeatureLayerQueryParams
} from 'jimu-core'
import TabBody from './tabBody'

/**
 * This widget will show features from a configured feature layer
 */
export default function Widget (props: AllWidgetProps<{}>) {
  // const store = getAppStore()

  const isDsConfigured = () => props.useDataSources && props.useDataSources.length >= 0

  const fetchGlobalId = (): string => {
    // const dataId = store.getState().queryObject.data_id
    // if (dataId) {
    //   const dataArr = dataId.split(':')
    //   const dsm = DataSourceManager.getInstance()
    //   dsm.createAllDataSources().then(dss => {
    //     dss[0].getChildDataSources().forEach(ds => {
    //       if (ds.id === dataArr[0]) {
    //         console.log(ds.getRecords())
    //       }
    //     })
    //   })
    //   return ''
    // }
    return null
  }
  const [globalId, setGlobalId] = React.useState<string>(fetchGlobalId)
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
            <TabBody key = {ds.mainDataSourceId}
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
