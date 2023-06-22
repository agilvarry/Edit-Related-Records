import {
  CalciteTabNav, CalciteTabs, CalciteTabTitle, CalciteTab, CalciteListItem, CalciteList
} from 'calcite-components'
import {
  React, AllWidgetProps, FeatureLayerDataSource, ImmutableArray
} from 'jimu-core'
import TabBody from './tabBody'
import { Config } from '../types'

interface Props {
  props: AllWidgetProps<{}>
  dss: FeatureLayerDataSource[]
  globalId: string
}

export default function App ({ props, dss, globalId }: Props) {
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

  //get fields from UseDataSource for current ds Id
  const fetchFields = (id: string): ImmutableArray<string> => {
    return props.useDataSources.filter(uds => uds.dataSourceId === id)[0].fields
  }

  if (!isDsConfigured()) {
    return <CalciteList><CalciteListItem label="This widget allows you to edit related tables in a feature layer" description='Configure the data source.'></CalciteListItem></CalciteList>
  } else {
    return <div className="" style={{ border: 'black 1px', width: '100%', height: '100%', backgroundColor: '#ffffff' }}>
      <CalciteTabs className="jimu-widget surface-1" style={{ padding: '10px 16px 16px' }}>
        <CalciteTabNav className="" slot="title-group" >
          {dss.map(ds => {
            if (ds.id !== config.parentDataSource || (ds.id === config.parentDataSource && config.displayParent)) {
              return <CalciteTabTitle className=" tab-title">
                {fetchProp('label', ds.id) || ds.getLabel()}
              </CalciteTabTitle>
            }
            return null
          })}
        </CalciteTabNav>
        {dss.map(ds => <>
          {displayDataSource(ds.id) && <CalciteTab style={{ paddingBlock: 'inherit' }}>
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
