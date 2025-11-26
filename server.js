// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Porta adaptável (Render e local)

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Pegando a chave da API do ambiente
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ ERRO: A chave da API Gemini não foi definida!");
  process.exit(1);
}

// ✅ Inicializando o modelo Gemini
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

// ✅ Rota principal
app.post("/analisar", async (req, res) => {
  try {
    const dados = req.body;

    const prompt = `
      Analise os seguintes dados da caderneta de campo e retorne um relatório,
      especificando as áreas analisadas geograficamente:
      ${JSON.stringify(dados)}
    `;

    const result = await model.generateContent(prompt);
    const resposta = result.response.text();

    res.json({ texto: resposta });
  } catch (error) {
    console.error("❌ Erro ao utilizar o Gemini:", error);
    res.status(500).json({ erro: "Falha na análise com a IA" });
  }
});

// ✅ Inicialização do servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
