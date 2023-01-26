const BASE_URL = `http://127.0.0.1:5000`

const $guessForm = $("#guess-form");
const $userGuess = $("#user-guess");
const $submitButton = $("#submit");
const $guessResponse = $("#guess-response");
const $currentScore = $("#current-score");
const $timer = $("#timer");

function handleGuess(response) {
    if (response == "ok") {
        $guessResponse.text("Good eye!");
        const currentScore = parseInt($currentScore.text())
        const wordValue = $userGuess.val().length
        $currentScore.text(currentScore + wordValue)
    }
    else if (response == "not-on-board") {
        $guessResponse.text("That word's not on the board... :(");
    }
    else if (response == "not-a-word") {
        $guessResponse.text("Hey! That's not a word in our dictionary! >:(");
    }
}

async function submitGuess(event) {
    event.preventDefault();

    const guess = $userGuess.val();

    const response = await axios({
        url: `${BASE_URL}/handle-guess`,
        method: "GET",
        params: { guess: guess }
    });

    handleGuess(response.data.result);

    $guessForm.trigger("reset");

    return

}


$guessForm.on("submit", submitGuess);

async function sendResults() {
    const finalScore = parseInt($currentScore.text());

    const data = { score: finalScore }

    // const response = await $.ajax(`${BASE_URL}/handle-results`, {
    //     data : JSON.stringify(data),
    //     contentType: 'application/json',
    //     type: 'POST',
    // });

    // console.log(response)

    const response = await axios({
        method: 'post',
        url: `${BASE_URL}/handle-results`,
        headers: { contentType : 'application/json' },
        data: JSON.stringify(data), //{ score : JSON.stringify(data) }
    })

    // const response = await axios.post(
    //     `${BASE_URL}/handle-results`, {
    //         data: JSON.stringify(data)
    //         method: "POST",
    //         headers: { contentType: 'application/json' },
    //         // params: { score: finalScore },
    //         data: JSON.stringify(data)
    // });

    return response

}

let time = 20

const timer = setInterval(function() {
    console.log(time)
    $timer.text(time);
    time -= 1;

    if (time < -1) {
        clearInterval(timer);
        alert("Time's up!");
        $submitButton.attr("disabled", "disabled");
        sendResults();
    }
}, 1000)