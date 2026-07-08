} else {
       builtItems = items.map(item => {
         let productId = item.productId;
         // Guard against deleted inventory item
         if (productId && !allItems.some(it => it.id === productId)) {
           console.warn(`Product ID ${productId} not found in inventory. Removing product reference.`);
           productId = undefined;
         }
         const t = itemTotal(item);
         return {
           name: item.name.trim(),
           qty: parseFloat(item.qty),
           unitPrice: parseFloat(item.unitPrice),
           total: t,
           category: item.category,
           amountPaid: 0,
           balance: t,
           productId,
           unit: item.unit,
         };
       });