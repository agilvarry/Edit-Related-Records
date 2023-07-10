export interface DSProp {
  foreignKey: string
  header: string
  subHeader: string
  newFeatures: boolean
  deleteFeatures: boolean
  label: string
}

export interface DSProps {
  [id: string]: DSProp
}

export interface Config {
  dsProps: DSProps
  header: string
  subHeader: string
  parentDataSource: string
  displayParent: boolean
}

export interface Selection {
  selectionId: string
  sourceId: string
}
