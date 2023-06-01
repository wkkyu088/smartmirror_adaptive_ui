from flask import Flask, jsonify
from flask_cors import CORS
from pathlib import Path
import cv2
import dlib
import sys
import numpy as np
import cvlib as cv
from wide_resnet import WideResNet
from keras.utils.data_utils import get_file
from keras.preprocessing.image import img_to_array

app = Flask(__name__)
CORS(app)

pretrained_model = "https://github.com/yu4u/age-gender-estimation/releases/download/v0.5/weights.28-3.73.hdf5"

import cv2

modhash = 'fbe63257a054c1c5466cfd7bf14646d6'

def draw_label(image, point, label, font=cv2.FONT_HERSHEY_SIMPLEX,
               font_scale=0.8, thickness=1):
    size = cv2.getTextSize(label, font, font_scale, thickness)[0]
    x, y = point
    cv2.rectangle(image, (x, y - size[1]), (x + size[0], y), (255, 0, 0), cv2.FILLED)
    cv2.putText(image, label, point, font, font_scale, (255, 255, 255), thickness, lineType=cv2.LINE_AA)
    


# Initialize Webcam
camera = cv2.VideoCapture(0)

@app.route('/detect_age', methods=['GET'])
def detect_age():
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
    
    # while cv2.waitKey(1)<0 :
    #     success, frame = camera.read()
    #     frame = cv2.flip(frame,1)
    #     if not success:
    #         cv2.waitKey()
    #         break  
        
    #     preprocessed_faces_emo = []           
    
    #     input_img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    #     img_h, img_w, _ = np.shape(input_img)
        
    #     faces, _ = cv.detect_face(frame)
    #     detected = detector(frame, 1)
    #     faces = np.empty((len(detected), img_size, img_size, 3))
        
    #     preprocessed_faces_emo = []
    #     if len(faces) > 0:
    #         x1, y1, x2, y2 = faces[0]

    #         try:
    #             faceArea = cv2.resize(frame[y1:y2 + 1, x1:x2 + 1, :], (64, 64))
    #         except cv2.error as e:
    #             print("Error occurred while resizing image:", e)
    #             continue
            
    #         face =  frame[y1:y2 + 1, x1:x2 + 1, :]
    #         face_gray_emo = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
    #         face_gray_emo = cv2.resize(face_gray_emo, (48, 48), interpolation = cv2.INTER_AREA)
    #         face_gray_emo = face_gray_emo.astype("float") / 255.0
    #         face_gray_emo = img_to_array(face_gray_emo)
    #         face_gray_emo = np.expand_dims(face_gray_emo, axis=0)
    #         preprocessed_faces_emo.append(face_gray_emo)

    #         # make a prediction for Age and Gender
    #         results = model.predict(np.array(faceArea).reshape(-1, 64, 64, 3))
            
    #         predicted_genders = results[0]
    #         ages = np.arange(0, 101).reshape(101, 1)
    #         predicted_ages = results[1].dot(ages).flatten()
            
    #         age = int(predicted_ages[0])
    #         gender = "Female" if predicted_genders[0][0] > 0.4 else "Male"
    #         print('Age:', age, ', Gender:', gender, ', Coordinates:', faces[0])                
            
    #         result = {'age': int(age), 'gender': gender, 'y': float(faces[0][1])}
    #         return jsonify(result)
    
    while cv2.waitKey(1)<0 :
        success, frame = camera.read()
        frame = cv2.flip(frame,1)
        if not success:
            cv2.waitKey()
            break  
        
        preprocessed_faces_emo = []           
    
        input_img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img_h, img_w, _ = np.shape(input_img)
        detected = detector(frame, 1)
        faces = np.empty((len(detected), 64, 64, 3))
        
        preprocessed_faces_emo = []
        if len(detected) > 0:
            d = detected[0]
            x1, y1, x2, y2, w, h = d.left(), d.top(), d.right() + 1, d.bottom() + 1, d.width(), d.height()
            xw1 = max(int(x1 - margin * w), 0)
            yw1 = max(int(y1 - margin * h), 0)
            xw2 = min(int(x2 + margin * w), img_w - 1)
            yw2 = min(int(y2 + margin * h), img_h - 1)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
            faces[0, :, :, :] = cv2.resize(frame[yw1:yw2 + 1, xw1:xw2 + 1, :], (64, 64))
            face =  frame[yw1:yw2 + 1, xw1:xw2 + 1, :]
            face_gray_emo = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
            face_gray_emo = cv2.resize(face_gray_emo, (48, 48), interpolation = cv2.INTER_AREA)
            face_gray_emo = face_gray_emo.astype("float") / 255.0
            face_gray_emo = img_to_array(face_gray_emo)
            face_gray_emo = np.expand_dims(face_gray_emo, axis=0)
            preprocessed_faces_emo.append(face_gray_emo)

            # make a prediction for Age and Gender
            results = model.predict(np.array(faces))
            predicted_genders = results[0]
            ages = np.arange(0, 101).reshape(101, 1)
            predicted_ages = results[1].dot(ages).flatten()
            
            age = int(predicted_ages[0])
            gender = "Female" if predicted_genders[0][0] > 0.4 else "Male"
            print('Age:', age, ', Gender:', gender, ', Coordinates:', [x1, y1, x2, y2])                
            
            result = {'age': int(age), 'gender': gender, 'y': float(yw1)}
            return jsonify(result)

@app.route('/')
def hello():
    return "Hello World!"
        
if __name__ == '__main__':
    app.run(debug=True)
    camera.release()  