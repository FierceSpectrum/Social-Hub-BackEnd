function formatDate() {
  const now = new Date();

  // Obtén el año, mes y día
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses en JS van de 0 (enero) a 11 (diciembre)
  const day = String(now.getDate()).padStart(2, '0');

  // Obtén la hora y los minutos
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  // Devuelve la fecha en formato YYYY-MM-DDTHH:MM
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

module.exports = {
  formatDate,
};