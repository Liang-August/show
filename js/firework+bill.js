let canvas=document.getElementById("canvas"),
ctx=canvas.getContext('2d'),

cw=window.innerWidth,
ch=window.innerHeight,

fireworks=[],

particles=[],

hue=1,

mx,my,

limiterTotal=setrandom()/13.14,
limiterNow=0


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
        this.targetRadius+=0.4
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
        limiterNow++
    }
}

canvas.addEventListener('mousedown',function(e){
    mx=e.pageX-canvas.offsetLeft
    my=e.pageY-canvas.offsetTop
    fireworks.push( new Firework(cw/2,ch,mx,my))
})
setInterval(run,33)







const getQueryVariable=(variable)=>{
    let query=window.location.search.substring(1);
    let vars=query.split("&")
    for(let i=0;i<vars.length;i++){
        let pair=vars[i].split('=')
        if(pair[0]==variable){
            return decodeURI(pair[1])
        }
    }
    return false;
}

{(text)=>{
    let t=getQueryVariable("t");
    if(t){
        text.innerHTML=t;
    }
}}(document.querySelector("#text"))


const settings={
    length:5200,
    duration:3,
    velocity:90,
    effect:-1.3,
    size:9,
    color:'pink'
}



const Point = (()=>{
function Point(x,y){
    this.x=typeof x !== "undefined"? x:0;
    this.y=typeof y !== "undefined"? y:0;
}
Point.prototype.clone =function(){
    return new Point(this.x,this.y)
}
    Point.prototype.length=function(length){
        if(typeof length=="undefined"){
            return Math.sqrt(this.x*this.x+this.y*this.y)
        }
            this.normalize();
            this.x*=length;
            this.y*=length;
            return this;

        }
        Point.prototype.normalize=function(){
            let length =this.length();
            this.x/=length;
            this.y/=length;
            return this;
        }
    return Point;
})();

     const Particle=(()=>{
    function Particle(){
        this.position=new Point();
        this.velocity=new Point();
        this.acceleration=new Point();
        this.age=0;
    }
    Particle.prototype.initialize=function(x,y,dx,dy){
        this.position.x=x;
        this.position.y=y;
        this.velocity.x=dx;
        this.velocity.y=dy;
        this.acceleration.x+=this.velocity.x*settings.effect;
        this.acceleration.y+=this.velocity.y*settings.effect;
        this.age=0;
    }
    Particle.prototype.update=function(deleteTime){
        this.position.x+=this.velocity.x*deleteTime;
        this.position.y+=this.velocity.y*deleteTime;
        this.velocity.x+=this.acceleration.x*deleteTime;
        this.velocity.y+=this.acceleration.y*deleteTime;
        this.age+=deleteTime;
    }
    Particle.prototype.draw=function(context,image){
        function ease(t){
            return --t*t*t;
            // return (1 - t) * t * t + 1;
        }
        let size=image.width*ease(this.age/settings.duration);
        context.globalAlpha=1-this.age/settings.duration;
        context.drawImage(
            image,
            this.position.x-size / 2,
            this.position.y-size/2,
            size,
            size
        )
    }
    return Particle;
})();

const ParticlePool=(()=>{
    let particles,
    firstActive =0,
    firstFree = 0,
    duration = settings.duration;


    function ParticlePool(length){
    particles = new Array(length);
    for (var i =0;i < particles.length; i++) {
        particles[i]= new Particle();
    }
    }


    ParticlePool.prototype.add =function(x,y,dx,dy){
    particles[firstFree].initialize(x,y,dx,dy);

    firstFree++;
    if(firstFree == particles.length) firstFree = 0;
    if(firstActive == firstFree) firstActive++;
    if(firstActive == particles.length) firstActive = 0;
    }

   ParticlePool.prototype.update = function(deltaTime){
        let i;

if(firstActive < firstFree){
    for(i = firstActive; i < firstFree; i++) particles[i].update(deltaTime)
}
if(firstFree < firstActive){
    for(i = firstActive; i < particles.length; i++)
        particles[i].update(deltaTime);
    for(i=0;i < firstFree; i++) particles[i].update(deltaTime);
}
while(particles[firstActive].age >= duration && firstActive != firstFree) {
    firstActive++;
    if(firstActive == particles.length) firstActive = 0;
    }
}
   ParticlePool.prototype.draw=function(context,image){
    if (firstActive < firstFree){
        for(i = firstActive; i<firstFree; i++)
            particles[i].draw(context,image);
    }
    if(firstFree < firstActive){
        for(i =firstActive; i< particles.length;i++)
            particles[i].draw(context,image);
        for(i=0;i < firstFree; i++) particles[i].draw(context, image);
    }
}
return ParticlePool;
})();


((canvas) => {
    let context = canvas.getContext("2d");
    let particles = new ParticlePool(settings.length);
    let particleRate = settings.length /settings.duration; 
    let times;
    function pointOnHeart(t){
    return new Point(
    160 * Math.pow(Math.sin(t),3),
    130 * Math.cos(t)-
    50 *Math.cos(2*t)-
    20 * Math.cos(3*t)-
    10 *Math.cos(4 *t)+
    25
    )
}
  const image = (function(){
    let canvas=document.createElement("canvas"),
    context=canvas.getContext("2d")
    canvas.width = settings.size;
    canvas.height = settings.size;

    function to(t){
        let point=pointOnHeart(t);
        point.x= settings.size/2 +(point.x*settings.size) / 350
        point.y= settings.size/2 -(point.y*settings.size) / 350
       return point;
    }
   context.beginPath();
   let t = -Math.PI;
   let point = to(t);

    context.moveTo(point.x, point.y);
    while (t < Math.PI) {
        t += 0.01;
    point = to(t);
    context.lineTo(point.x, point.y);
    }
    context.closePath();

    context.fillStyle = settings.color;
    context.fill()

let image=new Image();
image.src=canvas.toDataURL()
return image
})();


function render(){
 requestAnimationFrame(render);

let newTime =new Date().getTime()/ 1000;
let deltaTime = newTime - (times || newTime)
times = newTime;

context.clearRect(0,0,canvas.width, canvas.height);

var amount = particleRate * deltaTime;
for (var i=0; i < amount;i++){
    var pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
    var dir = pos.clone().length(settings.velocity);
    particles.add(
        canvas.width / 2 + pos.x,
        canvas.height / 2 - pos.y,
         dir.x,
        -dir.y
    )
}

particles.update(deltaTime);
particles.draw(context,image)
}
function onResize(){
canvas.width = canvas.clientWidth;
canvas.height=canvas.clientHeight;
}
window.onresize=onResize;
setTimeout(function(){
    onResize();
    render();
},10);
})(document.getElementById("heart"))