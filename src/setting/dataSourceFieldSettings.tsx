import { React } from 'jimu-core'
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components'
import { AdvancedSelect, AdvancedSelectItem, Switch } from 'jimu-ui'
import { ChangeEvent } from 'react'
import { GeometryType } from '@esri/arcgis-rest-types'
import Field from 'esri/layers/support/Field'
import { DSProp } from '../types'

interface Props {
  // fetchProp: (prop: string, id: string) => string
  dsProp: DSProp
  dsPropChange: (sourceId: string, prop: string, value: any) => void
  onFieldChange: (fields: Array<string | number>, sourceId: string) => void
  source: string
  geometryType: GeometryType
  fieldSchema: Field[]
  selectedSchema: Field[]
  parentSource: () => string
  parentDisplay: () => boolean
}
export default function DataSourceFields ({ parentSource, parentDisplay, source, geometryType, fieldSchema, selectedSchema, dsProp, dsPropChange, onFieldChange }: Props) {
  const idTypes = ['oid', 'global-id', 'guid']
  const [fieldSelectOpen, setFieldSelectOpen] = React.useState<boolean>(false)
  /**
   * These only exist becasue it allows me to update my selects. need a better solution
   */
  const makeAdvancedSelectItems = (schema: Field[]) => {
    return schema.map(s => {
      const select = {} as AdvancedSelectItem
      select.label = s.alias
      select.value = s.name
      return select
    }) as unknown as AdvancedSelectItem[]
  }

  const fetchProp = (prop: string): string => {
    if (Object.prototype.hasOwnProperty.call(dsProp, prop)) {
      return dsProp[prop] || null
    }
    return null
  }
  const selectableValues = makeAdvancedSelectItems(fieldSchema.filter(s => !idTypes.includes(s.type)))
  const selectedValues = makeAdvancedSelectItems(selectedSchema)
  const idValues = makeAdvancedSelectItems(fieldSchema.filter(s => idTypes.includes(s.type)))
  const foreignKeySelect = idValues.filter(v => v.value === fetchProp('foreignKey'))
  const headerSelect = selectableValues.filter(v => v.value === fetchProp('header'))
  const subHeaderSelect = selectableValues.filter(v => v.value === fetchProp('subHeader'))

  const [joinSelectOpen, setJoinSelectOpen] = React.useState<boolean>(false)
  const [headSelectOpen, setHeadSelectOpen] = React.useState<boolean>(false)
  const [subHeadSelectOpen, setSubHeadSelectOpen] = React.useState<boolean>(false)

  const fetchNewFeaturesToggle = (): boolean => {
    if (Object.prototype.hasOwnProperty.call(dsProp, 'newFeatures')) {
      return !!dsProp.newFeatures
    }
    return false
  }
  const joinChange = (event: AdvancedSelectItem[]) => {
    const value = event ? event[0].value : null
    dsPropChange(source, 'foreignKey', value)
  }

  const headChange = (event: AdvancedSelectItem[]) => {
    const value = event ? event[0].value : null
    dsPropChange(source, 'header', value)
  }
  const subHeadChange = (event: AdvancedSelectItem[]) => {
    const value = event ? event[0].value : null
    dsPropChange(source, 'subHeader', value)
  }

  const toggleChange = (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    dsPropChange(source, 'newFeatures', checked)
  }

  const selectChange = (event: AdvancedSelectItem[]) => {
    const selected = event.map(item => item.value)
    onFieldChange(selected, source)
  }
  if (parentSource() !== source || (parentSource() === source && parentDisplay())) {
    return <>
      <SettingSection title="Join field">
        <SettingRow>
          <AdvancedSelect
            fluid
            strategy={'fixed'}
            selectedValues={foreignKeySelect}
            staticValues={idValues}
            onChange={joinChange}
            isOpen={joinSelectOpen}
            toggle={(isOpen) => setJoinSelectOpen(isOpen)}
          />
        </SettingRow>
      </SettingSection>
      <SettingSection title="Select Fields">
        <SettingRow>
          <AdvancedSelect
            fluid
            strategy={'fixed'}
            isMultiple
            staticValues={selectableValues}
            selectedValues={selectedValues}
            onChange={selectChange}
            isOpen={fieldSelectOpen}
            toggle={(isOpen) => setFieldSelectOpen(isOpen)}
          />
        </SettingRow>
      </SettingSection>

      <SettingSection title="List Labels">
        <SettingRow label="Header" flow='wrap'>
          <AdvancedSelect
            fluid
            strategy={'fixed'}
            staticValues={selectableValues}
            selectedValues={headerSelect}
            onChange={headChange}
            isOpen={headSelectOpen}
            toggle={(isOpen) => setHeadSelectOpen(isOpen)}
          />
        </SettingRow>
        <SettingRow label="SubHeader (optional)" flow='wrap'>
          <AdvancedSelect
            fluid
            strategy={'fixed'}
            staticValues={selectableValues}
            selectedValues={subHeaderSelect}
            onChange={subHeadChange}
            isOpen={subHeadSelectOpen}
            toggle={(isOpen) => setSubHeadSelectOpen(isOpen)}
          />
        </SettingRow>
      </SettingSection>
      {!geometryType &&
        <SettingSection>
          <div className='w-100 table-options' >
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} className='table-options-item'>
              <span className='setting-text-level-1' style={{ width: '80%' }}>
                Create New Records?
              </span>
              <Switch
                className='can-x-switch'
                id="newFeatures"
                checked={fetchNewFeaturesToggle()}
                onChange={toggleChange}
              />
            </div>
          </div>
        </SettingSection>}
    </>
  } else {
    return <SettingSection title="Join field">
      <SettingRow>
        <AdvancedSelect
          fluid
          strategy={'fixed'}
          selectedValues={foreignKeySelect}
          staticValues={idValues}
          onChange={joinChange}
          isOpen={joinSelectOpen}
          toggle={(isOpen) => setJoinSelectOpen(isOpen)}
        />
      </SettingRow>
    </SettingSection>
  }
}
