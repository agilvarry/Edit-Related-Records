import {
  CalciteTabNav, CalciteTabs, CalciteTabTitle, CalciteTab
} from 'calcite-components'
import {
  React, DataSource, AllWidgetProps, DataSourceComponent, FeatureLayerQueryParams, IMDataSourceInfo
} from 'jimu-core'
import TabBody from './tabBody'
import { configProps } from '../types'

/**
 * This widget will show features from a configured feature layer
 */

export default function Widget (props: AllWidgetProps<{}>) {
  const config = props.config as configProps

  const displayDataSource = (dataSourceId: string): boolean => {
    return (config.parentDataSource !== dataSourceId || (config.parentDataSource === dataSourceId && config.displayParent))
  }
  const isDsConfigured = () => config.parentDataSource && props.useDataSources && props.useDataSources.length > 0 && configPropsForAllLayers
  const [globalId, setGlobalId] = React.useState<string>(null)

  const fetchConfigProp = (prop: string, id: string) => {
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

  const checkSelectedRecords = (ds: DataSource, info: IMDataSourceInfo) => {
    const selectedRecords = ds.getSelectedRecords().map(r => r.getData())
    if (selectedRecords.length > 0 && selectedRecords[0].globalid !== globalId) {
      setGlobalId(selectedRecords[0].globalid)
    } else if (selectedRecords.length === 0) {
      setGlobalId(null)
    }
    return null
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
              {ds.dataSourceId === config.parentDataSource && <DataSourceComponent useDataSource={ds} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.id} queryCount>
                {checkSelectedRecords}
                </DataSourceComponent>}
              {displayDataSource(ds.dataSourceId) && <DataSourceComponent useDataSource={ds} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.id} queryCount>
                {headerRender}
                </DataSourceComponent>}
                </>
            )}
          </CalciteTabNav>
          {props.useDataSources.map(ds => <>
            {displayDataSource(ds.dataSourceId) && <CalciteTab>
              <TabBody key={ds.mainDataSourceId}
                globalId={globalId}
                widgetId={props.id}
                dataSource={ds}
                config={props.config[ds.dataSourceId]}
                isParent={ds.dataSourceId === config.parentDataSource}
              />
            </CalciteTab>}
          </>
          )}
        </CalciteTabs>
      </div>
  }
}
