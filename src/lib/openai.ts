// Use require() to avoid Turbopack module resolution issues with the openai package
// eslint-disable-next-line @typescript-eslint/no-require-imports
const OpenAI = require("openai").default;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default openai;
