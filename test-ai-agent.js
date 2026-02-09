// Quick test script for AI Resource Agent
// Run with: node test-ai-agent.js

const testQuery = "free Python courses for beginners";

console.log('🤖 Testing AI Resource Agent');
console.log('Query:', testQuery);
console.log('\nExpected behavior:');
console.log('1. AI searches internet with Google Search');
console.log('2. Finds ONE relevant learning resource');
console.log('3. Returns structured JSON with all fields');
console.log('4. Checks for duplicates');
console.log('5. Ready to submit to database');

console.log('\n📋 Expected JSON structure:');
console.log(JSON.stringify({
  title: "Example: Python for Everybody",
  description: "Complete Python course for beginners...",
  type: "Course",
  category: "Web Development",
  level: "beginner",
  provider: "Coursera",
  url: "https://example.com/course",
  cost: "free",
  duration: "8 weeks",
  tags: ["python", "programming", "beginner"],
  relevance: "Free course with no prerequisites, perfect for Ugandan learners"
}, null, 2));

console.log('\n✅ To test live:');
console.log('1. Start server: npm run dev');
console.log('2. Go to: http://localhost:3000/learning');
console.log('3. Find "AI Resource Agent" card');
console.log('4. Enter query and click "Find"');
console.log('5. Review auto-filled data');
console.log('6. Click "Submit Resource"');

console.log('\n🔑 Requirements:');
console.log('- GEMINI_API_KEY in .env file');
console.log('- Internet connection');
console.log('- Server running');
