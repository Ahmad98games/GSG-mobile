import { tcpService } from './TCPClientService';
import { useBranchStore } from '../store/BranchStore';
import { getSafeStorage } from '../utils/storage';
import * as SecureStore from 'expo-secure-store';

/**
 * BRANCH SERVICE
 * Handles branch switching and list management via NSP.
 */
export class BranchService {
  /**
   * Fetches the list of branches authorized for this node/user.
   */
  public static async fetchBranches() {
    const nodeId = await getSafeStorage('gs_node_id');
    const response = await tcpService.request({
      nsp: {
        branch_list_req: {
          node_id: nodeId
        }
      }
    });

    if (response?.nsp?.branch_list_res) {
      useBranchStore.getState().setBranches(response.nsp.branch_list_res.branches);
      return response.nsp.branch_list_res.branches;
    }
    throw new Error('BRANCH_FETCH_FAILED');
  }

  /**
   * Performs a branch context switch.
   * On success, updates the local JWT/Session for scoped data isolation.
   */
  public static async switchBranch(branchId: string, pin: string) {
    const nodeId = await getSafeStorage('gs_node_id');
    const response = await tcpService.request({
      nsp: {
        switch_branch_req: {
          node_id: nodeId,
          target_branch_id: branchId,
          escalation_pin: pin
        }
      }
    });

    if (response?.nsp?.switch_branch_res?.success) {
      const { new_jwt } = response.nsp.switch_branch_res;
      if (new_jwt) {
        await SecureStore.setItemAsync('omnora_session_token', new_jwt);
      }
      useBranchStore.getState().setCurrentBranch(branchId);
      
      // CRITICAL: Purge ALL branch-scoped stores to prevent cross-branch data leakage
      const { useFinanceStore } = require('../store/FinanceStore');
      useFinanceStore.getState().clearCache();

      const { useProductStore } = require('../store/useProductStore');
      useProductStore.getState().resetSession();

      const { useMessageStore } = require('../store/MessageStore');
      useMessageStore.getState().setConversations([]);
      useMessageStore.setState({ messages: {} });

      const { useAlertStore } = require('../store/AlertStore');
      useAlertStore.setState({ activeBreaches: [] });

      const { useBridgeStatus } = require('../store/BridgeStatusStore');
      useBridgeStatus.getState().setConnectedNodeCount(0);

      return response.nsp.switch_branch_res;
    }
    throw new Error('BRANCH_SWITCH_FAILED');
  }
}
