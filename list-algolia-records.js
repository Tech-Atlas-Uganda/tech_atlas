// List all records in Algolia index
import { algoliasearch } from 'algoliasearch';

const client = algoliasearch(
  'WPSL0M8DI6',
  'eff3bd3a003d3c023a20d02610ef3bc6'
);

async function listRecords() {
  console.log('📋 Listing all records in: tech_atlas_new\n');
  console.log('='.repeat(80));

  try {
    // Get all records
    const result = await client.search({
      requests: [{
        indexName: 'tech_atlas_new',
        query: '',
        hitsPerPage: 100
      }]
    });

    const hits = result.results[0].hits;
    console.log(`\n✅ Found ${hits.length} records\n`);

    hits.forEach((hit, index) => {
      console.log(`\n📄 Record ${index + 1}:`);
      console.log('─'.repeat(80));
      console.log(`ID: ${hit.objectID}`);
      console.log(`Title: ${hit.title || hit.name || 'N/A'}`);
      console.log(`Type: ${determineType(hit)}`);
      console.log(`Category: ${hit.category || 'N/A'}`);
      console.log(`Location: ${hit.location || 'N/A'}`);
      console.log(`Status: ${hit.status || 'N/A'}`);
      console.log(`Created: ${hit.createdAt || 'N/A'}`);
      
      if (hit.description) {
        console.log(`Description: ${hit.description.substring(0, 100)}...`);
      }
      if (hit.content) {
        console.log(`Content: ${hit.content.substring(0, 100)}...`);
      }
      
      console.log(`\nAll fields: ${Object.keys(hit).join(', ')}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n📊 Summary by Type:');
    const types = {};
    hits.forEach(hit => {
      const type = determineType(hit);
      types[type] = (types[type] || 0) + 1;
    });
    Object.entries(types).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function determineType(hit) {
  // Determine what type of record this is based on fields
  if (hit.slug && hit.excerpt) return 'Blog Post';
  if (hit.threadId !== undefined) return 'Forum Thread/Reply';
  if (hit.startDate && hit.endDate) return 'Event';
  if (hit.memberCount !== undefined) return 'Community';
  if (hit.founded !== undefined) return 'Startup';
  if (hit.teamSize !== undefined) return 'Startup';
  if (hit.level && hit.cost) return 'Learning Resource';
  if (hit.organizer) return 'Event';
  return 'Unknown';
}

listRecords();
