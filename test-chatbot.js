// Test Chatbot API with Longcat AI
import axios from 'axios';

async function testChatbot() {
  console.log('🧪 Testing Chatbot API with Longcat AI...\n');

  const tests = [
    { message: 'হ্যালো', description: 'Bengali Greeting' },
    { message: 'What products do you offer?', description: 'English Product Query' },
    { message: 'তাসনিম ডেইরি ফার্ম সম্পর্কে বলুন', description: 'Bengali About Query' },
    { message: 'Do you deliver milk?', description: 'English Service Query' },
  ];

  for (const test of tests) {
    try {
      console.log(`📤 Testing: ${test.description}`);
      console.log(`   Question: ${test.message}`);
      
      const response = await axios.post('http://localhost:3003/api/chatbot', {
        message: test.message
      });

      console.log(`   ✅ Response: ${response.data.message}`);
      if (response.data.powered_by) {
        console.log(`   ⚡ Powered by: ${response.data.powered_by}`);
      }
      console.log('');
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      if (error.response) {
        console.error(`   Response: ${JSON.stringify(error.response.data)}`);
      }
      console.log('');
    }
  }
}

testChatbot();
