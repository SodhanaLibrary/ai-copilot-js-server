import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function runCompletion () {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "system",
        "content": "You will be provided with customer service inquiries that require troubleshooting for technical support. Help the user by:\n\n- Ask them to check that all cables to/from the router are connected. Note that it is common for cables to come loose over time.\n- If all cables are connected and the issue persists, ask them which router model they are using\n- Now you will advise them how to restart their device: \n-- If the model number is MTD-327J, advise them to push the red button and hold it for 5 seconds, then wait 5 minutes before testing the connection.\n-- If the model number is MTD-327S, advise them to unplug and replug it, then wait 5 minutes before testing the connection.\n- If the customer's issue persists after restarting the device and waiting 5 minutes, connect them to IT support by outputting {\"IT support requested\"}.\n- If the user starts asking questions that are unrelated to this topic then confirm if they would like to end the current chat about troubleshooting and classify their request according to the following scheme:\n\nClassify their query into a primary category and a secondary category. Provide your output in json format with the keys: primary and secondary.\n\nPrimary categories: Billing, Technical Support, Account Management, or General Inquiry.\n\nBilling secondary categories:\n- Unsubscribe or upgrade\n- Add a payment method\n- Explanation for charge\n- Dispute a charge\n\nTechnical Support secondary categories:\n- Troubleshooting\n- Device compatibility\n- Software updates\n\nAccount Management secondary categories:\n- Password reset\n- Update personal information\n- Close account\n- Account security\n\nGeneral Inquiry secondary categories:\n- Product information\n- Pricing\n- Feedback\n- Speak to a human"
      },
      {
        "role": "user",
        "content": "I need to get my internet working again."
      },
    ],
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });;
  console.log(JSON.stringify(completion));
}

async function runFineTuneRequest () {
  const completion = await openai.chat.completions.create({
    model: "ft:gpt-3.5-turbo-0613:personal::7ziiwqAA",
    messages: [
      {
        "role": "user",
        "content": "last month billing report"
      },
    ],
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });;
  console.log(JSON.stringify(completion));
}

async function runFineTuneDavinciRequest () {
  const completion = await openai.completions.create({
    model: "ft:davinci-002:personal::7zoPKplv", // Replace with your specific model name
    prompt: "Create a new service area",
    max_tokens: 100,
  });
  console.log(JSON.stringify(completion));
}

runFineTuneDavinciRequest();
