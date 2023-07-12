import {
  React, AllWidgetProps, DataSourceManager, FeatureLayerDataSource
} from 'jimu-core'
import App from './app'
import { Config } from '../types'

interface StateProps {
  selection: Selection
}
/**
 * read data from the DataSourceManager in the Widget componenet and send it along with props to app.tsx
 */
export default function Widget (props: AllWidgetProps<{}>) {
  const stateProps = props.stateProps || {} as StateProps
  const config = props.config as Config
  const parentForeignKey = config.dsProps[config.parentDataSource].foreignKey
  const selectedFeatureIdMatch = async (id: string): Promise<boolean> => {
    console.log(id)
    const ds = dss.filter(ds => ds.id === config.parentDataSource)[0]
    await ds.ready()
    const ids = ds.getSelectedRecords().map(r => r.getData()[parentForeignKey])
    return ids[0] === id
  }

  const [dss, setDss] = React.useState<FeatureLayerDataSource[]>(null)
  const dsm = DataSourceManager.getInstance()
  const selection = Object.prototype.hasOwnProperty.call(stateProps, 'selection') ? stateProps.selection : null
  console.log(selection)
  const globalId = selection && selection.sourceId === config.parentDataSource && selectedFeatureIdMatch(selection.data[parentForeignKey]) ? selection.data[parentForeignKey] : null

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
    }, 1000)
  }, [dsm, props.useDataSources])
  return dss?.length === props.useDataSources?.length && <div className="widget-content esri-widget" style={{ border: '1px solid var(--dark)' }}><App
  props={props}
  globalId={globalId}
  dss={dss} /></div>
}
