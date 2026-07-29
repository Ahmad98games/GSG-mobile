import { useBridgeStatusStore } from '../stores/BridgeStatusStore';
import { formatCurrency } from '../lib/currency/formatCurrency';

export function useIndustryConfig() {
  const {
    industry,
    workerTerm,
    workerTermPlural,
    advanceTerm,
    itemTerm,
    currency,
  } = useBridgeStatusStore();

  const isMedical = industry === 'medical';

  const config = {
    industry: industry || 'textile',
    currency: currency || 'PKR',
    workers: workerTermPlural || (isMedical ? 'Staff' : 'Karigars'),
    worker: workerTerm || (isMedical ? 'Staff Member' : 'Karigar'),
    advance: advanceTerm || (isMedical ? 'Advance' : 'Peshgi'),
    production: isMedical ? 'Dispensing' : 'Production',
    productionUnit: isMedical ? 'doses' : (itemTerm || 'pcs'),
    stock: isMedical ? 'Medicines' : 'Stock',
    qualityGrade: isMedical ? 'Grade' : 'Quality Grade',
    item: itemTerm || (isMedical ? 'Medicine' : 'Item'),
  };

  return {
    ...config,
    t: config,
    features: {
      peshgiAdvances: true,
      pieceRateWages: true,
    },
    fmt: (amount: number | string) => formatCurrency(amount, currency || 'PKR'),
  };
}
