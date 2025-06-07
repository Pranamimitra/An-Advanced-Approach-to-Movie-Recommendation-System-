import pandas as pd
from difflib import SequenceMatcher, get_close_matches
from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer

# --- Load and preprocess ---
df = pd.read_csv('processed_movies_dataset.csv')

# Fill missing data to avoid errors
df['cast'] = df['cast'].fillna('')
df['tags'] = df['tags'].fillna('')

df['title_lower'] = df['title'].str.lower()

# TF-IDF Vectorizer
tfidf = TfidfVectorizer(max_features=5000, stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['tags'])
indices = pd.Series(df.index, index=df['title_lower'])

print("[DEBUG] Data loaded:")
print(f" - df shape: {df.shape}")
print(f" - tfidf_matrix shape: {tfidf_matrix.shape}")

# --- Recommender Functions (only get_movies_with_same_cast and get_tfidf_similar_movies here) ---

def get_movies_with_same_cast(title, df, top_n=10):
    title = title.lower()
    row = df[df['title_lower'] == title]
    if row.empty:
        print(f"[WARN] Title '{title}' not found in df for cast similarity")
        return pd.DataFrame(columns=['title', 'reason'])
    target_cast = set(row.iloc[0]['cast'].split(", "))

    def cast_overlap(cast):
        if not isinstance(cast, str) or not cast.strip():
            return 0
        return len(target_cast.intersection(set(cast.split(", "))))

    temp_df = df.copy()
    temp_df['cast_score'] = temp_df['cast'].apply(cast_overlap)
    result = temp_df.nlargest(top_n, 'cast_score')[['title']].assign(reason='Similar Cast')
    print(f"[DEBUG] get_movies_with_same_cast: returning {len(result)} results for '{title}'")
    return result

def get_tfidf_similar_movies(title, df, tfidf_matrix, indices, top_n=10):
    title_lower = title.lower()
    if title_lower not in indices:
        print(f"[WARN] Title '{title_lower}' not found in indices for TF-IDF similarity")
        return pd.DataFrame(columns=['title', 'reason'])

    idx = indices[title_lower]
    if isinstance(idx, pd.Series):
        idx = idx.iloc[0]

    try:
        cosine_sim = linear_kernel(tfidf_matrix[idx:idx+1], tfidf_matrix).flatten()
        sim_scores = sorted(list(enumerate(cosine_sim)), key=lambda x: x[1], reverse=True)[1:top_n+1]
        movie_indices = [i[0] for i in sim_scores]
        result = df.iloc[movie_indices][['title']].assign(reason='TF-IDF Similar')
        print(f"[DEBUG] get_tfidf_similar_movies: returning {len(result)} results for '{title_lower}'")
        return result
    except Exception as e:
        print(f"[ERROR] TF-IDF similarity failed for '{title_lower}': {e}")
        return pd.DataFrame(columns=['title', 'reason'])

# --- Test runner function ---

def test_recommendations_for_titles(titles):
    for title in titles:
        print(f"\n--- Testing recommendations for: '{title}' ---")
        cast_recs = get_movies_with_same_cast(title, df, top_n=5)
        tfidf_recs = get_tfidf_similar_movies(title, df, tfidf_matrix, indices, top_n=5)

        print(f"Cast-based recommendations:\n{cast_recs}")
        print(f"TF-IDF-based recommendations:\n{tfidf_recs}")

# --- Run test on your watchlist titles ---
watchlist = ['dilwale dulhania le jayenge', 'jab we met']
test_recommendations_for_titles(watchlist)
