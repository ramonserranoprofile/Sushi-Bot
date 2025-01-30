import {
    getAllFaqs,
    getFaqByQuestionService,
    createFaqService,
    updateFaqService,
    deleteFaqService,
} from './faq.service.js';

export const getFaqs = async (req, res) => {
    try {
        const faqs = await getAllFaqs();
        res.json(faqs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getFaqByQuestion = async (req, res) => {
    const { question } = req.params;
    try {
        const result = await getFaqByQuestionService(question);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createFaq = async (req, res) => {
    try {
        const savedFaq = await createFaqService(req.body);
        res.status(201).json(savedFaq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateFaq = async (req, res) => {
    try {
        const updatedFaq = await updateFaqService(req.params.id, req.body);
        res.json(updatedFaq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteFaq = async (req, res) => {
    try {
        await deleteFaqService(req.params.id);
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
    deleteFaq,
};
