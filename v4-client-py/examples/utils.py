
import json
import os

def loadJson(filename):
    current_directory = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(current_directory, filename)

    with open(json_file_path, "r") as file:
        return json.load(file)
