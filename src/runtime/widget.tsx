import {
  React, AllWidgetProps, DataSourceManager, FeatureLayerDataSource, getAppStore
} from 'jimu-core'
import App from './app'

/**
 * This widget will show features from a configured feature layer
 */

export default function Widget (props: AllWidgetProps<{}>) {
  const [dss, setDss] = React.useState<FeatureLayerDataSource[]>(null)
  const dsm = DataSourceManager.getInstance()

  const store = getAppStore().getState()
  console.log(store.queryObject.data_id)
  React.useEffect(() => {
    const fetchDss = () => {
      const flds = [] as FeatureLayerDataSource[]
      try {
        dsm.createAllDataSources().then(dss => {
          props.useDataSources.forEach(ds => {
            const dataSource = dsm.getDataSource(ds.dataSourceId) as FeatureLayerDataSource
            flds.push(dataSource)
          })
          setDss(flds)
        })
      } catch (e) {
        console.log(e)
      }
    }
    setTimeout(function () {
      fetchDss()
    })
  }, [dsm, props.useDataSources])

  console.log(props)

  return dss?.length === props.useDataSources.length && <App
  props={props}
  dss={dss} />
}
