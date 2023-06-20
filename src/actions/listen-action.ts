import { AbstractMessageAction, MessageType, Message, getAppStore, appActions, DataRecordsSelectionChangeMessage, MessageDescription } from 'jimu-core'

export default class QueryAction extends AbstractMessageAction {
  filterMessageDescription (messageDescription: MessageDescription): boolean {
    console.log(messageDescription)
    return [MessageType.DataRecordsSelectionChange].includes(messageDescription.messageType)
  }

  filterMessage (message: Message): boolean {
    return true
  }

  //set action setting uri
  getSettingComponentUri (messageType: MessageType, messageWidgetId?: string): string {
    return null
  }

  onExecute (message: Message, actionConfig?: any): Promise<boolean> | boolean {
    console.log(message)
    if (message.type === MessageType.DataRecordsSelectionChange) {
      const selectionMessage = message as DataRecordsSelectionChangeMessage
      const record = selectionMessage.records[0] || null
      const dsId = record ? record.dataSource.id.includes('selection') ? record.dataSource.belongToDataSource.id : record.dataSource.id : null
      const selection = record ? { selectionId: record.getData().globalid || null, sourceId: dsId } : null
      getAppStore().dispatch(appActions.widgetStatePropChange(this.widgetId, 'selection', selection))
    }
    return true
  }
}
