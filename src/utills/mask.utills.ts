export const maskValue = (value: string | null): string | null => {
  if (!value) return null; // student_number boleh kosong
  if (value.length <= 4) return '****';
  return value.slice(0, 2) + '*'.repeat(value.length - 4) + value.slice(-2);
};