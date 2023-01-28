const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.height = 576;
canvas.width = 1024;

ctx.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})
const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x:0,
        y:0,
    },
    velocity:{
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/samuraiMack/Idle.png',
    framesMax: 8,
    scale:2.5,
    offset: {
        x: 215,
        y:157
    },
    sprites:{
        idle:{
            imageSrc:'./img/samuraiMack/samuraiMack/Idle.png',
            framesMax: 8
        },
        run:{
            imageSrc:'./img/samuraiMack/samuraiMack/Run.png',
            framesMax: 8,

        },
        jump:{
            imageSrc:'./img/samuraiMack/samuraiMack/Jump.png',
            framesMax: 2,

        },
        fall:{
            imageSrc:'./img/samuraiMack/samuraiMack/Fall.png',
            framesMax: 2,

        },
        attack1:{
            imageSrc:'./img/samuraiMack/samuraiMack/Attack1.png',
            framesMax: 6,

        },
        takeHit:{
            imageSrc:'./img/samuraiMack/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4,

        },
        death: {
            imageSrc:'./img/samuraiMack/samuraiMack/Death.png',
            framesMax: 6

        }
    },
    attackBox:{
        offset: {
           x: 100,
           y: 50 
        },
        width: 140,
        height: 50
    }

})

const enemy = new Fighter({
    position: {
        x:400,
        y:100
    },
    velocity: {
        x:0,
        y:0,
    },
    offset: {
        x: -50,
        y: 0
    },
    color: 'blue',
    imageSrc: './img/kenji/kenji/Idle.png',
    framesMax: 4,
    scale:2.5,
    offset: {
        x: 215,
        y:167
    },
    sprites:{
        idle:{
            imageSrc:'./img/kenji/kenji/Idle.png',
            framesMax: 4
        },
        run:{
            imageSrc:'./img/kenji/kenji/Run.png',
            framesMax: 8,

        },
        jump:{
            imageSrc:'./img/kenji/kenji/Jump.png',
            framesMax: 2,

        },
        fall:{
            imageSrc:'./img/kenji/kenji/Fall.png',
            framesMax: 2,

        },
        attack1:{
            imageSrc:'./img/kenji/kenji/Attack1.png',
            framesMax: 4,

        },
        takeHit: {
            imageSrc: './img/kenji/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc:'./img/kenji/kenji/Death.png',
            framesMax: 7

        }
    },
    attackBox:{
        offset: {
           x: -170,
           y: 50 
        },
        width: 170,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    background.update()
    shop.update();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update();
    enemy.update();
    

    player.velocity.x = 0
    enemy.velocity.x = 0
    //player movements
    
    if (keys.a.pressed && player.lastkey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
    }else if (keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    }else {
        player.switchSprite('idle')
    }
//jumping
    if (keys.w.pressed && player.lastkey === 'w'){
        player.velocity.y = -10
    }
    if (player.velocity.y < 0){
        player.switchSprite('jump')
    }else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }
    //enemy movements
    if(keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }else if(keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }
    else {
        enemy.switchSprite('idle')
    }
    //jumping enemy
    if (keys.ArrowUp.pressed && enemy.lastkey === 'ArrowUp'){
        enemy.velocity.y = -10
    }
    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }
    //detect collision & enemy gets hit
    if ( 
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        })&&
        player.isAttacking && player.framesCurrent  === 4
        ){
        enemy.takeHit()
        player.isAttacking = false
        gsap.to('#enemyHealth',{
            width: enemy.health + '%'
        })
    }

    //if player misses
    if (player.isAttacking && player.framesCurrent == 4){
        player.isAttacking = false
    }
    //this is where our player gets hit
    if ( 
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        })&&
        enemy.isAttacking && 
        enemy.framesCurrent == 2
        ){
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth',{
            width: player.health + '%'
        })
    }

    if (enemy.isAttacking && enemy.framesCurrent == 2){
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player,  enemy, timerId})
    }

}

animate()

window.addEventListener('keydown' , (event) => {
    switch (event.key){
        case 'd':
            keys.d.pressed = true
            player.lastkey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastkey = 'a'
            break
        case 'w':
            keys.w.pressed = true
            player.lastkey = 'w'
            break
        case " ":
            player.attack()
            break

        //2nd player
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastkey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastkey = 'ArrowLeft'
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            enemy.lastkey = 'ArrowUp'
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }

})

window.addEventListener('keyup' , (event) => {
    switch (event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            lastkey = 'w'
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            enemy.lastkey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            enemy.lastkey = 'ArrowLeft'
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            enemy.lastkey = 'ArrowUp'
            break
        
    }

})