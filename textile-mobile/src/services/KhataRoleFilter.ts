export interface KhataRolePermissions {
  canViewPartyLedger: boolean
  canViewSupplierLedger: boolean
  canViewDailyPnL: boolean
  canViewKarigarPeshgi: boolean
  canViewProductionLogs: boolean
  canViewWorkerPieceWages: boolean
  canViewPosCounterBilling: boolean
  canViewCustomerCreditClearance: boolean
}

export function getKhataPermissions(role: string): KhataRolePermissions {
  const normalizedRole = (role || 'owner').toUpperCase()

  switch (normalizedRole) {
    case 'SUPERVISOR':
      return {
        canViewPartyLedger: false, // Completely blocked from party financial ledgers (ledger_entries)
        canViewSupplierLedger: false,
        canViewDailyPnL: false,
        canViewKarigarPeshgi: true, // Only Karigar Peshgi (Advance) transactions
        canViewProductionLogs: true,
        canViewWorkerPieceWages: true,
        canViewPosCounterBilling: false,
        canViewCustomerCreditClearance: false,
      }

    case 'CASHIER':
      return {
        canViewPartyLedger: false,
        canViewSupplierLedger: false, // Hidden
        canViewDailyPnL: false, // Hidden
        canViewKarigarPeshgi: false,
        canViewProductionLogs: false,
        canViewWorkerPieceWages: false,
        canViewPosCounterBilling: true, // POS counter billing only
        canViewCustomerCreditClearance: true, // Customer credit clearance only
      }

    case 'OWNER':
    case 'MANAGER':
    case 'ACCOUNTANT':
    default:
      return {
        canViewPartyLedger: true, // Full party ledger (Debit/Credit)
        canViewSupplierLedger: true, // Supplier balances
        canViewDailyPnL: true, // Daily P&L
        canViewKarigarPeshgi: true,
        canViewProductionLogs: true,
        canViewWorkerPieceWages: true,
        canViewPosCounterBilling: true,
        canViewCustomerCreditClearance: true,
      }
  }
}
