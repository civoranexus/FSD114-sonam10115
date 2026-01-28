const openai = require('../config/openai.js');

const getAIReply = async (question, courseTitle) => {
    const prompt = `
You are an assistant teacher.

Course: ${courseTitle}
Explain simply with example.

Student Question:
${question}
`;

    const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }]
    });

    return response.choices[0].message.content;
};

module.exports = { getAIReply };
