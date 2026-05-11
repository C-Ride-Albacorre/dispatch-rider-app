export const getPasswordStrength = (password: string) => {
  if (password.length < 6) {
    return {
      label: 'Weak',
      color: '#ef4444',
    };
  }

  const hasUppercase = /[A-Z]/.test(password);

  const hasNumber = /[0-9]/.test(password);

  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (hasUppercase && hasNumber && hasSpecial) {
    return {
      label: 'Strong',
      color: '#22c55e',
    };
  }

  return {
    label: 'Medium',
    color: '#f59e0b',
  };
};
