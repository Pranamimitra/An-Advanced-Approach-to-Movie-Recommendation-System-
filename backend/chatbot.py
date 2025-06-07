import os
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
import requests

load_dotenv()

chatbot_bp = Blueprint('chatbot', __name__)
API_KEY = os.getenv("OPENROUTER_API_KEY")
API_URL = "https://openrouter.ai/api/v1/chat/completions"

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

@chatbot_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    payload = {
        "model": "mistralai/mistral-7b-instruct",  # You can try "openai/gpt-3.5-turbo" too
        "messages": [
            {"role": "system", "content": "You are a helpful movie assistant who recommends movies and answers questions about cinema.Give crisp answers. No need to elaborate. Answers need to be to the point. Respond in 4 lines."},
            {"role": "user", "content": user_message}
        ]
    }

    try:
        response = requests.post(API_URL, headers=HEADERS, json=payload)
        response_data = response.json()
        print(response_data)

        # Debug: Print full response
        print("OpenRouter response:", response_data)

        if "choices" in response_data:
            reply = response_data["choices"][0]["message"]["content"]
            return jsonify({"reply": reply})
        elif "error" in response_data:
            return jsonify({"reply": f"Error: {response_data['error']['message']}"})
        else:
            return jsonify({"reply": "Something went wrong. No reply from assistant."})

    except Exception as e:
        print("OpenRouter error:", e)
        return jsonify({"reply": "Sorry, something went wrong while contacting the assistant."})
