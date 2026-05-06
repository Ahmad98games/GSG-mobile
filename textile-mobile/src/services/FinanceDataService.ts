import { tcpService } from './TCPClientService';
import { useFinanceStore } from '../store/FinanceStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * OMNORA FINANCIAL DATA SERVICE
 * High-speed financial query engine over NSP/TCP.
 * Bypasses direct DB calls for industrial security.
 */
export class FinanceDataService {
  /**
   * Helper to get nodeId for requests
   */
  private static async getMetaData() {
    const nodeId = await AsyncStorage.getItem('gs_node_id');
    return { nodeId };
  }

  /**
   * Fetches the double-entry ledger summary.
   */
  public static async fetchLedger(limit: number = 50) {
    const { nodeId } = await this.getMetaData();
    
    const response = await tcpService.request({
      nsp: {
        ledger_summary_req: {
          node_id: nodeId,
          limit
        }
      }
    });

    if (response?.nsp?.ledger_summary_res) {
      useFinanceStore.getState().setLedgerEntries(response.nsp.ledger_summary_res.entries);
      return response.nsp.ledger_summary_res;
    }
    throw new Error('LEDGER_FETCH_FAILED');
  }

  /**
   * Fetches party balances (customers/suppliers).
   */
  public static async fetchParties(type: 'customer' | 'supplier' | 'both' = 'both') {
    const { nodeId } = await this.getMetaData();

    const response = await tcpService.request({
      nsp: {
        party_balance_req: {
          node_id: nodeId,
          party_type: type
        }
      }
    });

    if (response?.nsp?.party_balance_res) {
      useFinanceStore.getState().setPartyBalances(response.nsp.party_balance_res.parties);
      return response.nsp.party_balance_res;
    }
    throw new Error('PARTY_FETCH_FAILED');
  }

  /**
   * Fetches invoice summary.
   */
  public static async fetchInvoices() {
    const { nodeId } = await this.getMetaData();

    const response = await tcpService.request({
      nsp: {
        invoice_summary_req: {
          node_id: nodeId
        }
      }
    });

    if (response?.nsp?.invoice_summary_res) {
      useFinanceStore.getState().setInvoices(response.nsp.invoice_summary_res.invoices);
      return response.nsp.invoice_summary_res;
    }
    throw new Error('INVOICE_FETCH_FAILED');
  }

  /**
   * Fetches a specific pay slip.
   */
  public static async fetchPaySlip(karigarId: string, periodId: string) {
    const { nodeId } = await this.getMetaData();

    const response = await tcpService.request({
      nsp: {
        pay_slip_req: {
          node_id: nodeId,
          karigar_id: karigarId,
          period_id: periodId
        }
      }
    });

    return response?.nsp?.pay_slip_res || null;
  }
}
