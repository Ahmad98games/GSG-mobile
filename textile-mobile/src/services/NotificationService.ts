import notifee, {
  AndroidImportance,
  AndroidVisibility,
  TriggerType,
  RepeatFrequency,
} from '@notifee/react-native'

export const CHANNELS = {
  GENERAL: 'noxis_general',
  LOW_STOCK: 'noxis_low_stock',
  PAYMENT_DUE: 'noxis_payment_due',
  PRODUCTION: 'noxis_production',
  AUDIT: 'noxis_audit',
  FORESIGHT: 'noxis_foresight',
}

export async function createAllChannels():
  Promise<void> {
  await Promise.all([
    notifee.createChannel({
      id: CHANNELS.GENERAL,
      name: 'General',
      importance: AndroidImportance.DEFAULT,
    }),
    notifee.createChannel({
      id: CHANNELS.LOW_STOCK,
      name: 'Low Stock Alerts',
      importance: AndroidImportance.HIGH,
      vibration: true,
    }),
    notifee.createChannel({
      id: CHANNELS.PAYMENT_DUE,
      name: 'Payment Reminders',
      importance: AndroidImportance.HIGH,
      vibration: true,
    }),
    notifee.createChannel({
      id: CHANNELS.PRODUCTION,
      name: 'Production Updates',
      importance: AndroidImportance.DEFAULT,
    }),
    notifee.createChannel({
      id: CHANNELS.AUDIT,
      name: 'Security Alerts',
      importance: AndroidImportance.HIGH,
      vibration: true,
    }),
    notifee.createChannel({
      id: CHANNELS.FORESIGHT,
      name: 'Noxis Foresight',
      importance: AndroidImportance.HIGH,
      vibration: true,
      lights: true,
      lightColor: '#60A5FA',
    }),
  ])
}

export async function notifyLowStock(params: {
  itemName: string
  currentQty: number
  unit: string
  daysUntilStockout: number
}): Promise<void> {
  await notifee.displayNotification({
    title: `⚠ Low Stock: ${params.itemName}`,
    body: `Only ${params.currentQty} ${params.unit} remaining. Estimated stockout in ${params.daysUntilStockout} days.`,
    android: {
      channelId: CHANNELS.LOW_STOCK,
      smallIcon: 'ic_notification',
      color: '#F59E0B',
      pressAction: {
        id: 'open_inventory',
        launchActivity: 'default',
      },
      actions: [
        {
          title: 'View Inventory',
          pressAction: {
            id: 'open_inventory',
            launchActivity: 'default',
          },
        },
      ],
    },
  })
}

export async function notifyPaymentOverdue(params: {
  partyName: string
  amount: number
  currency: string
  daysOverdue: number
}): Promise<void> {
  const fmt = (n: number) =>
    `${params.currency} ${n.toLocaleString('en-PK')}`

  await notifee.displayNotification({
    title: `💰 Payment Overdue: ${params.partyName}`,
    body: `${fmt(params.amount)} is ${params.daysOverdue} day${params.daysOverdue > 1 ? 's' : ''} overdue. Send a reminder now.`,
    android: {
      channelId: CHANNELS.PAYMENT_DUE,
      smallIcon: 'ic_notification',
      color: '#EF4444',
      actions: [
        {
          title: 'Send Reminder',
          pressAction: {
            id: 'send_reminder',
            launchActivity: 'default',
          },
        },
      ],
    },
  })
}

export async function notifyForesight(params: {
  title: string
  detail: string
  impact: string
}): Promise<void> {
  await notifee.displayNotification({
    title: `🧠 Foresight: ${params.title}`,
    body: params.detail.slice(0, 100) + '...',
    android: {
      channelId: CHANNELS.FORESIGHT,
      smallIcon: 'ic_notification',
      color: params.impact === 'critical'
        ? '#EF4444'
        : '#60A5FA',
      pressAction: {
        id: 'open_foresight',
        launchActivity: 'default',
      },
    },
  })
}

export async function scheduleAttendanceReminder(
  hour: number = 9,
  minute: number = 0
): Promise<void> {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(hour, minute, 0, 0)

  await notifee.createTriggerNotification(
    {
      title: '✓ Mark Attendance',
      body: 'Don\'t forget to mark attendance for today.',
      android: {
        channelId: CHANNELS.PRODUCTION,
        smallIcon: 'ic_notification',
        pressAction: {
          id: 'open_attendance',
          launchActivity: 'default',
        },
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: tomorrow.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    }
  )
}

export async function cancelAllScheduled():
  Promise<void> {
  const scheduled =
    await notifee.getTriggerNotifications()
  await Promise.all(
    scheduled.map(n =>
      notifee.cancelTriggerNotification(
        n.notification.id!
      )
    )
  )
}
