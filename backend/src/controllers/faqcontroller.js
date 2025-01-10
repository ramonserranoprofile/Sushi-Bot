import Faq from '../models/Faq.js';

// function to get all faqs
const getFaqs = async (req, res) => {
    try {
        const faqs = await Faq.find();
        res.json(faqs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Function to get FAQ by question and replace variables dynamically
const getFaqByQuestion = async (req, res) => {
    const { question } = req.params; // Obtener solo la pregunta de los parámetros

    if (!question || question.length <= 3) {
        return res.status(400).json({ message: 'El parámetro "question" es obligatorio.' });
    }

    try {
        const sanitizedQuestion = question.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Separar las palabras del item.name en un array y filtrar palabras cortas (menos de 4 letras)
        const item = { name: question.replace(/[?¡!¿,.:´`^~]/g, ' ') };
        console.log('ITEMS:', item.name);
        const words = item.name
            .split(' ')
            .filter(word => word.trim().length >= 4); // Filtrar palabras de al menos 4 letras

        // Construir la consulta MongoDB con coincidencia aproximada
        const faq = await Faq.findOne({
            $or: words.map(word => ({
                question: {
                    $regex: new RegExp(`${word}`, 'i'), // Coincidencia aproximada (dentro de cualquier contexto)
                },
            })),
        });

        if (!faq) {
            return res.status(404).json({ message: 'Pregunta no encontrada.' });
        }

        // Variables dinámicas
        const hora_actual = new Date()
            .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
            .replace(/\./g, '')
            .replace(/([AP])\s(M)/i, '$1$2')
            .toUpperCase();

        const dia_semana = new Date().toLocaleDateString('es-ES', { weekday: 'long' });

        // Según el horario de trabajo de la semana, extrae las horas de apertura y cierre
        const hora_apertura_semana = "12:00 PM";
        const hora_cierre_semana = "10:00 PM";
        const hora_apertura_sabado = "01:00 PM";
        const hora_cierre_sabado = "11:00 PM";
        const hora_apertura_domingo = "Cerrados";
        const hora_cierre_domingo = "Cerrados";

        // Determina las horas de apertura y cierre según el día de la semana
        const hora_apertura =
            dia_semana === "sábado"
                ? hora_apertura_sabado
                : dia_semana === "domingo"
                    ? hora_apertura_domingo
                    : hora_apertura_semana;

        const hora_cierre =
            dia_semana === "sábado"
                ? hora_cierre_sabado
                : dia_semana === "domingo"
                    ? hora_cierre_domingo
                    : hora_cierre_semana;

        // Función para convertir hora en formato 12 horas a minutos desde medianoche
        function convertirHora(hora12) {
            if (hora12 === "Cerrados") return null; // Si está cerrado todo el día, no tiene sentido convertir la hora
            const [hora, minuto] = hora12.match(/\d{1,2}/g);
            const ampm = hora12.slice(-2);
            let hora24 = parseInt(hora, 10);
            if (ampm === "PM" && hora24 !== 12) hora24 += 12;
            if (ampm === "AM" && hora24 === 12) hora24 = 0;
            return hora24 * 60 + parseInt(minuto, 10); // Convertir a minutos desde medianoche
        }

        // Convertir horas a minutos desde medianoche
        const hora_apertura_24 = convertirHora(hora_apertura);
        const hora_cierre_24 = convertirHora(hora_cierre);
        const hora_actual_24 = convertirHora(hora_actual);

        // Determinar estado abierto o cerrado
        let on_off = "cerrados"; // Por defecto el establecimiento está cerrado

        if (hora_apertura_24 !== null && hora_cierre_24 !== null) {
            if (hora_actual_24 >= hora_apertura_24 && hora_actual_24 <= hora_cierre_24) {
                on_off = "abiertos"; // La hora actual está dentro del horario de apertura y cierre
            }
        }

        // Sustituir variables en la respuesta
        const respuesta = faq.answer
            .replace('${hora_actual}', hora_actual)
            .replace('${on_off}', on_off)
            .replace('${dia_semana}', dia_semana)
            .replace('${hora_apertura}', hora_apertura)
            .replace('${hora_cierre}', hora_cierre);
        return res.status(200).json({ question: faq.question, answer: respuesta });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return res.status(500).json({
            message: 'Error al procesar la solicitud.',
            error: error.message || 'Error desconocido', // Mensaje de error significativo
        });
    }
};

// function to create a new faq
const createFaq = async (req, res) => {
    const newFaq = new Faq(req.body);
    try {
        const savedFaq = await newFaq.save();
        res.status(201).json(savedFaq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// function to update a faq
const updateFaq = async (req, res) => {
    try {
        const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedFaq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// function to delete a faq
const deleteFaq = async (req, res) => {
    try {
        await Faq.findByIdAndDelete(req.params.id);
        res.json({ message: 'Faq deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const faq_Controller = {
    getFaqs,
    getFaqByQuestion,
    createFaq,
    updateFaq,
    deleteFaq
};
