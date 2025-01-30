import Faq from './faq.model.js';

// Get all FAQs
export const getAllFaqs = async () => {
    return await Faq.find();
};

// Get FAQ by question with approximate matching and variable replacement
export const getFaqByQuestionService = async (question) => {
    if (!question || question.length <= 3) {
        throw new Error('El parámetro "question" es obligatorio.');
    }

    const sanitizedQuestion = question.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const item = { name: question.replace(/[?¡!¿,.:´`^~]/g, ' ') };
    const words = item.name.split(' ').filter(word => word.trim().length >= 4);

    const faq = await Faq.findOne({
        $or: words.map(word => ({
            question: { $regex: new RegExp(`${word}`, 'i') },
        })),
    });

    if (!faq) {
        throw new Error('Pregunta no encontrada.');
    }

    const hora_actual = new Date()
        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        .replace(/\./g, '')
        .replace(/([AP])\s(M)/i, '$1$2')
        .toUpperCase();

    const dia_semana = new Date().toLocaleDateString('es-ES', { weekday: 'long' });

    const hora_apertura_semana = "12:00 PM";
    const hora_cierre_semana = "10:00 PM";
    const hora_apertura_sabado = "01:00 PM";
    const hora_cierre_sabado = "11:00 PM";
    const hora_apertura_domingo = "Cerrados";
    const hora_cierre_domingo = "Cerrados";

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

    const convertirHora = (hora12) => {
        if (hora12 === "Cerrados") return null;
        const [hora, minuto] = hora12.match(/\d{1,2}/g);
        const ampm = hora12.slice(-2);
        let hora24 = parseInt(hora, 10);
        if (ampm === "PM" && hora24 !== 12) hora24 += 12;
        if (ampm === "AM" && hora24 === 12) hora24 = 0;
        return hora24 * 60 + parseInt(minuto, 10);
    };

    const hora_apertura_24 = convertirHora(hora_apertura);
    const hora_cierre_24 = convertirHora(hora_cierre);
    const hora_actual_24 = convertirHora(hora_actual);

    let on_off = "cerrados";
    if (hora_apertura_24 !== null && hora_cierre_24 !== null) {
        if (hora_actual_24 >= hora_apertura_24 && hora_actual_24 <= hora_cierre_24) {
            on_off = "abiertos";
        }
    }

    const respuesta = faq.answer
        .replace('${hora_actual}', hora_actual)
        .replace('${on_off}', on_off)
        .replace('${dia_semana}', dia_semana)
        .replace('${hora_apertura}', hora_apertura)
        .replace('${hora_cierre}', hora_cierre);

    return { question: faq.question, answer: respuesta };
};

// Create a new FAQ
export const createFaqService = async (faqData) => {
    const newFaq = new Faq(faqData);
    return await newFaq.save();
};

// Update an existing FAQ
export const updateFaqService = async (id, faqData) => {
    return await Faq.findByIdAndUpdate(id, faqData, { new: true });
};

// Delete an FAQ
export const deleteFaqService = async (id) => {
    return await Faq.findByIdAndDelete(id);
};


