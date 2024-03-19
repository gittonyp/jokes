const express = require("express");
const https = require("https");
const app = express();

app.get("/", (req, res) => {
    // Make the HTTPS request to fetch a joke
    https.get("https://v2.jokeapi.dev/joke/Any", (apiRes) => {
        let data = '';

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            // Parse the received data (joke)
            const randomJoke = JSON.parse(data);
            
            // Log the joke to the console
            if (randomJoke.type == "single") {
                console.log(randomJoke.joke);
            } else {
                console.log(randomJoke.setup + "\n");
                console.log(randomJoke.delivery + "\n");
            }

            // Modify the HTML content with the fetched joke
            let htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Joke</title>
                </head>
                <body>
                    <center><h1>Joke of the Day</h1><br>
                    <h2>${randomJoke.type === "single" ? randomJoke.joke : `${randomJoke.setup}<br>${randomJoke.delivery}`}</h2></center>
                </body>
                </html>
            `;

            // Send the modified HTML content as the response
            res.send(htmlContent);
        });
    }).on("error", (err) => {
        console.error("Error fetching joke:", err.message);
        res.status(500).send("Internal Server Error");
    });
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
