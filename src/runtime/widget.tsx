import {
  React, AllWidgetProps, DataSourceManager, FeatureLayerDataSource
} from 'jimu-core'
import App from './app'

/**
 * This widget will show features from a configured feature layer
 */

export default function Widget (props: AllWidgetProps<{}>) {
  const [dss, setDss] = React.useState<FeatureLayerDataSource[]>(null)
  const dsm = DataSourceManager.getInstance()

  React.useEffect(() => {
    const fetchDss = () => {
      const flds = [] as FeatureLayerDataSource[]
      try {
        dsm.createAllDataSources().then(_dss => {
          props.useDataSources?.forEach(ds => {
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

  return dss?.length === props.useDataSources?.length && <div className="widget-content esri-widget" style={{ border: '1px solid var(--dark)' }}><App
  props={props}
  dss={dss} /></div>
}
