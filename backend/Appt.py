import os
import csv
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from mrs import hybrid_recommendation,new_df, tfidf_matrix, indices, model_knn, movie_user_mat_sparse,movie_to_idx, recommend_by_mood# Assumes your recommendation logic is in mrs.py
from watchlist_recommender import personalized_recommend
from datetime import datetime
from chatbot import chatbot_bp
from dotenv import load_dotenv


app = Flask(__name__)
# CORS(app)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
app.register_blueprint(chatbot_bp)
load_dotenv()
print("API KEY:", os.getenv("OPENROUTER_API_KEY")) 

# --------------------- Database Configuration ---------------------
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --------------------- User Model ---------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    # New relationships
    watchlist = db.relationship('Watchlist', backref='user', lazy=True)
    recently_viewed = db.relationship('RecentlyViewed', backref='user', lazy=True)  # Optional: only if you add this model

class Watchlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    movie_title = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Plan to Watch')  # NEW
    rating = db.Column(db.Integer, nullable=True)  # optional

# Optional: if you want to support recently viewed
class RecentlyViewed(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    movie_title = db.Column(db.String(200), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# --------------------- Local Movie Dataset ---------------------
MOVIE_DATASET = {}

def load_movie_dataset():
    global MOVIE_DATASET
    dataset_path = os.path.join(basedir, 'TMDB_IMDB_movies.csv')  # Ensure this file exists
    try:
        with open(dataset_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                key = row['title'].strip().lower()
                try:
                    cast = json.loads(row['cast'])
                except Exception:
                    cast = [member.strip() for member in row['cast'].split(',')]

                MOVIE_DATASET[key] = {
                    "title": row['title'],
                    "release_date": row.get('release_date', ''),
                    "runtime": row.get('runtime', ''),
                    "original_title": row.get('original_title', ''),
                    "spoken_languages": row.get('spoken_languages', ''),
                    "revenue": row.get('revenue', ''),
                    "budget": row.get('budget', ''),
                    "production_countries": row.get('production_countries', ''),
                    "vote_count": row.get('vote_count', ''),
                    "adult": row.get('adult', ''),
                    "overview": row.get('overview', ''),
                    "poster_path": row.get('poster_path', ''),
                    "tagline": row.get('tagline', ''),
                    "genres": row.get('genres', ''),
                    "directors": row.get('directors', ''),
                    "writers": row.get('writers', ''),
                    "cast": cast,
                    "popularity": row.get('popularity', 0),  # ✅ Add this line
                    "vote_average": row.get('vote_average', 0)  
                }
        print("Movie dataset loaded successfully.")
    except Exception as e:
        print("Error loading movie dataset:", e)

# --------------------- Utility Functions ---------------------
def get_movie_details(movie_name):
    key = movie_name.strip().lower()
    return MOVIE_DATASET.get(key)

def get_recommendations(movie_name):
    try:
        movie_name = movie_name.strip().lower()
        recommendations = hybrid_recommendation(
            movie_name,
            new_df,
            tfidf_matrix,
            indices,
            model_knn,
            movie_user_mat_sparse,
            movie_to_idx,
            top_n=20
        )

        # Convert to list of dicts if it's a DataFrame
        if hasattr(recommendations, 'to_dict'):
            recommendations = recommendations.to_dict(orient='records')

        # Enrich each recommendation with poster_path and other details
        enriched_recommendations = []
        for rec in recommendations:
            title = rec.get("title", "").strip().lower()
            extra_data = MOVIE_DATASET.get(title, {})  # fallback to empty dict

            enriched_recommendations.append({
                "title": rec.get("title", ""),
                "overview": extra_data.get("overview", ""),
                "genre": extra_data.get("genres", ""),
                "poster_path": extra_data.get("poster_path", ""),
            })

        return enriched_recommendations

    except Exception as e:
        print("Error in get_recommendations:", e)
        return []

def get_mood_recommendations(mood):
    try:
        top_n = int(request.args.get('top_n', 25))
        recommendations = recommend_by_mood(mood,top_n)  # ✅ simple call
        if isinstance(recommendations, str):
            return []

        enriched_recommendations = []
        for _, rec in recommendations.iterrows():
            title = rec['title'].strip().lower()
            extra = MOVIE_DATASET.get(title, {})
            enriched_recommendations.append({
                "title": rec['title'],
                "overview": extra.get("overview", ""),
                "genre": extra.get("genres", ""),
                "poster_path": extra.get("poster_path", ""),
                "mood": rec.get("mood", ""),
                "popularity": rec.get("popularity", 0)
            })
        return enriched_recommendations
    except Exception as e:
        print("Error in get_mood_recommendations:", e)
        return []

def enrich_movie(row):
    title = row.get("title", "").strip().lower()
    extra = MOVIE_DATASET.get(title, {})

    return {
        "title": row.get("title", ""),
        "overview": extra.get("overview", ""),
        "genre": extra.get("genres", ""),
        "poster_path": extra.get("poster_path", ""),
    }

def get_top_10_by_popularity():
    top = new_df.sort_values(by='popularity', ascending=False).head(10)
    return [enrich_movie(row) for _, row in top.iterrows()]

def get_top_10_by_rating():
    top = new_df.sort_values(by='vote_average', ascending=False).head(10)
    return [enrich_movie(row) for _, row in top.iterrows()]

def get_top_10_by_genre():
    genre_top10 = {}
    df = new_df.copy()
    df['genres'] = df['genres'].apply(lambda x: x.split('|') if isinstance(x, str) else [])

    # Only include the following genres:
    selected_genres = [
        "Action", "Drama", "Comedy", "Romance", "Crime", "Thriller", "Animation",
        "Family", "Fantasy", "Horror", "Mystery", "Documentary"
    ]

    for genre in selected_genres:
        filtered = df[df['genres'].apply(lambda x: genre in x)]
        top10 = filtered.sort_values(by='vote_average', ascending=False).head(10)
        genre_top10[genre] = [enrich_movie(row) for _, row in top10.iterrows()]

    return genre_top10

def username_exists(username):
    return User.query.filter_by(username=username).first() is not None

def create_new_user(username, password):
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

def get_user_by_username(username):
    return User.query.filter_by(username=username).first()


# --------------------- API Endpoints ---------------------

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Missing query parameter"}), 400

    query = query.strip().lower()
    results = []

    for key, details in MOVIE_DATASET.items():
        if query in key:
            # 🔽 Parse genres safely
            genres = details.get('genres', [])
            if isinstance(genres, str):
                genres = [genre.strip() for genre in genres.split(',') if genre.strip()]

            results.append({
                "title": details.get('title', ''),
                "overview": details.get('overview', ''),
                "genres": genres,
                "writers": details.get('writers', ''),
                "directors": details.get('directors', ''),
                "cast": details.get('cast', []),
                "poster_path": details.get('poster_path', 'NA'),
                "popularity": details.get('popularity', 0.0)  # ✅ Add this for frontend sorting
            })

    if not results:
        return jsonify({"message": "No movies found for your search."}), 404

    return jsonify({"results": results})


@app.route('/recommendations', methods=['GET'])
def recommendations():
    movie_name = request.args.get('movie')
    if not movie_name:
        return jsonify({"error": "Missing movie parameter"}), 400

    movie_name = movie_name.strip().lower()  # ✅ Normalize the input
    recs = get_recommendations(movie_name)
    return jsonify({"movie": movie_name, "recommendations": recs})

@app.route('/mood', methods=['GET'])
def mood():
    mood = request.args.get('mood')
    if not mood:
        return jsonify({"error": "Missing mood parameter"}), 400
    
    try:
        top_n = int(request.args.get('top_n', 25))
        results = recommend_by_mood(mood,top_n)
        if isinstance(results, str):
            return jsonify({"message": results}), 404
        
        recs = []
        for _, row in results.iterrows():
            title_key = row['title'].strip().lower()
            extra = MOVIE_DATASET.get(title_key, {})
            recs.append({
                "title": row['title'],
                "mood": row['mood'],
                "popularity": row['popularity'],
                "overview": extra.get('overview', ''),
                "genre": extra.get('genres', ''),
                "poster_path": extra.get('poster_path', ''),
            })
        return jsonify({"mood": mood, "recommendations": recs})
    except Exception as e:
        print("Error in mood recommendation:", e)
        return jsonify({"error": "Internal server error"}), 500
    
@app.route("/explore")
def explore():
    return jsonify({
        "popular": get_top_10_by_popularity(),   # ✅ no argument
        "top_rated": get_top_10_by_rating(),     # ✅
        "genres": get_top_10_by_genre()          # ✅
    })

@app.route('/movie_details', methods=['GET'])
def movie_details():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Missing query parameter"}), 400

    query = query.strip().lower()
    results = []

    for key, details in MOVIE_DATASET.items():
        if query in key:
            results.append({
                "title": details.get('title', ''),
                "overview": details.get('overview', ''),
                "genres": details.get('genres', ''),
                "writers": details.get('writers', ''),
                "directors": details.get('directors', ''),
                "cast": details.get('cast', []),
                "poster_path": details.get('poster_path', 'NA'),  # default placeholder
                # ADD THESE FIELDS:
                "release_date": details.get('release_date', 'N/A'),
                "runtime": details.get('runtime', 'N/A'),
                "original_title": details.get('original_title', 'N/A'),
                "adult": details.get('adult', False),
                "spoken_languages": details.get('spoken_languages', 'N/A'),
                "production_countries": details.get('production_countries', 'N/A'),
                "budget": details.get('budget', 'N/A'),
                "revenue": details.get('revenue', 'N/A'),
                "vote_count": details.get('vote_count', 'N/A'),
                "vote_average": details.get('vote_average', 'N/A'),
                "production_companies": details.get('production_companies', 'N/A')
            })

    if not results:
        return jsonify({"message": "No movies found for your search."}), 404

    return jsonify({"results": results})

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Add logic to create a new user (e.g., hash the password, store in the database)
    # If the user already exists, return an error message.
    
    # For simplicity, here's a placeholder response.
    if username_exists(username):
        return jsonify({"message": "Username already taken."}), 400
    
    # Assuming you save the new user in your database
    create_new_user(username, password)  # Example function

    return jsonify({"message": "User created successfully!"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Add logic to validate the user's credentials (e.g., check if username exists, verify password)
    
    user = get_user_by_username(username)  # Example function to get user by username
    
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid username or password"}), 400

    # If valid, generate a token or session to authenticate the user
    # Example: return a token for future authentication
    return jsonify({"message": "Login successful!"}), 200

@app.route('/logout', methods=['POST'])
def logout():
    try:
        return jsonify({"message": "Logout successful!"}), 200
    except Exception as e:
        print(f"Logout error: {e}")
        return jsonify({"message": "Server error during logout"}), 500

@app.route('/watchlist/add', methods=['POST'])
def add_to_watchlist():
    try:
        data = request.get_json()
        print(data)  # For debugging

        username = data.get('username')
        movie_title = data.get('title', '').strip().lower()
        status = data.get('status', 'Plan to Watch')  # New line
        rating = data.get('rating')  # New line

        if not username or not movie_title:
            return jsonify({'message': 'Missing username or movie_title'}), 400

        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404

        if Watchlist.query.filter_by(user_id=user.id, movie_title=movie_title).first():
            return jsonify({'message': 'Movie already in watchlist'}), 400

        # Updated: Pass status and rating
        entry = Watchlist(
            user_id=user.id,
            movie_title=movie_title,
            status=status,
            rating=rating
        )
        db.session.add(entry)
        db.session.commit()
        return jsonify({'message': 'Movie added to watchlist'}), 201
    except Exception as e:
        print(f"Error adding to watchlist: {e}")
        db.session.rollback()
        return jsonify({'message': 'Server error'}), 500

@app.route('/watchlist', methods=['GET'])
def view_watchlist():
    username = request.args.get('username')
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    entries = Watchlist.query.filter_by(user_id=user.id).all()

    # Collect movies + stats
    watchlist = []
    stats = {
        'total': len(entries),
        'Plan to Watch': 0,
        'Watching': 0,
        'Completed': 0,
        'Dropped': 0
    }

    for entry in entries:
        movie = get_movie_details(entry.movie_title)
        if movie:
            movie['status'] = entry.status
            movie['rating'] = entry.rating
            watchlist.append(movie)
            if entry.status in stats:
                stats[entry.status] += 1

    # Placeholder: recently viewed
    #recently_viewed = []  # Future enhancement

    return jsonify({
        'user': {
            'username': user.username,
            # 'email': user.email,  # Include if your model has it
        },
        'stats': stats,
        #'recently_viewed': recently_viewed,
        'watchlist': watchlist
    })


@app.route('/watchlist/remove', methods=['POST'])
def remove_from_watchlist():
    try:
        data = request.get_json()
        username = data.get('username')
        movie_title = data.get('movie_title')

        if not username or not movie_title:
            return jsonify({'message': 'Username and movie_title are required'}), 400

        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404

        movie_title_clean = movie_title.strip().lower()

        entry = Watchlist.query.filter_by(user_id=user.id, movie_title=movie_title_clean).first()
        if not entry:
            return jsonify({'message': 'Movie not in watchlist'}), 404

        db.session.delete(entry)
        db.session.commit()

        return jsonify({'message': 'Movie removed from watchlist'}), 200

    except Exception as e:
        print(f"Error removing from watchlist: {e}", flush=True)
        db.session.rollback()
        return jsonify({'message': 'Server error'}), 500

@app.route('/recommend_from_watchlist', methods=['GET'])
def recommend_from_watchlist():
    username = request.args.get('username')
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    entries = Watchlist.query.filter_by(user_id=user.id).all()
    movie_titles = [e.movie_title for e in entries]

    all_recs = []
    for title in movie_titles:
        recs = get_recommendations(title)
        all_recs.extend(recs)

    seen = set()
    unique_recs = []
    for rec in all_recs:
        if rec['title'] not in seen:
            seen.add(rec['title'])
            unique_recs.append(rec)

    return jsonify({'recommendations': unique_recs[:20]})

@app.route('/user/stats', methods=['GET'])
def user_stats():
    username = request.args.get('username')
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    watchlist = user.watchlist  # adjust if different structure

    stats = {
        'total': len(watchlist),
        'plan_to_watch': sum(1 for m in watchlist if m.status == 'Plan to Watch'),
        'completed': sum(1 for m in watchlist if m.status == 'Completed'),
        'watching': sum(1 for m in watchlist if m.status == 'Watching'),
        'dropped': sum(1 for m in watchlist if m.status == 'Dropped'),
    }
    return jsonify(stats)

@app.route('/user/recently_viewed', methods=['GET'])
def user_recently_viewed():
    username = request.args.get('username')
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Assuming user.recently_viewed is a list of Movie objects
    recent_movies = user.recently_viewed[-6:]  # last 6 movies
    result = []
    for movie in recent_movies:
        result.append({
            'title': movie.title,
            'poster_path': movie.poster_path
        })
    return jsonify({'recently_viewed': result})

responses = {
    "hello": "Hello! How can I assist you today?",
    "hi": "Hi there! What can I do for you?",
    "hey": "Hey! Need any help?",
    "good morning": "Good morning! How can I help you?",
    "good afternoon": "Good afternoon! What can I do for you?",
    "good evening": "Good evening! How may I assist you?",
    "bye": "Goodbye! Have a great day!",
    "goodbye": "See you later! Take care.",
    "see you": "Catch you later! If you need anything, I'm here.",
    "thank you": "You're welcome! Happy to help.",
    "thanks": "No problem! Let me know if you need anything else.",
    "thanks a lot": "Anytime! I'm here to assist you.",
    "how are you": "I'm just a bot, but I'm functioning as expected!",
    "what is your name": "I'm MovieBot, your personal movie assistant.",
    "are you a robot": "Yes, I'm an AI-powered chatbot designed to help you.",
    "are you real": "I'm real in the digital sense! Here to assist you.",
    "recommend a movie": "Sure! Have you seen 'Inception' or 'The Dark Knight'? They're great choices!",
    "suggest a comedy": "You might enjoy 'The Hangover' or 'Superbad' for some laughs.",
    "suggest a drama": "Consider watching 'The Shawshank Redemption' or 'Forrest Gump'.",
    "suggest a horror": "If you're into horror, 'Get Out' and 'The Conjuring' are popular picks.",
    "who directed inception": "Christopher Nolan directed 'Inception'.",
    "when was titanic released": "'Titanic' was released in 1997.",
    "who starred in the matrix": "'The Matrix' starred Keanu Reeves, Laurence Fishburne, and Carrie-Anne Moss.",
    "what is the capital of france": "The capital of France is Paris.",
    "who is the president of the united states": "As of my knowledge cutoff in September 2021, the president is Joe Biden.",
    "what is the weather today": "I'm not equipped with real-time data, but you can check a reliable weather website for the latest updates.",
    "tell me a joke": "Why don't scientists trust atoms? Because they make up everything!",
    "make me laugh": "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "what can you do": "I can provide movie recommendations, answer general questions, and chat with you!",
    "help": "Sure! Ask me about movies, general knowledge, or just have a chat.",
    "default": "Sorry, I didn't quite get that. Could you rephrase?"
}


# --------------------- App Initialization ---------------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        load_movie_dataset()
    app.run(debug=True)