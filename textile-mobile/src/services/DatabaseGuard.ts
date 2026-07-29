import { useBridgeStatusStore } from '../stores/BridgeStatusStore'

export class DatabaseGuardService {
  /**
   * Evaluates whether the current active role is allowed to query the target table.
   * Checks `blockedTables` first, then `allowedTables`.
   */
  public canQueryTable(tableName: string): boolean {
    const store = useBridgeStatusStore.getState()
    const role = (store.user?.role || store.hubAckPayload?.role || 'owner').toLowerCase()

    const blockedTables = store.blockedTables || []
    const allowedTables = store.allowedTables || []

    // Explicit block list takes highest precedence
    if (blockedTables.includes(tableName)) {
      console.warn(`[DatabaseGuard] SECURITY ACCESS DENIED: Table '${tableName}' is explicitly blocked for role '${role}'`)
      return false
    }

    // Role-based hardcoded security fallback rules if allowedTables not set
    if (role === 'supervisor') {
      if (tableName === 'ledger_entries' || tableName === 'profit_statements' || tableName === 'suppliers') {
        console.warn(`[DatabaseGuard] SECURITY ACCESS DENIED: Supervisor role cannot query '${tableName}'`)
        return false
      }
      if (tableName === 'peshgi_transactions' || tableName === 'karigar_logs' || tableName === 'piece_wages' || tableName === 'parties' || tableName === 'workers') {
        return true
      }
    }

    if (role === 'cashier') {
      if (tableName === 'ledger_entries' || tableName === 'suppliers' || tableName === 'profit_statements' || tableName === 'peshgi_transactions') {
        console.warn(`[DatabaseGuard] SECURITY ACCESS DENIED: Cashier role cannot query '${tableName}'`)
        return false
      }
      if (tableName === 'pos_orders' || tableName === 'customer_clearances' || tableName === 'customers' || tableName === 'counter_billing') {
        return true
      }
    }

    // If allowedTables list is populated, check membership
    if (allowedTables.length > 0) {
      const isAllowed = allowedTables.includes(tableName)
      if (!isAllowed) {
        console.warn(`[DatabaseGuard] ACCESS DENIED: Table '${tableName}' is not in allowedTables whitelist for role '${role}'`)
      }
      return isAllowed
    }

    // Default: Owner/Manager/Accountant with no restrictions
    return true
  }

  /**
   * Wraps a database query function. If table access is denied, blocks execution and returns an empty array.
   */
  public async guardQuery<T>(tableName: string, queryFn: () => Promise<T[]>): Promise<T[]> {
    if (!this.canQueryTable(tableName)) {
      console.warn(`[DatabaseGuard] Execution aborted for guarded query on table '${tableName}'`)
      return []
    }
    return queryFn()
  }
}

export const DatabaseGuard = new DatabaseGuardService()
