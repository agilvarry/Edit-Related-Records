import { AbstractMessageAction, MessageType, Message, getAppStore, appActions, DataRecordsSelectionChangeMessage, MessageDescription } from 'jimu-core'

export default class QueryAction extends AbstractMessageAction {
  filterMessageDescription (messageDescription: MessageDescription): boolean {
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
    if (message.type === MessageType.DataRecordsSelectionChange) {
      const record = (message as DataRecordsSelectionChangeMessage).records[0] || null
      getAppStore().dispatch(appActions.widgetStatePropChange(this.widgetId, 'selectionId', record.getData().globalid || null))
    }
    return true
  }
}
