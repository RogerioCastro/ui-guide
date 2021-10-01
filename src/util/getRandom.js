/**
 * Retorna um número randômico entre min e max (inclusivo), com no máximo duas casas decimais
 * via: https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
 *
 * @param {Number} min
 * @param {Number} max
 * @return Número randômico
 */
export default function getRandom (min, max) {
  const num = Math.random() * (max - min) + min
  return Math.round((num + Number.EPSILON) * 100) / 100
}
