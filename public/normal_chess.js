let teams = [
    {
        id: 0,
        color: "00f9d0",
        pieces : [
            ["t", "h", "b", "q", "k", "b", "h", "t"],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
        ]
    },
    {
        id: 1,
        color: "fa6e6e",
        pieces : [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            ["t", "h", "b", "q", "k", "b", "h", "t"],
        ]
    },
]

pieces = []
var c = document.getElementById("board");
var ctx = c.getContext("2d");


function draw_rect(x1, y1, width, heigth, color) {
    ctx.beginPath();
    if (color) ctx.fillStyle = color;
    ctx.fillRect(x1, y1, heigth, width);
}

async function httpGetAsync(url) {
    var xmlHttp = new XMLHttpRequest();
    let p = new Promise((resolve, reject) => {
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                resolve(xmlHttp.responseText);
        }
    });
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
    return p;
}

async function load_image(piece_name, color) {
    var img = new Image;
    let p = new Promise((resolve, reject) => {
        img.onload = function () {
            resolve(img)
        };
    });
    img.src = `./piece_image?color=${color}&piece=${piece_name}`;
    return p;
}



async function main() {
    let chess_pieces = await httpGetAsync(`./chess_pieces`);
    chess_pieces = JSON.parse(chess_pieces);

    let sprites = {};
    for (let i = 0; i < teams.length; i++) {
        for (const [url, name] of Object.entries(chess_pieces)) {
            let image = load_image(url, teams[i].color)
            if (!sprites[name]) sprites[name] = {}
            sprites[name][teams[i].id] = image;
        }
    }

    let i = 0;
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            let color = (y + x) % 2 ? "#000000" : "#FFFFFF"
            draw_rect(x * 37.5, y * 37.5, 37.5, 37.5, color);
        }
    }

    for (let i = 0; i < teams.length; i++) {
        let team = teams[i]
        for (let y = 0; y < teams[i].pieces.length; y++) {
            if(!pieces[y]) pieces[y] = {}
            for (let x = 0; x < teams[i].pieces[y].length; x++) {
                let piece_name = team.pieces[y][x]
                if (piece_name) {
                    let sprite = sprites[piece_name][team.id]
                    pieces[y][x] = new piece(x, y, team.color, team.id)
                    if (sprite) {
                        ctx.drawImage(await sprite, x * 37.5, y * 37.5, 37.5, 37.5);
                    }
                }else{
                    if(!pieces[y][x]) pieces[y][x] = null
                }
            }
        }
    }
}
main()
