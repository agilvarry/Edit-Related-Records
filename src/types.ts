export interface DSProp {
  foreignKey: string
  header: string
  subHeader: string
  newFeatures: boolean
  label: string
}

export interface DSProps {
  [key: string]: DSProp
}

export interface Config {
  dsProps: DSProps
  header: string
  subHeader: string
  newFeatures: boolean
  parentDataSource: string
  displayParent: boolean
}
