import {
  CalciteTabNav, CalciteTabs, CalciteTabTitle, CalciteTab
} from 'calcite-components'
import {
  React, DataSource, AllWidgetProps, DataSourceComponent, FeatureLayerQueryParams, DataSourceManager
} from 'jimu-core'
import TabBody from './tabBody'

/**
 * This widget will show features from a configured feature layer
 */
export default function Widget (props: AllWidgetProps<{}>) {
  //TODO: I need to sort the type issue here so I can access the property directly
  const parentDataSourceSet = (property: string): string => Object.prototype.hasOwnProperty.call(props.config, property) && props.config[property]
  const getConfigProp = (property: string): (string | boolean) => {
    return props.config[property]
  }
  const displayDataSource = (dataSourceId: string): boolean => {
    return (getConfigProp('parentDataSource') !== dataSourceId || (getConfigProp('parentDataSource') === dataSourceId && getConfigProp('displayParent') as boolean))
  }
  const isDsConfigured = () => parentDataSourceSet('parentDataSource') && props.useDataSources && props.useDataSources.length > 0 && configPropsForAllLayers
  const [globalId, setGlobalId] = React.useState<string[]>(null)

  const fetchConfigProp = (prop: string, id: string) => { //TODO: rename this to something like dsprop
    if (Object.prototype.hasOwnProperty.call(props.config, id)) {
      return props.config[id][prop]
    }
    return null
  }
  const configPropsForAllLayers = (): boolean => {
    const ids = props.useDataSources.map(ds => ds.dataSourceId)
    return ids.every(id => Object.prototype.hasOwnProperty.call(props.config, id))
  }
  const headerRender = (ds: DataSource) => {
    const label = fetchConfigProp('label', ds.id)
    return <CalciteTabTitle className=" tab-title">
      {label || ds.getLabel()}
    </CalciteTabTitle>
  }
  const checkSelectedRecords = () => {
    const dsm = DataSourceManager.getInstance()
    dsm.getDataSources().forEach(ds => {
      console.log(ds)
    })
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
            {props.useDataSources.map(ds => <>
              {displayDataSource(ds.dataSourceId) && <DataSourceComponent useDataSource={ds} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.id} queryCount>
                {headerRender}
                </DataSourceComponent>}
                </>
            )}
          </CalciteTabNav>
          {props.useDataSources.map(ds => <>
            {ds.dataSourceId === props.config.parentDataSource && checkSelectedRecords()}

            {displayDataSource(ds.dataSourceId) && <CalciteTab>
              <TabBody key={ds.mainDataSourceId}
                globalId={globalId}
                setGlobalId={setGlobalId}
                widgetId={props.id}
                dataSource={ds}
                config={props.config[ds.dataSourceId]}
              />
            </CalciteTab>}
          </>
          )}
        </CalciteTabs>
      </div>
  }
}
