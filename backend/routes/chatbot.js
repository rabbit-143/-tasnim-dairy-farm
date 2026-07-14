const express = require('express');
const router = express.Router();

/**
 * Chatbot API Route - Simple Keyword-Based Response
 * No external API required, works offline
 */

// Common responses for Bengali and English queries
const RESPONSES = {
  greetings: [
    'আস্সালামু আলাইকুম! 👋 আমি তাসনিম ডেইরি ফার্মের সহায়ক। আমি কিভাবে সাহায্য করতে পারি?',
    'হ্যালো! 👋 আমি Tasnim AI. আপনাকে কিভাবে সাহায্য করতে পারি?',
    'নমস্কার! 🌾 আমি তাসনিম ডেইরি ফার্মের AI সহায়ক। আপনার প্রশ্ন কী?',
  ],
  about: [
    'তাসনিম ডেইরি ফার্ম বাংলাদেশের এক অগ্রণী ডেইরি প্রডাকশন কোম্পানি। আমরা উচ্চমানের দুগ্ধ এবং ডেইরি পণ্য উৎপাদন করি।',
    'Tasnim Dairy Farm is a leading dairy production company in Bangladesh. We produce high-quality milk and dairy products.',
  ],
  products: [
    'আমরা বিভিন্ন প্রকার দুগ্ধ পণ্য তৈরি করি: দুধ, পনির, দই, আইসক্রিম এবং বিভিন্ন স্বাদের দুগ্ধ পণ্য।',
    'We produce various dairy products: Milk, Cheese, Yogurt, Ice Cream, and flavored dairy products.',
  ],
  contact: [
    'যোগাযোগের জন্য আমাদের ওয়েবসাইটে কন্টাক্ট পেজটি দেখুন অথবা আমাদের ফোন নম্বরে যোগাযোগ করুন।',
    'Please visit our Contact page on the website or call us directly for any inquiries.',
  ],
  location: [
    'তাসনিম ডেইরি ফার্ম বাংলাদেশের ঢাকা এবং চট্টগ্রামে অবস্থিত।',
    'Tasnim Dairy Farm is located in Dhaka and Chittagong, Bangladesh.',
  ],
  default: [
    'আমি আপনার প্রশ্নটি বুঝতে পেরেছি। আরও বিস্তারিত জানালে আমি ভালোভাবে সাহায্য করতে পারব।',
    'I understand your question. If you provide more details, I can help you better.',
  ],
};

/**
 * Get response based on user message keywords
 */
const getResponse = (userMessage) => {
  const msg = userMessage.toLowerCase();

  // Check for greetings
  if (msg.match(/(হ্যালো|হাই|আসসালামু আলাইকুম |good morning|good afternoon|good evening|hi\s|hello\s)/)) {
    return RESPONSES.greetings[Math.floor(Math.random() * RESPONSES.greetings.length)];
  }

  // Check for about us
  if (msg.match(/(তাসনিম|ডেইরি|ফার্ম|কোম্পানি|সম্পর্কে|about|about us|who are you)/)) {
    return RESPONSES.about[Math.floor(Math.random() * RESPONSES.about.length)];
  }

  // Check for products
  if (msg.match(/(পণ্য|উৎপাদন|দুগ্ধ|দুধ|পনির|দই|আইসক্রিম|product|milk|cheese|yogurt|ice cream)/)) {
    return RESPONSES.products[Math.floor(Math.random() * RESPONSES.products.length)];
  }

  // Check for contact
  if (msg.match(/(যোগাযোগ|যোগাযোগ|কন্টাক্ট|কল|ফোন|email|contact|call)/)) {
    return RESPONSES.contact[Math.floor(Math.random() * RESPONSES.contact.length)];
  }

  // Check for location
  if (msg.match(/(অবস্থান|ঢাকা|চট্টগ্রাম|ঠিকানা|location|where|address)/)) {
    return RESPONSES.location[Math.floor(Math.random() * RESPONSES.location.length)];
  }

  // Default response
  return RESPONSES.default[Math.floor(Math.random() * RESPONSES.default.length)];
};

/**
 * POST /api/chatbot
 * Send a message and get AI response
 */
router.post('/', async (req, res) => {
  try {
    console.log('Chatbot API Request Body:', req.body);
    
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }

    const aiResponse = getResponse(message);

    res.json({
      success: true,
      message: aiResponse
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Chatbot API Error:', errorMessage);
    res.status(500).json({ 
      error: errorMessage 
    });
  }
});

module.exports = router;
