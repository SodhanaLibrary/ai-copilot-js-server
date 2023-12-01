import express from 'express';
import url from 'url';
import fs from 'fs';
import OpenAI from "openai";
import dotenv from "dotenv";
import bodyParser from 'body-parser';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


async function runCompletion (messages) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    return completion;
}

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.get('/aiCopilotJs/navigation', function(req, res){
   res.send("Hello world!, its working");
});

app.post('/aiCopilotJs/navigation', async function(req, res){
   const messages = [
    {
      "role": "system",
      "content": `You will receive web pages with descriptions in brackets. Users will search with a query, identify their query within a web page, and provide the output in JSON format with the key 'page.
      Web pages:
      ${req.body.tData.join('\n')}`
    },
    {
      "role": "user",
      "content": req.body.searchText
    },
  ];
  const response = await runCompletion(messages);
  res.send(JSON.stringify(response.choices));
  console.log(messages, response.choices);
});

app.post('/aiCopilotJs/writeAItest', async function(req, res){
  const messages = [
   {
     "role": "system",
     "content": `You will receive a website route with descriptions and elements identified by their XPath and descriptions.
     Next, you will be given a test case description. Your task is to create a test case using Selenium IDE commands.
     Finally, please provide the response in JSON format.

     Web page:
     ${JSON.stringify(req.body.page)}

     elements:
     ${JSON.stringify(req.body.elements)}
     `
   },
   {
     "role": "user",
     "content": req.body.testCase
   },
 ];
 const response = await runCompletion(messages);
 res.send(JSON.stringify(response.choices));
 console.log(messages);
});

app.post('/aiCopilotJs/generateValidationTests', async function(req, res){
  const messages = [
   {
     "role": "system",
     "content": `You will receive a Selenium IDE test case involving form elements. Your task is to create validation test cases in Selenium IDE, each addressing scenarios like empty values, maximum text lengths, invalid values, scripting injections, and spaces before and after the text. Write a separate test case for each validation.

     Please generate at least three Selenium IDE test cases in JSON format and separate them with ##########.
     `
   },
   {
     "role": "user",
     "content": JSON.stringify(req.body.testCase)
   },
 ];
 const response = await runCompletion(messages);
 res.send(JSON.stringify(response.choices));
 console.log(messages);
});

app.get('/aiCopilotJs/testSuites', async function(req, res){
  const readFiles = new Promise((resolve, reject) => {
    let tests = [];
    fs.readdir(process.env.TESTS_DIR, (err, files) => {
      let count = 0;
      files.forEach(file => {
        fs.readFile(`${process.env.TESTS_DIR}/${file}`, "utf8",  function(err, data) {
          if(err) {
            reject(err);
          }
          tests.push(data);
          count++;
          if(count === files.length) {
            resolve(tests);
          }
        });
      });
    });
  });
  readFiles.then(result => {
    res.send(JSON.stringify(result));
  });
});

app.post('/aiCopilotJs/testSuites', async function(req, res){
  fs.writeFile(`${process.env.TESTS_DIR}/${req.body.name}.side`, JSON.stringify(req.body.content), function (err) {
     if (err) throw err;
     res.send('Saved!');
  });
});

app.delete('/aiCopilotJs/testSuites', async function(req, res){
  fs.unlink(`${process.env.TESTS_DIR}/${req.body.name}.side`, function (err) {
     if (err) throw err;
     res.send('Deleted!');
  });
});

app.get('/aiCopilotJs/trainedData', async function(req, res){
  const readFiles = new Promise((resolve, reject) => {
    fs.readFile(`${process.env.TRAINED_DIR}/trained.json`, "utf8",  function(err, data) {
      if(err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
  readFiles.then(result => {
    res.send(JSON.stringify(result));
  });
});

app.post('/aiCopilotJs/trainedData', async function(req, res){
  fs.writeFile(`${process.env.TRAINED_DIR}/trained.json`, JSON.stringify(req.body), function (err) {
     if (err) throw err;
     res.send('Saved!');
  });
});

app.listen(9000);
