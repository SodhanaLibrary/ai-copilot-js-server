import OpenAI from "openai";
import dotenv from "dotenv";
import fs from 'fs';
import jsonTojsonl from 'json-to-jsonl';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function deleteAllFiles () {
  const list = await openai.files.list();

  for await (const file of list) {
    await openai.files.del(file.id);
  }
};

async function creatFile() {
  // If you have access to Node fs we recommend using fs.createReadStream():
  const completion = await openai.files.create({ file: fs.createReadStream('training_data_2.jsonl'), purpose: 'fine-tune' });
  console.log(JSON.stringify(completion));
}

async function convertTojsonL() {
  console.log(jsonTojsonl);
  const response1 = jsonTojsonl('/Users/srinivas.dasari/workspace/chatgpt-nodejs/training_data.jsonl');
  console.log(JSON.stringify(response1));
};

async function createFineTuneModel() {
  const fineTune = await openai.fineTuning.jobs.create({
    training_file: "file-8x5gdERIyEkWOk5TCN2Vohrf",
    model: "davinci-002",
  });
  console.log(JSON.stringify(fineTune));
}

createFineTuneModel();
