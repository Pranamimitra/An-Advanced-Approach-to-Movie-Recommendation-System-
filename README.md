# 🎬 An Advanced Approach to Movie Recommendation System

This project showcases a **hybrid movie recommendation system** combining **content-based filtering** and **collaborative filtering (KNN with cosine similarity)**. Designed as part of an academic and portfolio-building exercise, it provides accurate, diverse movie suggestions based on metadata and user preferences.

> Built using Python | Pandas | Scikit-learn | Seaborn | Matplotlib | Jupyter Notebook

---

## 📌 Table of Contents

- [📌 Table of Contents](#-table-of-contents)
- [🚀 Project Overview](#-project-overview)
- [📊 Features](#-features)
- [📂 Datasets Used](#-datasets-used)
- [🛠️ Tech Stack & Libraries](#️-tech-stack--libraries)
- [💻 Setup Instructions](#-setup-instructions)
- [📈 Visualizations](#-visualizations)
- [🔎 Key Concepts Implemented](#-key-concepts-implemented)
- [📷 Screenshots & Demo](#-screenshots--demo)
- [🧠 Future Improvements](#-future-improvements)
- [📬 Contact](#-contact)

---

## 🚀 Project Overview

This system is designed to simulate how real-world streaming platforms (like Netflix or Prime Video) offer intelligent recommendations. Instead of relying on just movie tags or viewer history, this hybrid approach improves accuracy by blending two perspectives:

- **Content-based**: Uses TF-IDF on genres, overviews, cast, director, etc.
- **Collaborative filtering**: Finds users/movies with similar ratings using cosine similarity on the MovieLens dataset.

---

## 📊 Features

✅ Movie recommendation engine with hybrid logic  
✅ Interactive data exploration via notebook  
✅ Similarity heatmaps for visual comparison  
✅ Personalized top-N recommendation bar plots  
✅ Flow diagram of the system pipeline  
✅ Data preprocessing and feature engineering  
✅ Clean modular code ready for scaling

---

## 📂 Datasets Used

- 🎥 [TMDB & IMDb Merged Movies Dataset](https://www.kaggle.com/datasets/ggtejas/tmdb-imdb-merged-movies-dataset)  
- ⭐ [MovieLens 25M Ratings Dataset](https://www.kaggle.com/datasets/garymk/movielens-25m-dataset)

> ⚠️ Download and place these datasets in a `/data` folder in the root directory.

---

## 🛠️ Tech Stack & Libraries

- **Languages**: Python  
- **Libraries**:  
  - Data: `pandas`, `numpy`
  - ML & Similarity: `scikit-learn`
  - Visualization: `matplotlib`, `seaborn`
  - Notebook environment: `Jupyter`

---

## 💻 Setup Instructions

1. **Clone this repo:**

   ```bash
   git clone https://github.com/Pranamimitra/An-Advanced-Approach-to-Movie-Recommendation-System-.git
   cd An-Advanced-Approach-to-Movie-Recommendation-System-
