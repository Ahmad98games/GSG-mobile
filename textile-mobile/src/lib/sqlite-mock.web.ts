/**
 * NOXIS INDUSTRIAL OS - SQLITE MOCK FOR WEB
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 */

export function openDatabaseSync(name: string) {
  return createDatabaseMock();
}

export function openDatabaseAsync(name: string) {
  return Promise.resolve(createDatabaseMock());
}

function createDatabaseMock() {
  return {
    execAsync: async (sql: string) => {
      return [];
    },
    runAsync: async (sql: string, args: any[]) => {
      return { lastInsertRowId: 1, changes: 1 };
    },
    getAllAsync: async (sql: string, args: any[]) => {
      return [];
    },
    getFirstAsync: async (sql: string, args: any[]) => {
      if (sql.includes('COUNT(*)')) {
        return { count: 0 };
      }
      return null;
    },
    closeAsync: async () => {},
  };
}
