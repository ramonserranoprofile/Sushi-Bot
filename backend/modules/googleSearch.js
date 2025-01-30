import axios from 'axios'


async function searchOnGoogle(query) {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;

    try {
        const response = await axios.get(url);
        const results = response.data.items.map(item => item.snippet).join('\n');
        return results;
    } catch (error) {
        console.error('Error en la búsqueda:', error.message);
        return 'No se pudieron obtener resultados.';
    }
}
export default searchOnGoogle;