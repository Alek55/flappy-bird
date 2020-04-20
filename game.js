const cvs = document.getElementById('bird')
const ctx = cvs.getContext('2d')

let frames = 0

const sprite = new Image()
sprite.src = 'img/sprite.png'

const bird = {
    rotation: 0,
    speed: 0,
    gravity: 0.25,
    jump: 4.6,
    animation: [
        {sX: 276, sY: 112}, //крылья bird in sprite в 1 позиции
        {sX: 276, sY: 139}, //крылья bird in sprite во 2 позиции
        {sX: 276, sY: 164}, //крылья bird in sprite в 3 позиции
        {sX: 276, sY: 139}, //крылья bird in sprite вновь во 2 позиции(взмах вверх обратно)
    ],
    x: 50,
    y: 150,
    w: 34,
    h: 26,
    frame: 0,

    draw() {
        let bird = this.animation[this.frame]

        ctx.save()
        ctx.translate(this.x, this.y) // точка, относительно которой будет поворот - origin
        ctx.rotate(this.rotation)

        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w / 2, - this.h / 2, this.w, this.h)
        // поделили на 2, чтобы координаты были по середине птицы

        ctx.restore()
    },

    update() {
        this.period = state.current == state.getReady ? 10 : 5 // если игра в режиме меню, то взмахи крыльев будут меняться медленнее - каждые 10 кадров
        this.frame += frames % this.period == 0 ? 1 : 0 // каждые 5 кадров фрейм птицы будет меняться - взмахи крыльев
        this.frame = this.frame % this.animation.length
        /*
        * animation frames length = 4
        * frame from 0 to 3
        * module:
        * 0 / 4 = 0
        * 1 / 4 = 1
        * 2 / 4 = 2
        * 3 / 4 = 3
        * next increment most than count element in animation array, and we need reset frame to 0
        * 4 / 4 = 0
        * и все пойдет по кругу
        * */
        if(state.current == state.getReady) {
            this.y = 150
            this.rotation = getRadian(0)
        }
        else {
            this.speed += this.gravity
            this.y += this.speed

            // if the bird will touch the front bg is game over
            //this.y + this.h / 2 - bottom bird
            if(this.y + this.h / 2 >= cvs.height - fg.h) {
                this.y = cvs.height - fg.h - this.h / 2
                if(state.current == state.game) state.current = state.over
            }
            if(this.speed >= this.jump) {
                this.rotation = getRadian(90)
                this.frame = 1
            }
            else {
                this.rotation = getRadian(-25)
            }
        }
    },

    flap() {
        this.speed = -this.jump
    }
}

function getRadian(deg) {
    return deg * (Math.PI / 180)
}

const gameOver = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: cvs.width / 2 - 225 / 2,
    y: 90,
    draw() {
        if(state.current == state.over) ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        // в спрайте показываем область начиная с координаты sX sY и размером w h
        // и отображаем спрайтовую область на канвасе начиная с координат x y размером w h
    }
}

const bg = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 226,
    x: 0,
    y: cvs.height - 226,
    draw() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
    }
}

const fg = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: cvs.height - 112,
    dx: 2,
    draw() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
    },
    update() {
        if(state.current == state.game) {
            this.x = (this.x - this.dx) % (this.w / 2)
        }
    }
}

const getReady = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: cvs.width / 2 - 173 / 2,
    y: 80,
    draw() {
        if(state.current == state.getReady) ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    }
}

const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

const pipes = {
    bottom: {
        sX: 502,
        sY: 0
    },
    top: {
        sX: 553,
        sY: 0
    },
    w: 53,
    h: 400,
    gap: 85, //промежуток между столбами по вертикали
    dx: 2,
    maxYPos: -150, // координаты по y будут в диапозоне от -150 до -300
    position: [],

    draw() {

    },

    update() {

    },
}

cvs.addEventListener('click', (event) => {
    switch (state.current) {
        case state.getReady:
            state.current = state.game
            break
        case state.game:
            bird.flap()
            break
        case state.over:
            state.current = state.getReady
            break
    }
})

function draw() {
    ctx.fillStyle = '#70c5ce'
    ctx.fillRect(0, 0, cvs.width, cvs.height)

    bg.draw()
    fg.draw()
    bird.draw()
    getReady.draw()
    gameOver.draw()
}

function update() {
    bird.update()
    fg.update()
}

function loop() {
    update()
    draw()
    frames++
    requestAnimationFrame(loop)
}

loop()