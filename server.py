from flask import Flask, send_file, make_response, send_from_directory
from flask_cors import CORS
import os
app = Flask(__name__)
CORS(app)

m = {
    'strongs': True,
    'all': True,
    'booknames': True,
}


@app.route("/api/<id>")
def all(id):
    if not id in m:
        return make_response('file not found', 404)

    # TODO rename all to bible
    if id == 'all':
        response = make_response(send_file("../data/json.gz/all.json.gz"))
        response.headers['Content-Type'] = 'application/json'
        response.headers['Content-Encoding'] = 'gzip'
        return response

    if id == 'booknames':
        response = make_response(
            send_file("../data/json.gz/booknames.json.gz"))
        response.headers['Content-Type'] = 'application/json'
        response.headers['Content-Encoding'] = 'gzip'
        return response

    if id == 'strongs':
        response = make_response(
            send_file("../data/strongs.json.gz/all.json.gz"))
        response.headers['Content-Type'] = 'application/json'
        response.headers['Content-Encoding'] = 'gzip'
        return response


@app.route("/")
def home():
    return send_from_directory('build', "index.html")


# Route to add static files (CSS and JS)
@app.route("/<path:path>")
def base(path):
    if os.path.exists(os.path.join('build', path)):
        return send_from_directory('build', path)
    else:
        return send_from_directory('build', 'index.html')


if __name__ == '__main__':
    app.run(host="localhost", port=5000)
