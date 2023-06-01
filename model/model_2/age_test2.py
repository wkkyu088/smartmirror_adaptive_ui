from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
import os
import cv2
import cvlib as cv
from keras.models import load_model

app = Flask(__name__)
CORS(app)

os.environ["OPENCV_VIDEOIO_PRIORITY_MSMF"] = "0"
camera = cv2.VideoCapture(0)

@app.route('/detect_age', methods=['GET'])
def detect_age():
    print("detect_age")
    multi_model = load_model("weights.28-3.73.hdf5")

    while cv2.waitKey(1)<0 :
        success, frame = camera.read()
        frame = cv2.flip(frame,1)
        if not success:
            cv2.waitKey()
            break  
        
        faces, _ = cv.detect_face(frame)
        
        if len(faces) > 0:
            x, y, x2, y2 = faces[0]

            try:
                faceArea = cv2.resize(frame[y-40:y2+20, x-40:x2+20], (64, 64))
            except cv2.error as e:
                print("Error occurred while resizing image:", e)
                continue
            result = multi_model.predict(faceArea.reshape(-1,64,64,3))

            age = int(np.argmax(result[1], axis=1)[0]+1)
            gender = "Male" if np.argmax(result[0], axis=1)[0]==1 else "Female"
            print('Age:', age, ', Gender:', gender, ', Coordinates:', faces[0])                
            
            result = {'age': int(age), 'gender': gender, 'y': float(faces[0][1])}
            return jsonify(result)
        
@app.route('/')
def hello():
    return "Hello World!"
        
if __name__ == '__main__':
    app.run(debug=True)
    camera.release()  