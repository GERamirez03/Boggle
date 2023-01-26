from flask import Flask, request, render_template, session, jsonify, Response
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

boggle_game = Boggle()
game_board = boggle_game.make_board()

# words = boggle_game.words

app = Flask(__name__)
app.config['SECRET_KEY'] = "my-boggle"

debug = DebugToolbarExtension(app)

@app.route('/')
def show_board():
    session['board'] = game_board
    return render_template('board.html', game_board = game_board)


@app.route('/handle-guess')
def handle_guess():

    guess = request.args.get("guess", "ABCDEFGHIJKLMNOPQRSTUVWXYZ")

    result = boggle_game.check_valid_word(game_board, guess)

    response = { "result": result }

    return jsonify(response)

@app.route('/handle-results', methods=["POST"])
def track_results():

    #increment number of times played
    former_num_plays = session.get("num_plays", 0)
    session['num_plays'] = former_num_plays + 1

    
    #update high score if necessary
    # new_score = request.json['score']
    new_score = int(request.args['score'])
    current_high_score = session.get("high_score", 0)

    #if new_score > current_high_score: 
    session['high_score'] = max(new_score, current_high_score)

    response = { "num_plays": session['num_plays'], "high_score": session['high_score'] }

    # json = { "num_plays": 1, "high_score" : 1}

    return jsonify(response)

    # Response(response, mimetype="application/json")
    
    #jsonify(response)

    # request.json

    # return request.json['score']

    # #increment number of times played
    # former_num_plays = session.get("num_plays", 0)
    # session['num_plays'] = former_num_plays + 1

    
    # #update high score if necessary
    # new_score = request.json['score']
    # current_high_score = session.get("high_score", 0)
    # if new_score > current_high_score: session['high_score'] = new_score #if new_score > current_high_score else #...

    # response = { "num_plays": session['num_plays'], "high_score": session['high_score'] }
    # return jsonify(response)
