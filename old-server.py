from flask import Flask, request, jsonify, send_file
from flask_restx import Api, Resource, fields
from groq import Groq
import requests
import json
import os
from datetime import datetime

app = Flask(__name__)
api = Api(app, version='1.0', title='Groq API Server',
    description='A simple API server for Groq language model interactions and image generation')

# Create namespaces
ns_ask = api.namespace('ask', description='Operations using Groq client')
ns_image = api.namespace('image', description='Image generation operations')

# Define models for Swagger documentation
question_model = api.model('Question', {
    'question': fields.String(required=True, description='The question to ask the AI model')
})

image_request_model = api.model('ImageRequest', {
    'prompt': fields.String(required=True, description='The prompt for image generation'),
    'style_id': fields.Integer(required=True, description='Style ID for the image', default=3),
    'size': fields.String(required=True, description='Size of the image', default='1-1')
})

response_model = api.model('Response', {
    'response': fields.String(description='The AI model response')
})

error_model = api.model('Error', {
    'error': fields.String(description='Error message')
})

# Initialize the Groq client
client = Groq(
    api_key="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",
    base_url="https://api.groq.com"
)

def ask_groq(question):
    """
    Send a question to Groq and get a response
    """
    try:
        completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": question
                }
            ],
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            temperature=0.7,
            max_tokens=1024,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"


def generate_and_save_images(prompt, style_id=3, size="1-1"):
    """
    Generate and save images based on the prompt
    """
    # Create a directory for images if it doesn't exist
    output_dir = f"generated_images"
    os.makedirs(output_dir, exist_ok=True)

    # API request setup
    url = "https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php"
    payload = {"prompt": prompt, "style_id": style_id, "size": size}
    headers = {
        "x-rapidapi-key": "e031b11786mshe9e282c6898c550p114463jsnbcf6a8607eab",
        "x-rapidapi-host": "ai-text-to-image-generator-flux-free-api.p.rapidapi.com",
        "Content-Type": "application/json",
    }

    try:
        # Generate images
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        result = response.json()

        saved_images = []
        # Download each generated image
        for image in result["final_result"]:
            try:
                # Get the image from the origin URL
                img_response = requests.get(image["origin"])
                img_response.raise_for_status()

                # Create filename
                filename = f"image_{image['index']}.webp"
                filepath = os.path.join(output_dir, filename)

                # Save the image
                with open(filepath, "wb") as f:
                    f.write(img_response.content)
                saved_images.append({
                    "filename": filename,
                    "path": filepath
                })

            except requests.exceptions.RequestException as e:
                return {"error": f"Error downloading image {image['index']}: {str(e)}"}, 500

        return {"message": "Images generated successfully", "images": saved_images}

    except requests.exceptions.RequestException as e:
        return {"error": f"Error generating images: {str(e)}"}, 500

@ns_ask.route('')
class AskResource(Resource):
    @ns_ask.expect(question_model)
    @ns_ask.response(200, 'Success', response_model)
    @ns_ask.response(400, 'Error', error_model)
    def post(self):
        """
        Ask a question using the Groq client
        """
        data = request.get_json()
        if not data or 'question' not in data:
            return {"error": "Please provide a question"}, 400
        
        response = ask_groq(data['question'])
        return {"response": response}

@ns_image.route('/generate')
class ImageResource(Resource):
    @ns_image.expect(image_request_model)
    @ns_image.response(200, 'Success')
    @ns_image.response(400, 'Error', error_model)
    def post(self):
        """
        Generate images based on a prompt
        """
        data = request.get_json()
        if not data or 'prompt' not in data:
            return {"error": "Please provide a prompt"}, 400
        
        style_id = data.get('style_id', 3)
        size = data.get('size', '1-1')
        
        result = generate_and_save_images(data['prompt'], style_id, size)
        return result

@ns_image.route('/image/<filename>')
class ImageFileResource(Resource):
    def get(self, filename):
        """
        Get a generated image by filename
        """
        filepath = os.path.join('generated_images', filename)
        if not os.path.exists(filepath):
            return {"error": "Image not found"}, 404
        return send_file(filepath, mimetype='image/webp')

if __name__ == '__main__':
    app.run(debug=True, port=5000) 