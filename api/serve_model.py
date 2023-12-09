from io import BytesIO
import numpy as np
import tensorflow as tf
from PIL import Image
from tensorflow.keras.applications.imagenet_utils import decode_predictions

model = None


def load_model_func():
    model_path = 'E:\\UNI\\dentai\\backend\\model\\cross_validated_model_last.h5'
    model = tf.keras.models.load_model(model_path)
    return model


def predict(image: Image.Image):
    global model
    if model is None:
        model = load_model_func()

    image = np.asarray(image.resize((150, 150)))[..., :3]
    image = np.expand_dims(image, 0)
    image = image / 255


    prediction=model.predict(image)
    
    class_probabilities=prediction[0]
    top_n_classes = np.argsort(class_probabilities)[-5:][::-1]

    results={}
    for i in top_n_classes:
        if i==0:
            formatted_prob = "{:.{}f}".format(class_probabilities[i], 8)
            print(f"Gingivitis: {formatted_prob}")
            results["Gingivitis"]=formatted_prob
        elif i==1:
            formatted_prob = "{:.{}f}".format(class_probabilities[i], 8)
            print(f"Hypodontia: {formatted_prob}")
            results["Hypodontia"]=formatted_prob
        elif i==2:
            formatted_prob = "{:.{}f}".format(class_probabilities[i], 8)
            print(f"Data Caries: {formatted_prob}")
            results["Tooth Decay"]=formatted_prob
        elif i==3:
            formatted_prob = "{:.{}f}".format(class_probabilities[i], 8)
            print(f"Calculus: {formatted_prob}")
            results["Calculus"]=formatted_prob
        elif i==4:
            formatted_prob = "{:.{}f}".format(class_probabilities[i], 8)
            print(f"Healthy: {formatted_prob}")
            results["Healthy"]=formatted_prob


    return results


def read_imagefile(file) -> Image.Image:
    image = Image.open(BytesIO(file))
    return image
