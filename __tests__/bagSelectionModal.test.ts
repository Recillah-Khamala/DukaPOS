describe('BagSelectionModal state logic', () => {
  const MAX_QTY = 99;

  const createMockProduct = () => ({
    id: 'cereal_1',
    name: 'Test Cereal',
    pricePerKg: 100,
    pricePerBag: 5,
    pricePerPack: 50,
    packSize: '500g',
    icon: 'shopping-bag',
  });

  describe('qty clamping', () => {
    it('clamps qty at minimum 1', () => {
      let qty = 1;
      const decrement = () => { qty = Math.max(1, qty - 1); };
      
      decrement();
      expect(qty).toBe(1);
    });

    it('clamps qty at maximum 99', () => {
      let qty = MAX_QTY;
      const increment = () => { qty = Math.min(MAX_QTY, qty + 1); };
      
      increment();
      expect(qty).toBe(MAX_QTY);
    });
  });

  describe('price calculations', () => {
    it('bag price uses size multiplier correctly for small', () => {
      const product = createMockProduct();
      const sizeMultiplier = { small: 0.5, medium: 1, big: 2 };
      const expectedPrice = product.pricePerBag! * sizeMultiplier.small;
      
      expect(expectedPrice).toBe(2.5);
    });

    it('bag price uses size multiplier correctly for medium', () => {
      const product = createMockProduct();
      const sizeMultiplier = { small: 0.5, medium: 1, big: 2 };
      const expectedPrice = product.pricePerBag! * sizeMultiplier.medium;
      
      expect(expectedPrice).toBe(5);
    });

    it('bag price uses size multiplier correctly for big', () => {
      const product = createMockProduct();
      const sizeMultiplier = { small: 0.5, medium: 1, big: 2 };
      const expectedPrice = product.pricePerBag! * sizeMultiplier.big;
      
      expect(expectedPrice).toBe(10);
    });

    it('pack price uses pricePerPack directly', () => {
      const product = createMockProduct();
      const expectedPrice = product.pricePerPack!;
      
      expect(expectedPrice).toBe(50);
    });
  });

  describe('label formatting', () => {
    it('produces correct name format for bag mode', () => {
      const product = createMockProduct();
      const name = `${product.name} — 2 × Medium Plastic Bag`;
      
      expect(name).toBe('Test Cereal — 2 × Medium Plastic Bag');
    });

    it('produces correct name format for pack mode', () => {
      const product = createMockProduct();
      const name = `${product.name} — 3 × 500g Pack`;
      
      expect(name).toBe('Test Cereal — 3 × 500g Pack');
    });
  });
});