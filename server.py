from flask import Flask, jsonify
from flask_cors import CORS
import cv2
import cvlib as cv

app = Flask(__name__)
CORS(app)

camera = cv2.VideoCapture(0)

@app.route('/face_coordinates', methods=['GET'])
def get_face_coordinates():
    success, frame = camera.read()
    frame = cv2.flip(frame, 1)
    if not success:
        return jsonify({'error': 'Failed to read frame from camera.'})

    faces, _ = cv.detect_face(frame)
    face_coordinates = {}

    if len(faces) > 0:
        x, y, x2, y2 = faces[0]
        face_coordinates = {'x': float(x), 'y': float(y), 'width': float(x2 - x), 'height': float(y2 - y)}
        
    print(camera.isOpened())
    return jsonify(face_coordinates)

@app.route('/')
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run(debug=True)
    camera.release()  
