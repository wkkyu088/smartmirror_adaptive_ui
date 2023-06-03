from flask import Flask, jsonify
from flask_cors import CORS
from pathlib import Path
import cv2
import dlib
import sys
import numpy as np
from wide_resnet import WideResNet
from keras.utils.data_utils import get_file
from scipy import stats
import time

app = Flask(__name__)
CORS(app)

pretrained_model = "https://github.com/yu4u/age-gender-estimation/releases/download/v0.5/weights.28-3.73.hdf5"

import cv2

modhash = 'fbe63257a054c1c5466cfd7bf14646d6'
    
# Initialize Webcam
camera = cv2.VideoCapture(0)
        
@app.route('/detect_age', methods=['GET'])
def detect_age():
    start_time = time.time()
    
    # Define our model parameters
    depth = 16
    k = 8
    weight_file = None
    margin = 0.4

    # Get our weight file 
    if not weight_file:
        weight_file = get_file("weights.28-3.73.hdf5", pretrained_model, cache_subdir="pretrained_models",
                            file_hash=modhash, cache_dir=Path(sys.argv[0]).resolve().parent)
    # load model and weights
    model = WideResNet(64, depth=depth, k=k)()
    model.load_weights(weight_file)

    detector = dlib.get_frontal_face_detector() 
        
    print("Multi :: Detecting...")
    resultArray = []
    while len(resultArray)<5 :
        success, frame = camera.read()
        frame = cv2.flip(frame,1)
        if not success:
            cv2.waitKey()
            break  
            
        input_img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img_h, img_w, _ = np.shape(input_img)
        detected = detector(frame, 1)
        faces = np.empty((len(detected), 64, 64, 3))
        
        if len(detected) > 0:
            d = detected[0]
            x1, y1, x2, y2, w, h = d.left(), d.top(), d.right() + 1, d.bottom() + 1, d.width(), d.height()
            xw1 = max(int(x1 - margin * w), 0)
            yw1 = max(int(y1 - margin * h), 0)
            xw2 = min(int(x2 + margin * w), img_w - 1)
            yw2 = min(int(y2 + margin * h), img_h - 1)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
            faces[0, :, :, :] = cv2.resize(frame[yw1:yw2 + 1, xw1:xw2 + 1, :], (64, 64))

            # make a prediction for Age and Gender
            results = model.predict(np.array(faces))
            ages = np.arange(0, 101).reshape(101, 1)
            predicted_ages = results[1].dot(ages).flatten()
            
            age = int(predicted_ages[0])
            print('Age:', age, 'Coordinates:', [x1, y1, x2, y2])                
            
            result = {'age': int(age), 'y': float(yw1)}
            resultArray.append(result)
    
    trimmed_age = stats.trim_mean([d['age'] for d in resultArray], 0.1)
    trimmed_y = stats.trim_mean([d['y'] for d in resultArray], 0.1)
    
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"Elapsed time: {elapsed_time:.2f} seconds")
    print("Multi :: Done")
    return jsonify({'age': int(trimmed_age), 'y': float(trimmed_y)})

@app.route('/')
def hello():
    return "Hello World!"
        
if __name__ == '__main__':
    app.run(debug=True)
    camera.release()  