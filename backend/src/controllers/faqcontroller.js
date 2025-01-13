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
    const { question } = req.params; // Get only the question from the parameters
        
    if (!question || question.length <= 3) {
        return res.status(400).json({ message: 'El parámetro "question" es obligatorio.' });
    }

    try {
        const sanitizedQuestion = question.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Split the words of item.name into an array and filter short words (less than 4 letters)
        const item = { name: question.replace(/[?¡!¿,.:´`^~]/g, ' ') };
        console.log('ITEMS:', item.name);
        const words = item.name
            .split(' ')
            .filter(word => word.trim().length >= 4); // Filtrar palabras de al menos 4 letras

        // Build MongoDB query with approximate matching
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

        // Dynamic variables        
        const hora_actual = new Date()
            .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
            .replace(/\./g, '')
            .replace(/([AP])\s(M)/i, '$1$2')
            .toUpperCase();

        const dia_semana = new Date().toLocaleDateString('es-ES', { weekday: 'long' });

        // According to the weekly work schedule, extract the opening and closing hours
        const hora_apertura_semana = "12:00 PM";
        const hora_cierre_semana = "10:00 PM";
        const hora_apertura_sabado = "01:00 PM";
        const hora_cierre_sabado = "11:00 PM";
        const hora_apertura_domingo = "Cerrados";
        const hora_cierre_domingo = "Cerrados";

        // Determine opening and closing hours according to the day of the week
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

        // Function to convert time from 12-hour format to minutes since midnight
        function convertirHora(hora12) {
            if (hora12 === "Cerrados") return null;  // If it's closed all day, there's no point in converting the time
            const [hora, minuto] = hora12.match(/\d{1,2}/g);
            const ampm = hora12.slice(-2);
            let hora24 = parseInt(hora, 10);
            if (ampm === "PM" && hora24 !== 12) hora24 += 12;
            if (ampm === "AM" && hora24 === 12) hora24 = 0;
            return hora24 * 60 + parseInt(minuto, 10);  // Convert to minutes since midnight        
        }

        
        const hora_apertura_24 = convertirHora(hora_apertura);
        const hora_cierre_24 = convertirHora(hora_cierre);
        const hora_actual_24 = convertirHora(hora_actual);

        // Determine open or closed status        
        let on_off = "cerrados"; // by default restaurant closed

        if (hora_apertura_24 !== null && hora_cierre_24 !== null) {
            if (hora_actual_24 >= hora_apertura_24 && hora_actual_24 <= hora_cierre_24) {
                on_off = "abiertos"; // The current time is within the opening and closing hours            
            }
        }

        // Replace variables in the response        
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
            error: error.message || 'Error desconocido', // Meaningful error message        
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
