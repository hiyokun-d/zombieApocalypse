let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
const score = document.querySelector("#score")
const start = document.querySelector("#start")
const modelbutton = document.getElementById("modal")
const scoreED = document.getElementById("scoreED")

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = "black"

class player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;

    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fill()
        ctx.closePath()
    }
}

class projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity

    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fill()
        ctx.closePath()
    }

    uptade() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}
class enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity

    }

    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fill()
        ctx.closePath()
    }

    uptade() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity
        this.alpha = 1

    }

    draw() {
        ctx.save()
        ctx.globalAlpha = 0.1
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }

    uptade() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}




const y = innerHeight / 2
const x = innerWidth / 2

let players = new player(x, y, 30, "white");
let ammo_array = []
let enemy_array = []
let particles = []



function spawner() {
     setInterval(() => {
        const radius = Math.random() * (30 - 9) + 9

        let x;
        let y;
        
        if(Math.random < 0.5) {
         x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
         y = Math.random() * canvas.height
        //  y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        } else {
            x = Math.random() * canvas.width
            // y = Math.random() * canvas.height
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const color = "green"
        const angle = Math.atan2( canvas.height / 2 - y, canvas.width / 2 - x)

        const velocity = {x: Math.cos(angle), y: Math.sin(angle)}
        enemy_array.push(new enemy(x, y, radius, color, velocity))
     }, 1000)
}




let animationId;
let scoring = 0

function init() {
    players = new player(x, y, 30, "white");
    ammo_array = []
    enemy_array = []
    particles = []
    scoring = 0
}
function animate() {
    const animationId = requestAnimationFrame(animate)
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    players.draw()
    ammo_array.forEach((projectile, index) => {
        projectile.uptade()

        particles.forEach((particle, index) => {
            if(particle.alpha <= 0) {
                particles.splice(index, 1)
            }
            particle.uptade()
        })
        if(projectile.x + projectile.radius < 0 ||
             projectile.x - projectile.radius > canvas.width ||
              projectile.y + projectile.radius < 0 ||
               projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                ammo_array.splice(index, 1)
            }, 0)
        }
    })

    enemy_array.forEach((enemy , index) => {
        enemy.uptade()
        const dist = Math.hypot(players.x - enemy.x, players.y - enemy.y)

        if(dist -enemy.radius - players.radius < 1) {
            cancelAnimationFrame(animationId)
            modelbutton.style.display = 'flex'
            scoreED.innerHTML = scoring
        }
        ammo_array.forEach((projectile, projectileindex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            //kill the enemy
            if(dist -enemy.radius - projectile.radius < 1) {

                scoring += 1
                score.innerHTML = scoring
                for(let i = 0; i < 8; i++) {
                    particles.push(new particle(projectile.x, projectile.y, 3, "red", {
                        x: Math.random() - 0.5,
                        y: Math.random() - 0.5
                    }))
                }
                if(enemy.radius - 15 > 5) {
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        ammo_array.splice(projectileindex, 1)
                    }, 0)
                } else {
                    setTimeout(() => {
                        console.log(score)
                        enemy_array.splice(index, 1)
                        ammo_array.splice(projectileindex, 1)
                    }, 0)
                }
                
        }
        })
    })
}

window.addEventListener("click", (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)

    const velocity = {x: Math.cos(angle) * 7, y: Math.sin(angle)* 7}
    ammo_array.push(new projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity))
})


start.addEventListener("click", () => {
   init()
    animate()
    spawner()
modelbutton.style.display = "none"
})