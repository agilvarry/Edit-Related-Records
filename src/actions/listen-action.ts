import { AbstractMessageAction, MessageType, Message, getAppStore, appActions, DataRecordsSelectionChangeMessage, MessageDescription } from 'jimu-core'

export default class QueryAction extends AbstractMessageAction {
  filterMessageDescription (messageDescription: MessageDescription): boolean {
    console.log(messageDescription)
    return [MessageType.DataRecordsSelectionChange].includes(messageDescription.messageType)
  }

  filterMessage (_message: Message): boolean {
    return true
  }

  //set action setting uri
  getSettingComponentUri (_messageType: MessageType, _messageWidgetId?: string): string {
    return null
  }

  onExecute (message: Message, _actionConfig?: any): Promise<boolean> | boolean {
    if (message.type === MessageType.DataRecordsSelectionChange) {
      const selectionMessage = message as DataRecordsSelectionChangeMessage
      const record = selectionMessage.records[0] || null
      const dsId = record ? record.dataSource.id.includes('selection') ? record.dataSource.belongToDataSource.id : record.dataSource.id : null
      const selection = record ? { data: record.getData() || null, sourceId: dsId } : null
      getAppStore().dispatch(appActions.widgetStatePropChange(this.widgetId, 'selection', selection))
    }
    return true
  }
}
