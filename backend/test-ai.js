// Quick test to check if OpenAI API is working
const dotenv = require("dotenv");
dotenv.config();

const OpenAI = require("openai");

const testOpenAI = async () => {
    console.log("\n🔍 Testing OpenAI Integration...\n");

    // Check if API key exists
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error("❌ OPENAI_API_KEY not found in .env file");
        process.exit(1);
    }

    console.log("✅ API Key found (length:", apiKey.length, ")");
    console.log("📋 First 20 chars: sk-" + apiKey.substring(5, 25) + "...\n");

    try {
        const openai = new OpenAI({
            apiKey: apiKey,
        });

        console.log("📤 Sending test request to OpenAI...\n");

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful teaching assistant."
                },
                {
                    role: "user",
                    content: "What is 2+2? Give a brief answer."
                }
            ],
            max_tokens: 100,
            temperature: 0.7,
        });

        console.log("✅ SUCCESS! OpenAI responded:\n");
        console.log("Response:", response.choices[0].message.content);
        console.log("\n✅ OpenAI API is working correctly!");

    } catch (error) {
        console.error("❌ FAILED! Error details:\n");
        console.error("Message:", error.message);
        console.error("Status:", error.status);
        console.error("Code:", error.code);
        console.error("\nFull error:", error);

        if (error.message.includes("401")) {
            console.error("\n⚠️  API Key is invalid or expired");
        } else if (error.message.includes("429")) {
            console.error("\n⚠️  Rate limited - too many requests");
        } else if (error.message.includes("500")) {
            console.error("\n⚠️  OpenAI server error - try again later");
        }
    }

    process.exit(0);
};

testOpenAI();
