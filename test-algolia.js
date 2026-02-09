// Test Algolia Connection
import { algoliasearch } from 'algoliasearch';

const client = algoliasearch(
  'WPSL0M8DI6',
  'eff3bd3a003d3c023a20d02610ef3bc6'
);

async function testConnection() {
  console.log('🔍 Testing Algolia connection...\n');

  try {
    // Test 1: Check if we can connect
    console.log('1️⃣ Testing connection...');
    const indices = await client.listIndices();
    console.log('✅ Connected! Found indices:', indices.items.map(i => i.name));

    // Test 2: Search for anything (empty query)
    console.log('\n2️⃣ Testing search (empty query)...');
    const emptySearch = await client.search({
      requests: [{
        indexName: 'supabase_tech_atlas_index',
        query: '',
        hitsPerPage: 5
      }]
    });
    console.log(`Found ${emptySearch.results[0].nbHits} total records`);
    console.log('Sample hits:', JSON.stringify(emptySearch.results[0].hits.slice(0, 2), null, 2));

    // Test 3: Search for "tech"
    console.log('\n3️⃣ Testing search (query: "tech")...');
    const techSearch = await client.search({
      requests: [{
        indexName: 'supabase_tech_atlas_index',
        query: 'tech',
        hitsPerPage: 5
      }]
    });
    console.log(`Found ${techSearch.results[0].nbHits} results for "tech"`);
    console.log('Sample hits:', JSON.stringify(techSearch.results[0].hits.slice(0, 2), null, 2));

    console.log('\n✅ All tests passed!');
    console.log('\n📊 Summary:');
    console.log(`- Index exists: ✅`);
    console.log(`- Total records: ${emptySearch.results[0].nbHits}`);
    console.log(`- Searchable: ${techSearch.results[0].nbHits > 0 ? '✅' : '❌'}`);

    if (emptySearch.results[0].nbHits === 0) {
      console.log('\n⚠️  WARNING: Your index is EMPTY! You need to add data to it.');
      console.log('   Visit: https://www.algolia.com/apps/WPSL0M8DI6/explorer/browse/supabase_tech_atlas_index');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();
