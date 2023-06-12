import {
  CalciteTabNav, CalciteTabs, CalciteTabTitle, CalciteTab
} from 'calcite-components'
import {
  React, DataSource, AllWidgetProps, DataSourceComponent, FeatureLayerQueryParams
} from 'jimu-core'
import TabBody from './tabBody'

/**
 * This widget will show features from a configured feature layer
 */
export default function Widget (props: AllWidgetProps<{}>) {
  const isDsConfigured = () => props.useDataSources && props.useDataSources.length > 0 && configPropsForAllLayers
  const [globalId, setGlobalId] = React.useState<string>(null)

  const configPropsForAllLayers = (): boolean => {
    const ids = props.useDataSources.map(ds => ds.dataSourceId)
    return ids.every(id => Object.prototype.hasOwnProperty.call(props.config, id))
  }
  const headerRender = (ds: DataSource) => {
    return <CalciteTabTitle className=" tab-title">
      {ds.getLabel()}
    </CalciteTabTitle>
  }

  if (!isDsConfigured()) {
    return <h3>
      This widget allows you to edit related tables in a feature layer
      <br />
      Configure the data source.
    </h3>
  } else {
    return <div className="widget-content" style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }}>
        <CalciteTabs className="jimu-widget surface-1">
          <CalciteTabNav className="" slot="title-group" >
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
                config={props.config[ds.dataSourceId]}
              />
            </CalciteTab>
          )
          )}
        </CalciteTabs>
      </div>
  }
}
