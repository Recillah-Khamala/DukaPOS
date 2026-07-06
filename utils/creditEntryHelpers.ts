import type { CreditItemCategory } from '../hooks/useCreditLedger';

// FormField props
interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  containerStyle?: object;
  inputStyle?: object;
}

// CategoryPicker props
interface CategoryPickerProps {
  selected: CreditItemCategory;
  onSelect: (category: CreditItemCategory) => void;
}

// ItemEntryCard props
interface DraftItem {
  key: string;
  name: string;
  qty: string;
  unitPrice: string;
  category: CreditItemCategory;
}

interface ItemEntryCardProps {
  item: DraftItem;
  index: number;
  onUpdate: (key: string, patch: Partial<DraftItem>) => void;
  onRemove: (key: string) => void;
  canRemove: boolean;
}

// LegacyDebtForm props
interface LegacyDebtFormProps {
  description: string;
  onDescriptionChange: (text: string) => void;
  category: CreditItemCategory;
  onCategoryChange: (category: CreditItemCategory) => void;
  total: string;
  onTotalChange: (text: string) => void;
  alreadyPaid: string;
  onAlreadyPaidChange: (text: string) => void;
  day: string;
  onDayChange: (text: string) => void;
  month: string;
  onMonthChange: (text: string) => void;
  year: string;
  onYearChange: (text: string) => void;
}

// Parses day, month, year strings into an ISO date string.
export const parseManualDate = (day: string, month: string, year: string): string => {
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toISOString();
};