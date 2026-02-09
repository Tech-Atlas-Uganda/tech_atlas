// Direct search test
import { algoliasearch } from 'algoliasearch';

const client = algoliasearch(
  'WPSL0M8DI6',
  'eff3bd3a003d3c023a20d02610ef3bc6'
);

async function testSearch() {
  console.log('🔍 Testing direct search...\n');

  try {
    // Test 1: Empty query (should return all records)
    console.log('Test 1: Empty query');
    const result1 = await client.search({
      requests: [{
        indexName: 'tech_atlas_new',
        query: '',
        hitsPerPage: 20
      }]
    });
    console.log(`✅ Found ${result1.results[0].hits.length} records with empty query\n`);

    // Test 2: Search for "Kampala"
    console.log('Test 2: Search for "Kampala"');
    const result2 = await client.search({
      requests: [{
        indexName: 'tech_atlas_new',
        query: 'Kampala',
        hitsPerPage: 20
      }]
    });
    console.log(`✅ Found ${result2.results[0].hits.length} records for "Kampala"`);
    result2.results[0].hits.forEach(hit => {
      console.log(`  - ${hit.name || hit.title || 'Unknown'} (${hit.location || 'No location'})`);
    });
    console.log('');

    // Test 3: Search for "Innovation"
    console.log('Test 3: Search for "Innovation"');
    const result3 = await client.search({
      requests: [{
        indexName: 'tech_atlas_new',
        query: 'Innovation',
        hitsPerPage: 20
      }]
    });
    console.log(`✅ Found ${result3.results[0].hits.length} records for "Innovation"`);
    result3.results[0].hits.forEach(hit => {
      console.log(`  - ${hit.name || hit.title || 'Unknown'}`);
    });
    console.log('');

    // Test 4: Search for "startup"
    console.log('Test 4: Search for "startup"');
    const result4 = await client.search({
      requests: [{
        indexName: 'tech_atlas_new',
        query: 'startup',
        hitsPerPage: 20
      }]
    });
    console.log(`✅ Found ${result4.results[0].hits.length} records for "startup"`);
    result4.results[0].hits.forEach(hit => {
      console.log(`  - ${hit.name || hit.title || 'Unknown'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSearch();
