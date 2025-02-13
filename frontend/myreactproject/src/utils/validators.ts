import zxcvbn from 'zxcvbn';

export const validatePasswordStrength = (password: string) => {
  const result = zxcvbn(password);
  return result.score >= 3; // Оцінка складності від 0 до 4
};