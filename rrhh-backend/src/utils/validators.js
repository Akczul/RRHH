/**
 * Valida que un valor sea un string no vacío.
 * @param {*} value - Valor a validar.
 * @param {string} fieldName - Nombre del campo (para el mensaje de error).
 * @returns {{ valid: boolean, message?: string }}
 */
function validateRequiredString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return {
      valid: false,
      message: `El campo "${fieldName}" es obligatorio y no puede estar vacío`,
    };
  }
  return { valid: true };
}

/**
 * Valida múltiples campos de tipo string requeridos.
 * @param {Array<{ value: *, name: string }>} fields
 * @returns {{ valid: boolean, message?: string }}
 */
function validateRequiredStrings(fields) {
  for (const field of fields) {
    const result = validateRequiredString(field.value, field.name);
    if (!result.valid) return result;
  }
  return { valid: true };
}

/**
 * Alias semántico para validar que un título no esté vacío.
 * Internamente delega en validateRequiredString.
 * @param {*} title
 * @returns {{ valid: boolean, message?: string }}
 */
function validateNonEmptyTitle(title) {
  return validateRequiredString(title, "titulo");
}

module.exports = {
  validateRequiredString,
  validateRequiredStrings,
  validateNonEmptyTitle,
};