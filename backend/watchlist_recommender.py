import pandas as pd
from difflib import SequenceMatcher, get_close_matches
from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer

# ----------------- Load and Preprocess Data ---------------------
df = pd.read_csv('processed_movies_dataset.csv')
df['title_lower'] = df['title'].str.lower()

# TF-IDF Vector
tfidf = TfidfVectorizer(max_features=5000, stop_words='english')
df['tags'] = df['tags'].fillna('')  # Make sure no NaN
tfidf_matrix = tfidf.fit_transform(df['tags'])  # assumes 'tags' column exists
indices = pd.Series(df.index, index=df['title_lower']).drop_duplicates()


# ----------------- Recommender Functions ------------------------

def get_title_similar_movies(title: str, df: pd.DataFrame, top_n: int = 5) -> pd.DataFrame:
    title = title.lower()
    temp_df = df.copy()
    temp_df['title_score'] = temp_df['title'].apply(lambda x: SequenceMatcher(None, title, x.lower()).ratio())
    return temp_df.nlargest(top_n, 'title_score')[['title']].assign(reason='Similar Title')

    print(f"[DEBUG][TF-IDF] Index for '{title_lower}':", idx)
    print("[DEBUG][TF-IDF] TF-IDF shape:", tfidf_matrix.shape)

def get_movies_with_similar_genre(title: str, df: pd.DataFrame, top_n: int = 10) -> pd.DataFrame:
    row = df[df['title_lower'] == title.lower()]
    if row.empty: return pd.DataFrame(columns=['title', 'reason'])
    target_genres = row.iloc[0]['genres']
    genre_match = df[df['genres'] == target_genres]
    return genre_match[['title']].drop_duplicates().head(top_n).assign(reason='Same Genre')

def get_movies_by_same_director(title: str, df: pd.DataFrame, top_n: int = 10) -> pd.DataFrame:
    row = df[df['title_lower'] == title.lower()]
    if row.empty: return pd.DataFrame(columns=['title', 'reason'])
    director = row.iloc[0]['directors']
    same_director = df[df['directors'] == director]
    return same_director[['title']].drop_duplicates().head(top_n).assign(reason='Same Director')

def get_movies_with_same_cast(title: str, df: pd.DataFrame, top_n: int = 10) -> pd.DataFrame:
    row = df[df['title_lower'] == title.lower()]
    if row.empty: return pd.DataFrame(columns=['title', 'reason'])
    target_cast = set(row.iloc[0]['cast'].split(", "))

    def cast_overlap(cast):
        if not isinstance(cast, str) or not cast.strip():
            return 0
        return len(target_cast.intersection(set(cast.split(", "))))


    temp_df = df.copy()
    temp_df['cast_score'] = temp_df['cast'].apply(cast_overlap)
    return temp_df.nlargest(top_n, 'cast_score')[['title']].assign(reason='Similar Cast')

def get_movies_by_same_writer(title: str, df: pd.DataFrame, top_n: int = 10) -> pd.DataFrame:
    row = df[df['title_lower'] == title.lower()]
    if row.empty: return pd.DataFrame(columns=['title', 'reason'])
    writer = row.iloc[0]['writers']
    same_writer = df[df['writers'] == writer]
    return same_writer[['title']].drop_duplicates().head(top_n).assign(reason='Same Writer')

def get_tfidf_similar_movies(title: str, df: pd.DataFrame, tfidf_matrix, indices, top_n: int = 10) -> pd.DataFrame:
    title_lower = title.lower()
    try:
        idx = indices[title_lower]
    except KeyError:
        print(f"[WARNING] Title '{title}' not found in indices.")
        return pd.DataFrame(columns=['title', 'reason'])

    # Now proceed safely
    try:
        cosine_sim = linear_kernel(tfidf_matrix[idx:idx+1], tfidf_matrix).flatten()
        sim_scores = sorted(list(enumerate(cosine_sim)), key=lambda x: x[1], reverse=True)[1:top_n+1]
        movie_indices = [i[0] for i in sim_scores]
        return df.iloc[movie_indices][['title']].assign(reason='TF-IDF Similar')
    except Exception as e:
        print(f"[ERROR] TF-IDF similarity failed for {title}: {e}")
        return pd.DataFrame(columns=['title', 'reason'])

    if isinstance(idx, pd.Series):
        idx = idx.iloc[0]  # take first occurrence

    try:
        cosine_sim = linear_kernel(tfidf_matrix[idx:idx+1], tfidf_matrix).flatten()
        sim_scores = sorted(list(enumerate(cosine_sim)), key=lambda x: x[1], reverse=True)[1:top_n+1]
        movie_indices = [i[0] for i in sim_scores]
        return df.iloc[movie_indices][['title']].assign(reason='TF-IDF Similar')
    except Exception as e:
        print(f"[ERROR] TF-IDF similarity failed for {title}: {e}")
        return pd.DataFrame(columns=['title', 'reason'])

def remove_duplicates(df: pd.DataFrame, movie_title: str) -> pd.DataFrame:
    df = df[df['title'] != movie_title]
    return df.drop_duplicates(subset='title')

def hybrid_recommend(title: str, df: pd.DataFrame) -> pd.DataFrame:
    part1 = get_movies_with_same_cast(title, df, top_n=10)
    part2 = get_movies_by_same_director(title, df, top_n=10)
    part3 = get_movies_with_similar_genre(title, df, top_n=10)
    part4 = get_tfidf_similar_movies(title, df, tfidf_matrix, indices)
    part5 = get_movies_by_same_writer(title, df, top_n=10)
    part6 = get_title_similar_movies(title, df, top_n=5)

    weight_map = {
        'Similar Cast': 1.0,
        'Same Director': 0.9,
        'Same Genre': 0.8,
        'TF-IDF Similar': 1.2,
        'Same Writer': 0.85,
        'Similar Title': 0.7
    }

    parts = [part1, part2, part3, part4, part5, part6]
    updated_parts = []

    for part in parts:
        if not part.empty:
            part = part.copy()  # very important!
            part['score'] = part['reason'].map(weight_map)
            updated_parts.append(part)
        else:
            updated_parts.append(part)

    part1, part2, part3, part4, part5, part6 = updated_parts


    combined = pd.concat([part1, part2, part3, part4, part5, part6], ignore_index=True)
    clean = remove_duplicates(combined, title)
    clean = clean.sort_values(by='score', ascending=False)
    return clean.head(45)
print("[DEBUG][HYBRID] DF shape in hybrid_recommend:", df.shape)

print("[DEBUG] TF-IDF matrix shape:", tfidf_matrix.shape)
print("[DEBUG] DataFrame shape:", df.shape)

# ----------------- Helper: Fuzzy Match --------------------------

def match_title_fuzzy(user_title, all_titles, cutoff=0.7):
    matches = get_close_matches(user_title.lower(), [t.lower() for t in all_titles], n=1, cutoff=cutoff)
    return matches[0] if matches else None

# ----------------- Watchlist-Based Recommendation ---------------

def personalized_recommend(watchlist: list, df: pd.DataFrame, top_n: int = 20) -> pd.DataFrame:
    print(f"[DEBUG] Original Watchlist: {watchlist}")

    df_titles = df['title'].tolist()
    matched_titles = []

    for title in watchlist:
        match = match_title_fuzzy(title.strip(), df_titles)
        if match:
            matched_titles.append(match)
        else:
            print(f"[WARNING] Could not match title: {title}")

    print(f"[DEBUG] Matched Titles: {matched_titles}")

    if len(matched_titles) < 2:
        print("[INFO] Fallback: Not enough valid matches")
        return pd.DataFrame({
            'title': ['The Shawshank Redemption', 'The Godfather', 'Inception', 'Interstellar'],
            'reason': ['Fallback Recommendation']*4,
            'score': [1.0]*4
        })

    try:
        watchlist_indices = []
        for title in matched_titles:
            try:
                idx = indices[title.lower()]
                if isinstance(idx, pd.Series):
                    idx = idx.iloc[0]
                watchlist_indices.append(idx)
            except (KeyError, IndexError) as e:
                print(f"[WARNING] Could not resolve index for '{title}': {e}")

        if not watchlist_indices:
            raise ValueError("No valid indices found for matched titles.")

        watchlist_vectors = tfidf_matrix[watchlist_indices]
        user_profile = watchlist_vectors.mean(axis=0).A  # Converts to ndarray
        cosine_sim = linear_kernel(user_profile, tfidf_matrix).flatten()

        sim_scores = sorted(list(enumerate(cosine_sim)), key=lambda x: x[1], reverse=True)
        sim_indices = [i[0] for i in sim_scores if df.iloc[i[0]]['title'] not in matched_titles][:top_n]

        recommendations = df.iloc[sim_indices][['title']].copy()
        recommendations['reason'] = 'Watchlist TF-IDF Match'
        recommendations['score'] = [round(cosine_sim[i], 3) for i in sim_indices]

        print(f"[DEBUG] Total recommendations returned: {len(recommendations)}")
        return recommendations

    except Exception as e:
        print(f"[ERROR] TF-IDF recommendation for watchlist failed: {e}")
        return pd.DataFrame({
            'title': ['The Dark Knight', 'Fight Club', 'Pulp Fiction', 'Forrest Gump'],
            'reason': ['Fallback Recommendation']*4,
            'score': [1.0]*4
        })

    if not all_recs:
        print("[INFO] Fallback: All recommendations failed")
        return pd.DataFrame({
            'title': ['The Dark Knight', 'Fight Club', 'Pulp Fiction', 'Forrest Gump'],
            'reason': ['Fallback Recommendation']*4,
            'score': [1.0]*4
        })

    combined = pd.concat(all_recs, ignore_index=True)
    combined = combined[~combined['title'].isin(matched_titles)]
    combined = combined.drop_duplicates(subset='title')
    combined = combined.sort_values(by='score', ascending=False)

    print(f"[DEBUG] Total recommendations returned: {len(combined)}")

    return combined.head(top_n)
