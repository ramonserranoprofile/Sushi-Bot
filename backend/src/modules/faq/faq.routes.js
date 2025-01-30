import express from 'express';
import { faq_Controller } from './faq.controller.js';


const faqRouter = express.Router();

faqRouter.get('/', faq_Controller.getFaqs);
faqRouter.get('/:question', faq_Controller.getFaqByQuestion);
faqRouter.post('/', faq_Controller.createFaq);
faqRouter.put('/:id', faq_Controller.updateFaq);
faqRouter.delete('/:id', faq_Controller.deleteFaq);
export default faqRouter;
