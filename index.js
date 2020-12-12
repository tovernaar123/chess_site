const express = require('express')
const app = express()
const path = require('path')
let root_path = path.join(__dirname, 'public')
const fs = require('fs')
const sharp = require('sharp');

app.get('/piece_image', async function (req, res, next) {
    let params = req.query;
    let file = path.join(root_path, params['piece'])
    let color = "#" + params["color"]
    let data = await sharp(file).tint(color).toBuffer();
    res.end(data)

});
app.get('/piece_configs', async function (req, res, next) {
    let params = req.query;
    let file = path.join(__dirname, "public/configs", params['name'])
    let color = "#" + params["color"]
    let data = await sharp(file).tint(color).toBuffer();
    res.end(data)

});
app.get('/chess_pieces', function (req, res, next) {
    res.json(
        {
            "white_pown.png": "p",
            "white_king.png": "k",
            "white_horse.png": "h",
            "white_bishop.png": "b",
            "white_queen.png": "q",
            "white_tower.png": "t",
        }
    )
});

app.get('*', function (req, res, next) {
    var options = {
        root: root_path,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
            'Cache-Control': 'no-cache',
        }
    }
    var fileName;
    try {
        fileName = decodeURIComponent(req.url)
    } catch (e) {
        next(e)
    }
    if (fs.existsSync(path.join(root_path, fileName))) {
        res.sendFile(fileName, options, function (err) {
            if (err) {
                next(err)

            } else {
                console.log('Sent:', fileName)
            }
        });
    } else {
        res.sendFile('index.html', options, function (err) {
            if (err) {
                next(err)

            } else {
                console.log('Sent:', 'index')
            }
        });
    }
});


app.listen(80)