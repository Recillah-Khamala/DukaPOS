import { shouldApplyExcessPaymentToPriorDebt } from '../utils/creditEntryHelpers';

describe('shouldApplyExcessPaymentToPriorDebt', () => {
  it('does not apply excess payment for legacy debts', () => {
    expect(shouldApplyExcessPaymentToPriorDebt(true, 250)).toBe(false);
  });

  it('applies excess payment for regular credit sales when overpaid', () => {
    expect(shouldApplyExcessPaymentToPriorDebt(false, 250)).toBe(true);
  });

  it('does not apply excess payment when there is no excess', () => {
    expect(shouldApplyExcessPaymentToPriorDebt(false, 0)).toBe(false);
  });
});
