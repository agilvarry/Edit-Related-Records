/**
  Licensing

  Copyright 2022 Esri

  Licensed under the Apache License, Version 2.0 (the "License"); You
  may not use this file except in compliance with the License. You may
  obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
  implied. See the License for the specific language governing
  permissions and limitations under the License.

  A copy of the license is available in the repository's
  LICENSE file.
*/
import '@esri/calcite-components/dist/components/calcite-tabs'
import '@esri/calcite-components/dist/components/calcite-tab'
import '@esri/calcite-components/dist/components/calcite-tab-nav'
import '@esri/calcite-components/dist/components/calcite-tab-title'
import '@esri/calcite-components/dist/components/calcite-notice'
import '@esri/calcite-components/dist/components/calcite-label'
import '@esri/calcite-components/dist/components/calcite-input'

import {
  CalciteLabel
  // , CalciteInput
  , CalciteTab, CalciteTabNav, CalciteTabs, CalciteTabTitle
} from '@esri/calcite-components-react'
import {
  React, DataSource, AllWidgetProps, DataSourceComponent, FeatureLayerQueryParams, css
} from 'jimu-core'
// import { Input } from 'jimu-ui'
// import { Tabs, Tab, Label, Input } from 'jimu-ui'

/**
 * This widget will show features from a configured feature layer
 */
export default function Widget(props: AllWidgetProps<{}>) {
  const isDsConfigured = () => props.useDataSources && props.useDataSources.length >= 0
  const [globalId, setGlobalId] = React.useState<string>(null)

  const tabRender = (ds: DataSource) => {
    const selectedRecords = ds.getSelectedRecords().map(r => r.getData())
    if (selectedRecords[0] && selectedRecords[0].globalid !== globalId) {
      setGlobalId(selectedRecords[0].globalid)
    }

    const allRecords = ds.getRecords().map(r => r.getData())
    const res = allRecords.filter(res => res.globalid === globalId || res.parentglobalid === globalId)

    return <CalciteTab>
      <div className="tab-content" style={{
        overflow: 'auto'
      }}>
        {res && res.map(r => {
          return <>

            <CalciteLabel> Break </CalciteLabel>
            {Object.entries(r).map((t, k) => {
              return <div>
              <CalciteLabel key={k}>{t[0]}</CalciteLabel>
              {/* <Input key={k} valid type={typeof t[1] === 'string' ? 'text' : typeof t[1]}></Input> */}
              </div>
            })}
          </>
        })}
      </div>
    </CalciteTab >
  }

  const headerRender = (ds: DataSource) => {
    return <>
      <CalciteTabTitle>
        <CalciteLabel>
          {ds.getLabel()}
        </CalciteLabel>
      </CalciteTabTitle>
    </>
  }

  if (!isDsConfigured()) {
    return <h3>
      This widget aloows you to edit related tables in a feature layer
      <br />
      Configure the data source.
    </h3>
  } else {
    return <div className="widget-use-feature-layer" style={{ width: '100%', height: '100%' }}>
      <CalciteTabs >
        <CalciteTabNav slot="title-group">
          {props.useDataSources.map(ds => (
            <DataSourceComponent useDataSource={ds} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.id} queryCount>
              {headerRender}
            </DataSourceComponent>)
          )}
        </CalciteTabNav>
        {props.useDataSources.map(ds => (
          <DataSourceComponent useDataSource={ds} query={{ where: '1=1' } as FeatureLayerQueryParams} widgetId={props.id} queryCount>
            {tabRender}
          </DataSourceComponent>)
        )}
      </CalciteTabs>
    </div >
  }
}

