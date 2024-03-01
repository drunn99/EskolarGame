/**
 * 
 * @param {never} _value
 * Función que controla errores en tiempo de ejecuciones y controla switch statements 
 */

export function exhaustiveGuard(_value) {
    throw new Error(`Error, Se alcanzó la función de guardia con el valor inesperado ${JSON.stringify(_value)}`);
}