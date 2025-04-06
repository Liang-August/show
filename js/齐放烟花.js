let canvas=document.getElementById("canvas"),
ctx=canvas.getContext('2d'),

cw=window.innerWidth,
ch=window.innerHeight,

fireworks=[],

particles=[],

hue=10,

mx,my,

limiterTotal=80,
limiterNow=0;


canvas.width=cw;
canvas.height=ch;

function random(min,max){
    return Math.random()*(max-min)+min
}

function calculateDistance(p1x,p1y,p2x,p2y){
    let xDistance=p1x-p2x,
    yDistance=p1y-p2y;
    return Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance,2))
}

function Firework(sx,sy,tx,ty){
    this.x=sx
    this.y=sy

    this.sx=sx
    this.sy=sy
    this.tx=tx
    this.ty=ty

    this.distanceToTarget=calculateDistance(sx,sy,tx,ty)

    this.distanceTraveled=0

    this.angle=Math.atan2(ty-sy,tx-sx)

    this.speed=1

    this.acceleration=1.04

    this.brightness=random(50,70)

    this.targetRadius=0.1

    this.coordinateCount=1
    this.coordinates=[]

    while(this.coordinateCount--){
        this.coordinates.push([this.x,this.y ])
    }
}

Firework.prototype.draw=function(){
    ctx.beginPath()
        ctx.moveTo(this.coordinates[this.coordinates.length-1][0],this.coordinates[this.coordinates.length-1][1])
        ctx.lineTo(this.x,this.y)
        ctx.strokeStyle='hsl('+hue+',100%,'+this.brightness+'%)'
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(this.tx,this.ty,this.targetRadius,0,Math.PI*2)
        ctx.stroke()
}
Firework.prototype.update=function(index){
    this.coordinates.pop()
    this.coordinates.unshift([this.x,this.y])

    if(this.targetRadius<8){
        this.targetRadius+=0.03
    }else{
        this.targetRadius=1
    }

    this.speed=this.speed*this.acceleration

    let vx=Math.cos(this.angle)*this.speed,
        vy=Math.sin(this.angle)*this.speed

    this.distanceTraveled=calculateDistance(this.sx,this.sy,this.x+vx,this.y+vy)
    if(this.distanceTraveled>=this.distanceToTarget){
        fireworks.splice(index,1)

 createParticle(this.tx,this.ty)
    }else{
    this.x+=vx
    this.y+=vy
    }
}

function particle(x,y){
    this.x=x
    this.y=y

    this.angle=random(0,Math.PI*2)

    this.speed=random(1,10)

    this.friction=0.95

    this.gravity=1

    this.hue=random(hue-20,hue+20)

    this.brightness=random(50,80)

    this.alpha=1

    this.decay=random(0.015,0.03)

    this.coordinates=[]
    this.coordinateCount=setrandom()
    while(this.coordinateCount--){
        this.coordinates.push([this.x,this.y])
    }
}
particle.prototype.draw=function(){
    ctx.beginPath()
        ctx.moveTo(this.coordinates[this.coordinates.length-1][0],this.coordinates[this.coordinates.length-1][1])
        ctx.lineTo(this.x,this.y)
        ctx.strokeStyle='hsl('+hue+',100%,'+this.brightness+'%,'+this.alpha+')'
        ctx.stroke()
}
particle.prototype.update=function(index){
    this.coordinates.pop()
    this.coordinates.unshift([this.x,this.y])
    
    this.speed*=this.friction
    
    this.x+=Math.cos(this.angle)*this.speed
    this.y+=Math.sin(this.angle)*this.speed+this.gravity

    this.alpha-=this.decay
    if(this.alpha<=this.decay){
        particles.splice(index,1)

    }
}

function createParticle(x,y){
    let particleCount=setrandom()
    while(particleCount--){
        particles.push(new particle(x,y))
    }
}

function setrandom(){
    return Math.floor(Math.random()*52.0+131.4)
}

function run(){
    hue++
    ctx.fillStyle='reba(0,0,0,0.5)'
    ctx.fillRect(0,0,cw,ch)
    var i=fireworks.length
    while(i--){
        fireworks[i].draw()
        fireworks[i].update(i)
        // fireworks.push( new Firework(cw/2,ch,random(0,cw),random(0,ch/2)))
    }
    var k=particles.length
    while(k--){
        particles[k].draw()
        particles[k].update(k)
    }
    if(limiterNow>=limiterTotal){
        fireworks.push( new Firework(cw/2,ch,random(0,cw),random(0,ch/2)))
        limiterNow=0
    }else{
        limiterNow+=52.0
    }
}

canvas.addEventListener('mousedown',function(e){
    mx=e.pageX-canvas.offsetLeft
    my=e.pageY-canvas.offsetTop
    fireworks.push( new Firework(cw/2,ch,mx,my))
})
setInterval(run,33)

