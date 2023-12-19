from io import BytesIO
import numpy as np
import tensorflow as tf
from PIL import Image
from tensorflow.keras.applications.imagenet_utils import decode_predictions
import cv2
model = None


def load_model_func():
    """
    This function loads classification model which is saved before.
    
    Returns:
        model(tf.keras.model): Classification model 
    
    
    """
    model_path = 'C:\\Users\\Beytullah\\Desktop\\dentai\\backend\\model\\cross_validated_model_last.h5'
    model = tf.keras.models.load_model(model_path)
    return model


def predict(image: Image.Image):
    """
    This function predicts a series of dental conditions using the given image.

    Parameters:
        image (Image.Image) : An image of type Image.Image.
    
    Returns: 
        results(dict): A dictionary containing the prediction results.
    
    """
    
    
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
    """
    Reads an image file from BytesIO and returns it as a PIL Image.

    Parameters:
    - file: BytesIO
        A BytesIO object containing the image file.

    Returns:
    Image.Image
        A PIL Image object representing the image.
    """
    image = Image.open(BytesIO(file))
    return image
