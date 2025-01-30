import { ChatOpenAI } from "@langchain/openai";




const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.7
});
await llm.invoke([{ role: "user", content: "Hi im bob" }]);

export default llm;