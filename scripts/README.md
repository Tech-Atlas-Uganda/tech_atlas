# Tech Atlas Scripts

## 📁 Scripts Structure

### `/algolia` - Algolia Testing & Utilities
Scripts for testing and managing Algolia integration:
- `test-algolia.js` - Test Algolia connection and search
- `list-algolia-records.js` - List all records in Algolia index
- `test-search-direct.js` - Direct search API testing

### `/setup` - Setup & Configuration Scripts
Scripts for initial setup and configuration:
- `run-governance-setup.js` - Run governance system setup
- Additional setup scripts as needed

### Root Scripts
- `setup-database.js` - Database initialization (if exists)

## 🚀 Usage

### Testing Algolia

**Test Connection:**
```bash
node scripts/algolia/test-algolia.js
```

**List All Records:**
```bash
node scripts/algolia/list-algolia-records.js
```

**Test Direct Search:**
```bash
node scripts/algolia/test-search-direct.js
```

### Setup Scripts

**Run Governance Setup:**
```bash
node scripts/setup/run-governance-setup.js
```

## 📝 Script Descriptions

### `test-algolia.js`
Tests Algolia connection and performs basic search queries.
- Verifies API credentials
- Lists available indices
- Tests empty query search
- Tests specific search queries

**Expected Output:**
```
✅ Connected! Found indices: [ 'tech_atlas_new' ]
✅ Found 14 records
```

### `list-algolia-records.js`
Lists all records in the `tech_atlas_new` index with detailed information.
- Shows record count
- Displays each record's fields
- Summarizes by type

**Expected Output:**
```
📋 Listing all records in: tech_atlas_new
✅ Found 14 records
📊 Summary by Type:
  Tech Hub: 3
  Startup: 1
  ...
```

### `test-search-direct.js`
Performs direct API searches to verify functionality.
- Tests empty query
- Tests "Kampala" search
- Tests "Innovation" search
- Tests "startup" search

**Expected Output:**
```
Test 1: Empty query
✅ Found 14 records

Test 2: Search for "Kampala"
✅ Found 4 records
  - Starthub Africa (Kampala)
  - MIICHub (Kampala)
  ...
```

## 🔧 Adding New Scripts

When adding new scripts:
1. Place in appropriate folder (`/algolia` or `/setup`)
2. Add description to this README
3. Include usage examples
4. Document expected output
5. Add error handling

## 🐛 Troubleshooting

### "Index does not exist" Error
- Check index name is `tech_atlas_new`
- Verify Algolia credentials in `.env`
- Ensure records are indexed

### "Connection Failed" Error
- Check internet connection
- Verify API key permissions
- Check Algolia service status

### "No Records Found" Error
- Verify data is indexed in Algolia
- Check index name matches
- Review Algolia dashboard

## 📚 Related Documentation

- Algolia Integration: `/docs/algolia/ALGOLIA_README.md`
- Deployment Guide: `/docs/deployment/RAILWAY_DEPLOYMENT.md`
- Quick Test Guide: `/docs/guides/QUICK_TEST_GUIDE.md`

---

**Last Updated**: February 9, 2026  
**Maintained by**: Tech Atlas Team
