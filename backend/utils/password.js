const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required.' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (!hasUpper || !hasLower || !hasNumber || !hasSymbol) {
    return {
      isValid: false,
      message: 'Password should include uppercase, lowercase, a number, and a symbol.',
    };
  }

  return { isValid: true, message: 'Password looks strong.' };
};

module.exports = { validatePassword };
