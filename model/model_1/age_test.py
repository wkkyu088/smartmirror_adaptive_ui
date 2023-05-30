from flask import Flask, jsonify
from flask_cors import CORS
import cv2
import cvlib as cv

app = Flask(__name__)
CORS(app)

camera = cv2.VideoCapture(0)

@app.route('/detect_age', methods=['GET'])
def detect_age():
    ageProto="age_deploy.prototxt"
    ageModel="age_net.caffemodel"
    genderProto="gender_deploy.prototxt"
    genderModel="gender_net.caffemodel"

    MODEL_MEAN_VALUES=(78.4263377603, 87.7689143744, 114.895847746)
    genderList=['Male','Female']

    ageNet=cv2.dnn.readNet(ageModel,ageProto)
    genderNet=cv2.dnn.readNet(genderModel,genderProto)


    while cv2.waitKey(1)<0 :
        success, frame = camera.read()
        frame = cv2.flip(frame,1)
        if not success:
            cv2.waitKey()
            break
                
        faces, _ = cv.detect_face(frame)
        result = {}
        
        if len(faces) > 0:
            x, y, x2, y2 = faces[0]
            
            faceArea = frame[y:y2, x:x2]
            
            blob=cv2.dnn.blobFromImage(faceArea, 1.0, (227,227), MODEL_MEAN_VALUES, swapRB=False)
            genderNet.setInput(blob)
            genderPreds = genderNet.forward()
            gender = genderList[genderPreds[0].argmax()]
            print(f'Gender: {gender}')

            ageNet.setInput(blob)
            agePreds = ageNet.forward()
            age = agePreds[0].argmax()
            print('Age:', age, ', Gender:', gender, ', Coordinates:', faces[0])
            
            result = {'age': int(age), 'gender': gender, 'y': float(faces[0][1])}
            return jsonify(result)
        
@app.route('/')
def hello():
    return "Hello World!"
        
if __name__ == '__main__':
    app.run(debug=True)
    camera.release()  