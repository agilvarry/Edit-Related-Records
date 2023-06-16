import {
  CalciteTabNav, CalciteTabs, CalciteTabTitle, CalciteTab
} from 'calcite-components'
import {
  React, AllWidgetProps, FeatureLayerDataSource, ImmutableArray, getAppStore
} from 'jimu-core'
import TabBody from './tabBody'
import { Config } from '../types'

interface Props {
  props: AllWidgetProps<{}>
  dss: FeatureLayerDataSource[]
//   configs: PropConfigs
}
interface StateProps {
  selectionId: string
}
export default function App ({ props, dss }: Props) {
  const stateProps = props.stateProps || {} as StateProps

  const store = getAppStore().getState()
  console.log(store.queryObject.data_id)

  const globalId = Object.prototype.hasOwnProperty.call(stateProps, 'selectionId') ? stateProps.selectionId : null

  const config = props.config as Config
  const displayDataSource = (dataSourceId: string): boolean => (config.parentDataSource !== dataSourceId || (config.parentDataSource === dataSourceId && config.displayParent))
  const isDsConfigured = () => config.parentDataSource && props.useDataSources && props.useDataSources.length > 0 && configPropsForAllLayers()

  const configPropsForAllLayers = (): boolean => {
    if (Object.prototype.hasOwnProperty.call(config, 'dsProps')) {
      const ids = props.useDataSources.map(ds => ds.dataSourceId)
      return ids.every(id => Object.prototype.hasOwnProperty.call(config.dsProps, id))
    }
    return false
  }

  const fetchProp = (prop: string, id: string): string => {
    if (Object.prototype.hasOwnProperty.call(config, 'dsProps') && Object.prototype.hasOwnProperty.call(config.dsProps, id)) {
      return config.dsProps[id][prop]
    }
    return null
  }

  const fetchFields = (id: string): ImmutableArray<string> => {
    return props.useDataSources.filter(uds => uds.dataSourceId === id)[0].fields
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
              {dss.map(ds => {
                return <CalciteTabTitle className=" tab-title">
                  {fetchProp('label', ds.id) || ds.getLabel()}
                </CalciteTabTitle>
              })}
            </CalciteTabNav>
            {dss.map(ds => <>
              {displayDataSource(ds.id) && <CalciteTab>
                <TabBody
                  globalId={globalId}
                  widgetId={props.id}
                  fields={fetchFields(ds.id)}
                  dataSource={ds}
                  dsProp={config.dsProps[ds.id]}
                  isParent={ds.id === config.parentDataSource}
                />
              </CalciteTab>}
            </>
            )}
          </CalciteTabs>
        </div>
  }
}
