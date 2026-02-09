import { useState, useEffect } from 'react';
import { InstantSearch, SearchBox, Hits, Highlight, Configure, useInstantSearch } from 'react-instantsearch';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { Sparkles, Lightbulb, Sparkle } from 'lucide-react';
import 'instantsearch.css/themes/satellite.css';
import './AlgoliaSearch.css';

// Try to import FilterSuggestions if available
let FilterSuggestions: any = null;
try {
  const instantSearchModule = require('react-instantsearch');
  FilterSuggestions = instantSearchModule.FilterSuggestions;
} catch (e) {
  console.log('FilterSuggestions not available in this version');
}

const searchClient = algoliasearch(
  'WPSL0M8DI6',
  'eff3bd3a003d3c023a20d02610ef3bc6'
);

const AGENT_ID = '10082af7-49af-4f28-b47f-b83e40c4356e';

// Typing animation placeholders
const placeholders = [
  "Search for tech hubs in Kampala...",
  "Find startup communities...",
  "Discover job opportunities...",
  "Explore learning resources...",
  "Search for events and meetups...",
  "Find tech talent and mentors...",
];

function Hit({ hit }: { hit: any }) {
  // Determine what type of content this is
  const title = hit.title || hit.name || 'Untitled';
  const description = hit.description || hit.content || hit.excerpt || hit.bio || '';
  const image = hit.coverImage || hit.imageUrl || hit.logo || '';
  
  console.log('🎯 Rendering hit:', { title, description: description.substring(0, 50) });

  return (
    <div className="p-4 hover:bg-background/90 rounded-lg cursor-pointer transition-colors border border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        {image && (
          <img 
            src={image} 
            alt={title}
            className="w-16 h-16 object-cover rounded"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-base text-white">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-300 line-clamp-2 mt-1">
              {description.substring(0, 150)}...
            </p>
          )}
          {hit.location && (
            <p className="text-xs text-gray-400 mt-1">📍 {hit.location}</p>
          )}
          {hit.category && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-1 inline-block">
              {hit.category}
            </span>
          )}
          {hit.status && (
            <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded mt-1 inline-block ml-2">
              {hit.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// AI Filter Suggestions Component
function AIFilterSuggestions({ query }: { query: string }) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      console.log('🤖 Fetching AI suggestions for:', query);
      try {
        const response = await fetch(
          `https://wpsl0m8di6.algolia.net/agent-studio/1/agents/${AGENT_ID}/completions?compatibilityMode=ai-sdk-5`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Algolia-Application-Id': 'WPSL0M8DI6',
              'X-Algolia-API-Key': 'eff3bd3a003d3c023a20d02610ef3bc6',
            },
            body: JSON.stringify({
              query: query,
              context: 'Uganda tech ecosystem search',
            }),
          }
        );

        console.log('🤖 AI Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🤖 AI Response data:', data);
          // Parse AI response for filter suggestions
          if (data.suggestions) {
            setSuggestions(data.suggestions.slice(0, 3));
          }
        } else {
          console.error('🤖 AI Response error:', await response.text());
        }
      } catch (error) {
        console.error('🤖 Error fetching AI suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!suggestions.length && !loading) return null;

  return (
    <div className="p-3 border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="flex items-center gap-2 mb-2">
        <Sparkle className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-primary">AI Suggestions</span>
      </div>
      {loading ? (
        <div className="text-xs text-muted-foreground">Thinking...</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="text-xs px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Search Results Wrapper to access search query
function SearchResults({ isFocused, showResults }: { isFocused: boolean; showResults: boolean }) {
  const { indexUiState, results } = useInstantSearch();
  const query = indexUiState.query || '';
  const hasResults = results && results.hits && results.hits.length > 0;

  console.log('🔍 Current query:', query);
  console.log('🔍 Results:', results);
  console.log('🔍 Has results:', hasResults);
  console.log('🔍 Show results:', showResults);

  // Show dropdown if focused OR if there's a query with results
  const shouldShow = isFocused || (query && showResults);

  if (!shouldShow) return null;

  return (
    <div 
      className="absolute top-full left-0 right-0 mt-2 max-h-[60vh] overflow-y-auto bg-black/90 backdrop-blur-xl border-2 border-primary/50 rounded-2xl shadow-2xl"
      style={{ zIndex: 9999 }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Debug Info */}
      <div className="p-3 border-b border-border/30 bg-primary/5">
        <div className="text-xs text-white">
          <div>Query: "{query || 'empty'}"</div>
          <div>Index: tech_atlas_new</div>
          <div>Results: {results?.hits?.length || 0} hits</div>
          <div>Status: {isFocused ? 'Focused' : 'Showing results'}</div>
        </div>
      </div>

      {/* AI Filter Suggestions */}
      {query && <AIFilterSuggestions query={query} />}
      
      {/* Search Results */}
      <div className="p-2">
        {query ? (
          <>
            <Hits 
              hitComponent={Hit}
              classNames={{
                root: 'space-y-2',
                list: 'space-y-2',
                item: 'list-none',
              }}
            />
            {!hasResults && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <p>No results found for "{query}"</p>
                <p className="text-xs mt-2">Try different keywords</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <p>Type to search across Uganda's tech ecosystem</p>
            <p className="text-xs mt-2">Try: "Kampala", "Innovation", "startup"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AlgoliaSearch() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Stop animation when focused or hovered
  const shouldAnimate = !isFocused && !isHovered;

  // Typing animation effect
  useEffect(() => {
    if (!shouldAnimate) {
      return;
    }

    const currentPlaceholder = placeholders[placeholderIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPlaceholder.length) {
          setDisplayText(currentPlaceholder.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setPlaceholderIndex((placeholderIndex + 1) % placeholders.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, placeholderIndex, shouldAnimate]);

  const currentPlaceholder = shouldAnimate 
    ? displayText + '|'
    : placeholders[placeholderIndex];

  return (
    <div 
      className="relative w-full max-w-2xl mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur opacity-30 hover:opacity-50 transition duration-300 pointer-events-none"></div>
      
      <InstantSearch 
        searchClient={searchClient} 
        indexName="tech_atlas_new"
      >
        <Configure 
          hitsPerPage={8}
          attributesToRetrieve={[
            'name',
            'title', 
            'bio',
            'description',
            'content',
            'location',
            'coverImage',
            'logo',
            'imageUrl',
            'category',
            'companyName',
            'email',
            'website',
            'tags',
            'status',
            'type'
          ]}
        />
        
        <div className="relative z-10">
          {/* Glassmorphism Search Box Container */}
          <div 
            className="relative flex items-center gap-3 pl-2 pr-6 py-4 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl hover:border-primary/50 focus-within:border-primary transition-all duration-300 shadow-lg"
            onFocus={() => {
              console.log('🎯 Search box focused');
              setIsFocused(true);
              setShowResults(true);
            }}
            onBlur={(e) => {
              console.log('🎯 Search box blur');
              // Only blur if clicking outside the container
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setTimeout(() => {
                  setIsFocused(false);
                  // Keep results visible for a moment
                  setTimeout(() => setShowResults(false), 300);
                }, 200);
              }
            }}
          >
            <SearchBox
              placeholder={currentPlaceholder}
              submitIconComponent={() => null}
              resetIconComponent={() => null}
              loadingIconComponent={() => null}
              classNames={{
                root: 'flex-1',
                form: 'relative flex items-center',
                input: 'w-full bg-transparent outline-none text-white placeholder:text-muted-foreground border-0 p-0 pl-2 focus:ring-0 shadow-none',
                submit: '!hidden !w-0 !h-0 !opacity-0 !invisible',
                submitIcon: '!hidden !w-0 !h-0 !opacity-0 !invisible',
                reset: '!hidden !w-0 !h-0 !opacity-0 !invisible',
                resetIcon: '!hidden !w-0 !h-0 !opacity-0 !invisible',
                loadingIndicator: '!hidden !w-0 !h-0 !opacity-0 !invisible',
                loadingIcon: '!hidden !w-0 !h-0 !opacity-0 !invisible',
              }}
            />
            
            {!isFocused && (
              <Sparkles className="h-4 w-4 text-primary flex-shrink-0 pointer-events-none" />
            )}
          </div>
          
          {/* Results dropdown with AI suggestions */}
          <SearchResults isFocused={isFocused} showResults={showResults} />
        </div>
      </InstantSearch>
    </div>
  );
}
