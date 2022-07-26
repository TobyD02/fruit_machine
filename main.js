const canvas = document.getElementById('canvas')

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

canvas.width = 600
canvas.height = 303

const options = {
    'cherry': {
        score: 1,
        image: new Image(),
        img_src: 'cherry.png'
    },
    'lemon': {
        score: 2,
        image: new Image(),
        img_src: 'lemon.png'
    },
    'bar': {
        score: 5,
        image: new Image(),
        img_src: 'bar.png'
    },
    'diamond': {
        score: 7,
        image: new Image(),
        img_src: 'diamond.png'
    },
    '7': {
        score: 10,
        image: new Image(),
        img_src: '7.png'
    }
}


// Setting images to sources
Object.entries(options).forEach(e => {
    e[1].image.src = e[1].img_src
})

// display information
display_info()

let spinning = false;
let boardState = []
let active_rows = []
let evaluated = false;

let maxTick = 100
let currentTick = maxTick
let totalScore = 0

// Set inital board state
for (let i = 0; i < 3; i++) {
    let row = []
    for (let j = 0; j < 3; j++) {
        let l = Object.keys(options).length
        let choice = Object.keys(options)[Math.floor(Math.random() * l)]
        row.push(choice)
    }
    boardState.push(row)
}

// boardState = [['diamond', 'diamond', 'diamond'], ['diamond', 'diamond', 'diamond'], ['diamond', 'diamond', 'diamond']]

function spin() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let l = Object.keys(options).length
            let choice = Object.keys(options)[Math.floor(Math.random() * l)]
            boardState[i][j] = choice
        }
    }
}

function evalutate() {
    let wins = 0
    let winning_rows = []

    for (let row = 0; row < boardState.length; row++) {
        let entry = boardState[row][0]
        let winning = true;
        for (let c = 0; c < boardState[row].length; c++) {
            if (boardState[row][c] != entry) winning = false
        }
        if (winning) {
            wins += options[entry].score
            winning_rows.push(row)
        }
    }

    return [wins>0, wins, winning_rows]
}

let x = 0

function main() {

    ctx.fillStyle='yellow'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    x++

    // Border
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let x = (canvas.width / 3)
            let y = (canvas.height / 3)
            ctx.strokeRect(x * i, y * j, x * (i + 1), y * (j + 1))
        }
    }

    if (spinning) {
        spin()
        currentTick -= 1
        if (currentTick <= 0) {
            spinning = false 
            currentTick = 0
        }
    } else if (!evaluated) {
        let s = evalutate()
        setScore(s)
        active_rows = s[2]
        evaluated = true;
    }

    // Draw images
    for (let i = 0; i < boardState.length; i++) {
        for (let j = 0; j < boardState[i].length; j++) {
            draw_image(j, i, boardState[i][j])
        }
    }

    // Draw winning row bar
    if (active_rows.length > 0) {
        for (let i = 0; i < active_rows.length; i++) {
            ctx.fillStyle = 'red'
            ctx.fillRect(canvas.width / 12, (canvas.height / 3 * active_rows[i]) + canvas.height / 6 - 5, (canvas.width / 12) * 10, 5)
        }
    }

    requestAnimationFrame(main)
}

function press_button() {
    if (!spinning) {
        spinning = true;
        currentTick = maxTick
        evaluated = false
        active_rows = []
    }
}

function setScore(score) {
    totalScore += score[1]
    let score_head = document.getElementById('score_head')
    score_head.innerHTML = `Score: ${totalScore}`
}

function draw_image(x, y, option) {
    let xpos = (canvas.width/3) * x + (canvas.width/6) - options[option].image.width/2
    let ypos = (canvas.height/3) * y + (canvas.height/6) - options[option].image.height/2

    ctx.drawImage(options[option].image, xpos, ypos)
}

function display_info() {
    let info_container = document.getElementById('info_container')
    Object.entries(options).forEach(option => {
        let div = document.createElement('div')
        div.className = 'descriptor'
        div.innerHTML = `value: ${option[1].score}`

        div.appendChild(option[1].image)
        info_container.appendChild(div)
    })
}

main()