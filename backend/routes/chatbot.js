const express = require('express');
const axios = require('axios');
const router = express.Router();

// ✅ FIX #1: dotenv নিশ্চিতভাবে লোড হচ্ছে কি না নিশ্চিত করো
// যদি main server.js এ আগেই require('dotenv').config() থাকে, এটা লাগবে না।
// কিন্তু safety-র জন্য এখানে দিয়ে রাখলাম, কারণ ডাবল কল করলে ক্ষতি নেই।
require('dotenv').config();

/**
 * Chatbot API Route - Longcat AI Powered
 */

const WEBSITE_CONTEXT = `
You are "Mou" (মৌ), the friendly AI assistant for Tasnim Dairy Farm website...
`; // (তোমার আগের context অপরিবর্তিত রাখলাম)

const FALLBACK_RESPONSES = {
  greetings: [
    'আস্সালামু আলাইকুম! 👋 আমি মৌ, তাসনিম ডেইরি ফার্মের সহায়ক। আমি কিভাবে সাহায্য করতে পারি?',
    'হ্যালো! 🐄 আমি Mou. আপনাকে কিভাবে সাহায্য করতে পারি?',
  ],
  error: [
    'দুঃখিত, আমি এই মুহূর্তে আপনার প্রশ্নের উত্তর দিতে পারছি না। অনুগ্রহ করে আমাদের কন্টাক্ট ফর্মের মাধ্যমে যোগাযোগ করুন। 🙏',
    'Sorry, I cannot answer right now. Please contact us through the contact form. 🙏',
  ],
};

/**
 * ✅ FIX #2: config validation এ আরও বেশি info দিচ্ছি,
 * যাতে server start-এর সময়ই বুঝা যায় সমস্যা আছে কি না।
 */
const getLongcatConfig = () => {
  const config = {
    apiKey: process.env.LONGCAT_API_KEY,
    baseUrl: process.env.LONGCAT_BASE_URL || 'https://api.longcat.chat',
    model: process.env.LONGCAT_MODEL || 'LongCat-2.0',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  };

  if (!config.apiKey) {
    // এটা এখন startup এর সময়ই ধরা পড়বে, request আসার অপেক্ষায় থাকবে না
    throw new Error(
      'LONGCAT_API_KEY environment variable is missing. ' +
      'Check your .env file exists and dotenv.config() runs before this file loads.'
    );
  }

  return config;
};

/**
 * ✅ FIX #3: retry logic ঠিক আছে, কিন্তু non-retryable errors
 * (যেমন 401 Unauthorized, 400 Bad Request) এ retry করা মানে
 * শুধু সময় নষ্ট — key ভুল থাকলে ৩ বার retry করেও কাজ হবে না।
 * তাই status code চেক করে retry স্কিপ করছি।
 */
const callLongcatAPI = async (messages, config, attempt = 1) => {
  try {
    console.log(`[Longcat AI] Attempt ${attempt}/${config.retryAttempts} → ${config.baseUrl}/openai/v1/chat/completions`);

    const response = await axios.post(
      `${config.baseUrl}/openai/v1/chat/completions`,
      {
        model: config.model,
        messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: config.timeout
      }
    );

    if (response.data?.choices?.length > 0) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error('Invalid response format from Longcat AI: ' + JSON.stringify(response.data));
    }

  } catch (error) {
    const status = error.response?.status;
    const responseData = error.response?.data;

    console.error(`[Longcat AI] Attempt ${attempt} FAILED`);
    console.error(`  → Status: ${status || 'NO RESPONSE (network/timeout issue)'}`);
    console.error(`  → Message: ${error.message}`);
    console.error(`  → Response body: ${JSON.stringify(responseData)}`);

    // ✅ non-retryable errors — এগুলোতে আবার চেষ্টা করা বৃথা
    const nonRetryableStatuses = [400, 401, 403, 404];
    if (status && nonRetryableStatuses.includes(status)) {
      const err = new Error(
        `Longcat API rejected the request (${status}): ${JSON.stringify(responseData)}`
      );
      err.status = status;
      err.nonRetryable = true;
      throw err;
    }

    if (attempt < config.retryAttempts) {
      await new Promise(resolve => setTimeout(resolve, config.retryDelay * attempt));
      return callLongcatAPI(messages, config, attempt + 1);
    }

    throw error;
  }
};

const getAIResponse = async (userMessage) => {
  const config = getLongcatConfig(); // এখানে throw হলে বাইরের catch এ যাবে

  console.log(`[Longcat AI] Processing: "${userMessage.substring(0, 50)}..."`);
  console.log(`[Longcat AI] Model: ${config.model} | Base URL: ${config.baseUrl}`);

  const messages = [
    { role: 'system', content: WEBSITE_CONTEXT },
    { role: 'user', content: userMessage }
  ];

  const aiResponse = await callLongcatAPI(messages, config);
  console.log(`[Longcat AI] Response OK: "${aiResponse.substring(0, 100)}..."`);
  return aiResponse;
};

/**
 * POST /api/chatbot
 */
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string'
      });
    }

    const sanitizedMessage = message.trim();
    if (sanitizedMessage.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Message too long. Maximum 1000 characters allowed.'
      });
    }

    const aiResponse = await getAIResponse(sanitizedMessage);

    return res.json({
      success: true,
      message: aiResponse,
      powered_by: 'Longcat AI'
    });

  } catch (error) {
    console.error('[Chatbot API] Fatal error:', error.message);

    // greeting detection fallback আগের মতোই রাখলাম
    const msg = (req.body?.message || '').toLowerCase();
    if (msg.match(/(হ্যালো|হাই|আসসালামু|hi|hello|good morning|good afternoon|hey)/)) {
      return res.json({
        success: true,
        message: FALLBACK_RESPONSES.greetings[Math.floor(Math.random() * FALLBACK_RESPONSES.greetings.length)],
        fallback: true
      });
    }

    const fallbackMsg = FALLBACK_RESPONSES.error[Math.floor(Math.random() * FALLBACK_RESPONSES.error.length)];

    // ✅ FIX #4: এটাই সবচেয়ে গুরুত্বপূর্ণ ফিক্স।
    // production এ user কে fallback message দেখাও (ঠিক আছে),
    // কিন্তু development এ আসল error দেখাও, নাহলে তুমি কখনো বাগ ধরতে পারবে না।
    const isDev = process.env.NODE_ENV !== 'production';

    return res.json({
      success: true,
      message: fallbackMsg,
      fallback: true,
      ...(isDev && {
        debug_error: error.message,
        debug_status: error.status || error.response?.status || null
      })
    });
  }
});

module.exports = router;