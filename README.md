# An Advanced Approach to Movie recommendation system

A full-stack Movie Recommendation System that leverages both **Content-Based** and **Collaborative Filtering** techniques. Built using **React** (frontend) and **Flask** (backend), this system offers personalized movie suggestions, mood-based filters, watchlist management, and more.

## 🛠️ Tech Stack

### Backend
- Flask
- Pandas, NumPy
- Scikit-learn
- NLTK
- Surprise (for KNN-based Collaborative Filtering)

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios

### Others
- Jupyter Notebook (`movie_recommendation.ipynb`) for prototyping
- TMDb IMDB Dataset (for movie metadata and posters)
- MovieLens dataset (for user ratings)
- LocalStorage/AuthContext for user sessions

---

## 📁 Project Structure

```bash
.
├── backend/                 # Flask backend
│   ├── app.py              # Main API server
│   └── recommendation.py   # Recommendation logic
├── frontend/                 # Static files (React)
    ├── src/                    # React frontend source
│       ├── components/         # Reusable UI components
│       ├── pages/              # Route-based components
│       └── App.jsx           # Entry point
    ├── tailwind.config.js    # Tailwind setup
├── Datas/                  # Preprocessed datasets
├── movie_recommendation.ipynb  # EDA + model building
└── README.md               # Project documentation
````

---

## 🚀 Features

* 🔍 **Search Functionality**: Look up movies by title and get a list of matching results.
* 🌟 **Personalized Recommendations**: Based on user ratings and content similarity.
* 😊 **Mood-based Filtering**: Suggests movies based on emotional tone (e.g., happy, sad, thriller).
* 🎭 **Genre and Actor Filters**: Narrow down based on genres or cast.
* 🛒 **Watchlist Feature**: Add and manage movies you want to watch later.
* 📊 **Dynamic Ratings**: Rate movies and improve recommendations over time.
* 🎞️ **Detailed Movie Pages**: Poster, metadata, overview, cast & crew, and similar titles.

---

## 📂 Dataset Used
The project uses the following datasets for training and evaluation:

* **https://www.kaggle.com/datasets/garymk/movielens-25m-dataset** — Used only ratings.csv and movies.csv for collaborative filtering. Later used links.csv file to link between collaborative filtering dataset and content based filtering dataset on the basis of TMDB id.

* **https://www.kaggle.com/datasets/alanvourch/tmdb-movies-daily-updates?resource=download&select=TMDB_all_movies.csv** — Movie details, genres, cast, and crew information.

## ⚙️ Setup Instructions

### 🔧 Backend Setup (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Use venv\Scripts\activate for Windows
pip install -r requirements.txt
python app.py
```

### 🌐 Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

Make sure to connect both the frontend and backend (`http://localhost:3000` ↔ `http://localhost:5000`) by modifying `axios` base URLs in your React code.

---

## 📊 Model Details

* **Content-Based Filtering**: TF-IDF Vectorizer on metadata (title, genres, cast, crew).
* **Collaborative Filtering**: KNN with cosine similarity using Surprise library on MovieLens dataset.
* **Hybrid Approach**: Final recommendations are weighted blends of both models.

---

## 📓 Notebook (EDA + Prototyping)

The `movie_recommendation.ipynb` file contains:

* Exploratory Data Analysis (EDA)
* Feature engineering
* TF-IDF and KNN implementation
* Evaluation metrics
* Sample recommendation outputs

---

## 📸 Screenshots

![M6](https://github.com/user-attachments/assets/ddbf379e-1fe0-4342-961c-3e4dfb0e9450)
![M1](https://github.com/user-attachments/assets/d9b67c2a-dd81-4637-928f-7b83a10975d8)
![M2](https://github.com/user-attachments/assets/d545c082-65ec-4279-aef7-e146823ddcdf)
![M3](https://github.com/user-attachments/assets/6b51a47c-ed8e-444c-b6a0-79e491628c96)
![M4](https://github.com/user-attachments/assets/b2dd2065-3def-41c0-b713-ff72b6f7c4e0)
![M5](https://github.com/user-attachments/assets/39eda73a-6de2-4e20-9654-a11c37d6513f)

---

## 👩‍💻 Team Members

* **Pranami Mitra**
* **Prashasti Nanda**
* **Shubhashree Pal**
* **Archishmita Ghorai**

---

## 📚 References

* [TMDb API](https://www.themoviedb.org/documentation/api)
* [MovieLens Dataset](https://grouplens.org/datasets/movielens/)
* [Surprise Library](https://surpriselib.com/)

---

## 📄 License

This project is for educational purposes only. All media and data used belong to their respective owners.
