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
- TMDb API (for movie metadata and posters)
- LocalStorage/AuthContext for user sessions

---

## 📁 Project Structure

```bash
.
├── backend/                 # Flask backend
│   ├── app.py              # Main API server
│   └── recommendation.py   # Recommendation logic
├── public/                 # Static files (React)
├── src/                    # React frontend source
│   ├── components/         # Reusable UI components
│   ├── pages/              # Route-based components
│   └── App.jsx             # Entry point
├── Datas/                  # Preprocessed datasets
├── movie_recommendation.ipynb  # EDA + model building
├── tailwind.config.js      # Tailwind setup
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

> (Add screenshots here of Home Page, Recommendations Page, Search Results, and Movie Details)

---

## 👩‍💻 Team Members

* **Pranami Mitra**
* **Prashasti Nanda**
* **Shubhashree Pal**
* **Archishmita Ghorai**

> Roles and contributions can be added in a separate section if needed.

---

## 📚 References

* [TMDb API](https://www.themoviedb.org/documentation/api)
* [MovieLens Dataset](https://grouplens.org/datasets/movielens/)
* [Surprise Library](https://surpriselib.com/)

---

## 📄 License

This project is for educational purposes only. All media and data used belong to their respective owners.
