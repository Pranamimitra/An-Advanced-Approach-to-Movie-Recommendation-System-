import streamlit as st
import pickle
import pandas as pd
import requests
import numpy as np

# Function to fetch poster URL
def fetch_poster(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US"
    data = requests.get(url).json()
    if 'poster_path' in data and data['poster_path']:
        poster_path = data['poster_path']
        return f"https://image.tmdb.org/t/p/w500/{poster_path}"
    else:
        return "https://via.placeholder.com/500?text=Poster+Unavailable"

# Function for movie recommendations
def recommend(movie):
    movie_index = movies[movies['title'] == movie].index[0]
    distances = similarity[movie_index]
    movie_list = sorted(list(enumerate(similarity[movie_index])), reverse=True, key=lambda x: x[1])[1:11]
    recommended_movies = []
    recommended_movie_posters = []
    for i in movie_list:
        movie_id = movies.iloc[i[0]]['movie_id']
        recommended_movies.append(movies.iloc[i[0]]['title'])
        recommended_movie_posters.append(fetch_poster(movie_id))
    return recommended_movies, recommended_movie_posters

# Load data
movies_dict = pickle.load(open('movie_dict.pkl', 'rb'))
movies = pd.DataFrame(movies_dict)
similarity = pickle.load(open('similarity.pkl', 'rb'))

# Calculate Weighted Rating with Popularity
C = movies['vote_average'].mean()  # Mean of all vote averages
m = movies['vote_count'].quantile(0.7)  # 70th percentile of vote counts
P_max = movies['popularity'].max()  # Maximum popularity score

# Normalize popularity and calculate the Weighted Rating
movies['normalized_popularity'] = movies['popularity'] / P_max
movies['weighted_rating'] = (
        (movies['vote_count'] / (movies['vote_count'] + m) * movies['vote_average']) +
        (m / (movies['vote_count'] + m) * C) +
        0.1 * movies['normalized_popularity']  # Adjust the weight for popularity (alpha = 0.1)
)

# Sort movies by Weighted Rating
top_movies = movies.sort_values(by='weighted_rating', ascending=False)

# Main App
st.set_page_config(page_title="Movie Recommendation System", page_icon="🎥", layout="wide")
st.title("🎥 Movie Recommendation System")
st.markdown("""
**Discover your next favorite movie!**  
Select a movie from the dropdown menu, and we'll recommend similar ones for you. Alternatively, explore the top-rated movies or trending films.
""")

# Radio Button for Navigation
view_option = st.radio("Choose an option:", ('Movie Recommendations', 'Top Movies by Rating', 'Trending Movies', 'New Releases'), index=0)

# Main App - Movie Recommendations
if view_option == 'Movie Recommendations':
    # Dropdown for Movie Selection with custom label and placeholder
    selected_movie_name = st.selectbox(
        "🎬 Choose a Movie to Get Recommendations",  # Custom label
        movies['title'].values,
        index=0  # Ensure that the first movie is not automatically selected (no default value)
    )

    # Button to Show Recommendations
    if st.button('Show Recommendations'):
        with st.spinner("Fetching recommendations..."):
            recommended_movie_names, recommended_movie_posters = recommend(selected_movie_name)

        st.subheader("Your Recommendations:")
        cols_per_row = 5
        for idx in range(0, len(recommended_movie_names), cols_per_row):
            cols = st.columns(min(cols_per_row, len(recommended_movie_names) - idx))
            for i, col in enumerate(cols):
                with col:
                    serial_no = idx + i + 1  # Serial number starts from 1 and increases sequentially
                    st.text(f"{serial_no}. {recommended_movie_names[idx + i]}")
                    st.image(recommended_movie_posters[idx + i], width=150)  # Adjust image width


# Top Movies by Rating
elif view_option == 'Top Movies by Rating':
    # Dropdown for Top Movie Count
    top_movie_count = st.selectbox(
        "📊 Select Top Movies by Rating",
        ["Top 10", "Top 20", "Top 50"]
    )

    # Button to Show Top Movies
    if st.button(f'Show {top_movie_count} Movies', use_container_width=True):
        count = int(top_movie_count.split()[-1])  # Extract number from dropdown
        top_movies_to_show = top_movies.head(count)
        st.subheader(f"{top_movie_count} Best Movies of All Time")
        i = 1
        for _, row in top_movies_to_show.iterrows():  # Use 'row' instead of 'movie'
            serial_no = i  # Serial number starts from 1 and increases sequentially
            st.text(f"{serial_no}. {row['title']} ({round(row['weighted_rating'], 3)})")
            st.image(fetch_poster(row['movie_id']), width=150)  # Adjust image width
            i += 1  # Increment serial number

# Trending Movies
elif view_option == 'Trending Movies':
    # Trending movies by popularity
    trending_movies = movies.sort_values(by='popularity', ascending=False).head(10)
    st.subheader("Trending Movies Now")
    i = 1
    for index, row in trending_movies.iterrows():  # Unpack tuple into index and row
        serial_no = i
        st.text(f"{serial_no}. {row['title']} - Popularity: {round(row['popularity'], 2)}")
        st.image(fetch_poster(row['movie_id']), width=150)
        i += 1

# New Releases
elif view_option == 'New Releases':
    # Show newly released movies
    new_releases = movies[movies['release_date'] >= '2023-01-01'].head(10)  # Filter for 2023 releases
    st.subheader("Latest Movie Releases")
    for idx, row in new_releases.iterrows():
        st.text(f"{idx + 1}. {row['title']} - Released on: {row['release_date']}")
        st.image(fetch_poster(row['movie_id']), width=150)

# Footer
st.markdown("""
---
**Created with ❤️ using Streamlit**  
Data powered by [The Movie Database (TMDb)](https://www.themoviedb.org/).  
""")
