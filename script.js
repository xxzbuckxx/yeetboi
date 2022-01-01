class Button{constructor(a,b,d,e){this.font=a;this.text=b;this.c1=d;this.c2=e;this.y=this.x=0;this.h=this.w=100}draw(){ctx.font=this.font;ctx.fillStyle=this.c2;ctx.fillText(this.text,this.x-this.w/2-3,this.y+this.h/2-3);ctx.fillStyle=this.c1;ctx.fillText(this.text,this.x-this.w/2,this.y+this.h/2)}check(a){let b=this.x-this.w/2,d=this.y-this.h/2;if(a.xmouse>b&&a.xmouse<b+this.w&&a.ymouse>d&&a.ymouse<d+this.h&&a.mouseDown)return effects.playing("btn")||effects.play("btn"),a.mouseDown=!1,!0}adjust(a,
b){ctx.font=this.font;this.w=ctx.measureText(this.text).width;this.h=parseInt(this.font.split(" ")[0],10);this.x=a;this.y=b}debug(){ctx.strokeStyle="black";ctx.strokeRect(this.x-this.w/2,this.y-this.h/2,this.w,this.h)}};const difficultyTable={2:{player:{speed:4,accel:.6,cool:5,health:1E3},enemy:{speed:.8,spawnWait:1,maxInst:10}},3:{player:{speed:4,accel:.4,cool:20,health:800},enemy:{speed:1,spawnWait:.8,maxInst:50}},4:{player:{speed:4,accel:.4,cool:40,health:500},enemy:{speed:1.5,spawnWait:.6,maxInst:100}},5:{player:{speed:4,accel:.4,cool:50,health:300},enemy:{speed:1.7,spawnWait:.6,maxInst:150}},6:{player:{speed:14,accel:1,cool:15,health:100},enemy:{speed:5,spawnWait:.1,maxInst:200}}};class EnemyController{constructor(){this.instances=[];this.spawnWait=this.maxInst=this.speed=this.cool=0}spawner(a,b,d){--this.cool;Enemies.instances.length<this.maxInst&&0>=this.cool&&(this.spawn(a,b,d),this.cool=this.spawnWait*G.fps)}spawn(a,b,d){let e=new Enemy(this.speed);e.spawn(a,b,d);this.instances.push(e)}draw(){this.instances.forEach(a=>a.draw())}controller(){for(let a=0;a<this.instances.length;a++)this.instances[a].state==en.state.dead?this.instances.splice(a,1):this.instances[a].controller()}}
class Enemy{constructor(a){this.y=this.x=0;this.h=this.w=50;this.ydir=this.xdir=0;this.pushMag=17;this.speed=a;this.target=null;this.distance=0;this.rcolors=["#81ea25","#6bba27","#96e84e","#abf966","#b9f981"];this.color=this.rcolors[0];this.state=en.state.spawn}spawn(a,b,d){if(null==a||null==b)b=a=500;let e=Math.random();.5>e?(this.x=.5>e?-this.w-5:a+5,e=Math.random(),this.y=e*(b+10)-5):(this.x=e*(a+10)-5,e=Math.random(),this.y=.5>e?-this.h-5:b+5);this.target=d;this.state=en.state.norm}draw(){if(this.state==
en.state.spawn)return 0;let a=this.x-this.w/2,b=this.y-this.h/2;ctx.lineWidth=1;this.color=this.rcolors[Math.round(2*Math.random())];ctx.fillStyle=this.color;null!=this.target&&this.state==en.state.norm&&(this.w=this.target.w/2-10,this.h=this.target.h-10);ctx.beginPath();ctx.moveTo(a-this.w/8,b);ctx.bezierCurveTo(a-this.w/8,b-this.h/4,a+this.w+this.w/8,b-this.h/4,a+this.w+this.w/8,b);ctx.bezierCurveTo(a+2*this.w,b,a+2*this.w,b+this.h,a+this.w-this.w/8,b+this.h);ctx.bezierCurveTo(a+this.w-this.w/8,
b+1.75*this.h,a-2*this.w,b+this.h/4,a,b+this.h/2);ctx.bezierCurveTo(a-this.w,b+this.h/2,a-this.w/2,b,a-this.w/8,b);ctx.fill();ctx.stroke();ctx.closePath();ctx.lineWidth=1;ctx.beginPath();ctx.fillStyle="black";ctx.arc(a+this.w/6,b+this.h/6,(this.w/4+this.h/4)/4,0,2*Math.PI);ctx.stroke();ctx.closePath();ctx.beginPath();ctx.arc(a+this.w-this.w/8,b+this.h/6,(this.w/4+this.h/4)/6,0,2*Math.PI);ctx.stroke();ctx.closePath();ctx.beginPath();ctx.moveTo(a+this.w/8,b+this.h);ctx.bezierCurveTo(a+this.h/8,b+this.h-
this.h/3,a+this.w-this.h/8,b+this.h-this.h/3,a+this.w-this.h/8,b+this.h);ctx.stroke();ctx.closePath()}controller(){switch(this.state){case en.state.norm:this.move();break;case en.state.dying:this.death(this.target)}}calculateDir(){if(null==this.target)return 0;let a=this.target.x-this.x,b=this.target.y-this.y;this.distance=Math.sqrt(a*a+b*b);0<this.distance&&(this.xdir=a/this.distance,this.ydir=b/this.distance)}move(){if(null==this.target)return 0;this.calculateDir();this.target.state==en.state.dead&&
(this.xdir=-this.xdir,this.ydir=-this.ydir);this.x+=this.xdir*this.speed;this.y+=this.ydir*this.speed;this.wiggle()}wiggle(){let a=.5<Math.random()?1:-1;this.x+=2*a;a=.5<Math.random()?1:-1;this.y+=2*a}death(a){this.w=Math.max(0,this.w-2);this.h=Math.max(0,this.h-3.9);if(0==this.w||0==this.h)50>a.power&&(a.power+=1),G.score++,this.state=en.state.dead}pushField(a){this.distance<a&&(this.x+=this.pushMag*-this.xdir,this.y+=this.pushMag*-this.ydir)}};const en={dir:{right:0,up:1,left:2,down:3},act:{norm:0,attack:1,push:2,regen:3},state:{spawn:-1,norm:0,damage:1,dying:2,dead:3}};function loop(a){window.requestAnimationFrame(a)}
class Game{constructor(){this.w=window.innerWidth;this.h=window.innerHeight;this.difficulty=5;this.tutorial=!1;this.score=0;this.highscore=this.getHighscore();this.fps=60;this.frame=0;this.paused=!1;this.pauseKeyRelease=!0;this.fxSound=1;this.musSound=.5}resizeWindow(){ctx.canvas.width=window.innerWidth;ctx.canvas.height=window.innerHeight;this.w=window.innerWidth;this.h=window.innerHeight}updateDifficulty(a,b,d){null!=d&&(this.difficulty=d);d=difficultyTable[this.difficulty].player;let e=difficultyTable[this.difficulty].enemy;
a.maxSpeed=d.speed;a.accel=d.accel;a.maxCool=d.cool;a.maxHealth=d.health;a.health=a.maxHealth;b.speed=e.speed;b.maxInst=e.maxInst;b.spawnWait=e.spawnWait}get time(){return Math.floor(this.frame/this.fps*100)/100}setTutorial(){window.localStorage.setItem("tutorial",this.tutorial)}getTutorial(){return null==window.localStorage.getItem("tutorial")?!1:!0}setHighscore(){this.score>this.highscore&&(this.highscore=this.score);window.localStorage.setItem("highscore",this.highscore)}getHighscore(){let a=window.localStorage.getItem("highscore");
return null==a?0:a}pause(a){a&&this.pauseKeyRelease?(this.pauseKeyRelease=!1,G.paused=!G.paused):a||this.pauseKeyRelease||(this.pauseKeyRelease=!0)}reset(a,b,d){a.health=a.maxHealth;a.power=0;a.cool=0;a.state=en.state.alive;a.action=en.state.norm;a.xvel=0;a.yvel=0;b.instances=[];d.instances=[];this.score=0}debug(){ctx.font="20px Arial Bold";ctx.color="black";let a=40,b=5*this.h/8+100,d=difficultyTable[this.difficulty].player,e=difficultyTable[this.difficulty].enemy;ctx.fillText("difficulty: "+this.difficulty,
a,b);b+=30;ctx.fillText("player: ",a,b);a+=30;b+=20;ctx.fillText("speed: "+d.speed,a,b);b+=20;ctx.fillText("accel: "+d.accel,a,b);b+=20;ctx.fillText("cool: "+d.cool,a,b);b+=20;ctx.fillText("health: "+d.health,a,b);b+=30;a-=30;ctx.fillText("enemy: ",a,b);a+=30;b+=20;ctx.fillText("speed: "+e.speed,a,b);b+=20;ctx.fillText("Spawn Rate: "+e.spawnWait+"s",a,b);b+=20;ctx.fillText("Max Number: "+e.maxInst,a,b);null!=Enemies&&ctx.fillText("Blobs: "+Enemies.instances.length,a,b+40)}};let trans_gameover={timer:0,duration:200};function GameoverTrans(){++G.frame;G.resizeWindow();trans_gameover.timer+=1;Stage.draw(G.w,G.h);P.draw();Enemies.draw();Enemies.controller();trans_gameover.timer>=trans_gameover.duration?(trans_gameover.timer=0,window.requestAnimationFrame(Gameover)):loop(GameoverTrans)}
function Gameover(){++G.frame;G.resizeWindow();gameover.draw();gameover.buttons.draw(0,0,G.w,G.h);gameover.buttons.restart.check(I)?(G.reset(P,Enemies,DP),P.x=G.w/2,P.y=G.h/2,window.requestAnimationFrame(main),mainTheme.playing()||mainTheme.play()):gameover.buttons.change_diff.check(I)?(G.reset(P,Enemies,DP),window.requestAnimationFrame(diffSelect),mainTheme.playing()||mainTheme.play()):loop(Gameover)}
let gameover={draw(){let a,b,d;ctx.fillStyle="red";ctx.font="30px Comic Sans MS";a="GAMEOVER";b=G.w/2-ctx.measureText(a).width/2;d=3*G.h/8;ctx.fillText(a,b,d);ctx.font="25px Comic Sans MS";a=`Score is ${G.score}`;b=G.w/2-ctx.measureText(a).width/2;d+=60;ctx.fillText(a,b,d);a=`Highscore is ${G.highscore}`;b=G.w/2-ctx.measureText(a).width/2;ctx.fillText(a,b,d+40)},buttons:{restart:new Button("25px Comic Sans MS","RESTART","red","black"),change_diff:new Button("25px Comic Sans MS","CHANGE DIFFICULTY",
"red","black"),draw(a,b,d,e){a=d/2;e=6*e/8;this.restart.adjust(a,e);this.restart.draw();this.change_diff.adjust(a,e+30);this.change_diff.draw()}}};class IO{constructor(){this.ymouse=this.xmouse=0;this.mouseDown=!1;this.keyState={right:!1,up:!1,left:!1,down:!1,attack:!1,push:!1,pause:!1};this.keyMap={39:"right",38:"up",37:"left",40:"down",68:"right",87:"up",65:"left",83:"down",32:"attack",81:"push",80:"pause"}}addKeyListeners(){document.addEventListener("keydown",this.keyDownHandler,!1);document.addEventListener("keyup",this.keyUpHandler,!1)}keyDownHandler(a){I.keyState[I.keyMap[a.keyCode]]=!0}keyUpHandler(a){I.keyState[I.keyMap[a.keyCode]]=
!1}mousePosition(a){I.xmouse=a.x-c.offsetLeft;I.ymouse=a.y-c.offsetTop;I.mouseDown=!0}addMouseListener(){document.addEventListener("click",this.mousePosition,!1)}};let c,ctx,G,I,P,DP,Enemies;function Init(){c=document.getElementById("canvas");ctx=c.getContext("2d");G=new Game;I=new IO;P=new Player(250,250,250,250);DP=new DPController;Enemies=new EnemyController;menu()}function main(){++G.frame;G.paused||update();G.pause(I.keyState.pause);draw();P.state==en.state.dead?(window.requestAnimationFrame(GameoverTrans),mainTheme.stop(),G.setHighscore()):loop(main)}
function update(){G.resizeWindow();P.state!=en.state.dead&&Enemies.spawner(G.w,G.h,P);P.controller(G.w,G.h,I.keyState,Enemies.instances,DP);Enemies.controller()}function draw(){ctx.clearRect(0,0,G.w,G.h);Stage.draw(G.w,G.h);P.draw();Enemies.draw();DP.controller();Stage.HUD(G.w,G.h,P);G.paused&&pauseMenu.draw(G.w,G.h)}window.addEventListener("DOMContentLoaded",()=>{Init()});function menu(){++G.frame;G.resizeWindow();let a=500<G.w?G.w/2-250:0,b=500<G.h?G.h/2-250:0;1==G.frame&&(I.addKeyListeners(),I.addMouseListener(),P.x=a+250,P.y=b+250);Stage.draw(G.w,G.h);P.title(a,b,500,500);Menu.drawBorder(a,b,a+500,b+500);P.draw();Menu.title.draw(a,b,500,500);Menu.title.buttons.draw(a,b,500,500);Menu.title.buttons.start.check(I)?(Menu.difficulty.buttons.generate(a,b,500,500),G.getTutorial()?window.requestAnimationFrame(diffSelect):(G.updateDifficulty(P,Enemies,3),window.requestAnimationFrame(MenuTrans)),
mainTheme.play()):loop(menu)}function diffSelect(){++G.frame;G.resizeWindow();let a=500<G.w?G.w/2-250:0,b=500<G.h?G.h/2-250:0;Stage.draw(G.w,G.h);P.title(a,b,500,500);Menu.drawBorder(a,b,a+500,b+500);P.draw();Menu.difficulty.draw(a,b,500,500);Menu.difficulty.buttons.draw(a,b,500,500);Menu.difficulty.buttons.check(I)?window.requestAnimationFrame(MenuTrans):loop(diffSelect)}let transTimer=0,transDuration=100;
function MenuTrans(){++G.frame;G.resizeWindow();transTimer+=1;let a=500<G.w?G.w/2-250:0,b=500<G.h?G.h/2-250:0,d=(transDuration-transTimer)/transDuration;P.shrink(0,0,500*d,500*d);Stage.draw(G.w,G.h);let e=a+500,f=b+500;Menu.drawBorder(a*d,b*d,e+(G.w-e)*(1-d),f+(G.h-f)*(1-d));P.draw();transTimer>=transDuration?(transTimer=0,G.getTutorial()?window.requestAnimationFrame(main):window.requestAnimationFrame(tutorial)):loop(MenuTrans)}
let Menu={drawBorder(a,b,d,e){ctx.fillStyle="black";ctx.fillRect(0,0,G.w,b);ctx.fillRect(0,0,a,G.h);ctx.fillRect(0,e,G.w,G.h);ctx.fillRect(d,0,G.w,G.h)},title:{draw(a,b,d,e){ctx.fillStyle="black";ctx.font="30px Comic Sans MS";a=a+d/2-ctx.measureText("BLOB MOB").width/2;b+=1*e/8;ctx.fillText("BLOB MOB",a,b);ctx.fillStyle="#ffd6cc";ctx.fillText("BLOB MOB",a-3,b-3)},buttons:{start:new Button("25px Comic Sans MS","START","#ffd6cc","black"),draw(a,b,d,e){this.start.adjust(a+d/2,b+6*e/8+30);this.start.draw()}}},
difficulty:{draw(a,b,d,e){ctx.fillStyle="black";ctx.font="30px Comic Sans MS";a=a+d/2-ctx.measureText("BLOB MOB").width/2;b+=1*e/8;ctx.fillText("DIFFICULTY",a,b);ctx.fillStyle="#ffd6cc";ctx.fillText("DIFFICULTY",a-3,b-3)},buttons:{diffs:[],generate(a,b,d,e){Object.keys(difficultyTable).forEach(f=>{f=new Button("25px Comic Sans MS",f,"black","#ffd6cc");this.diffs.push(f)})},draw(a,b,d,e){let f=Object.keys(difficultyTable).length,g=(d-f*ctx.measureText("0").width)/f,h=b+6*e/8+30,k=a;this.diffs.forEach(l=>
{k+=g;l.adjust(k,h);l.draw()})},check(a){let b=null;this.diffs.forEach(d=>{d.check(a)&&(b=parseInt(d.text,10))});if(null!=b)return G.updateDifficulty(P,Enemies,b),!0}}}};const clamp=(a,b,d)=>Math.min(Math.max(a,b),d);class DPController{constructor(){this.interval=50;this.maxPoints=15;this.instances=[];this.cool=0}spawn(a){5>this.instances.length&&0>=this.cool&&(a=new DamagePoint(a),this.instances.push(a),this.cool=5)}controller(){0<this.cool&&--this.cool;for(let a=0;a<this.instances.length;a++)0>=this.instances[a].life?this.instances.splice(a,1):(this.instances[a].live(),this.instances[a].draw())}}
class DamagePoint{constructor(a){let b=a.w,d=a.h;this.x=a.x;this.y=a.y;a=Math.random();.5>a?(this.x+=.5>a?-b/2-1:b/2+1,a=Math.random(),this.y+=a*(d+10)-5):(this.x+=a*(b+10)-5,a=Math.random(),this.y+=.5>a?-d/2-1:d/2+1);this.life=100}draw(){--this.life;ctx.font="18px Comic Sans MS";ctx.fillStyle=`rgba(225, 0, 0, ${this.life/100})`;ctx.fillText("-1",this.x,this.y)}live(){0<this.life&&--this.life}}
class Player{constructor(a,b,d,e){this.x=a;this.y=b;this.w=d;this.h=e;this.xdir=1;this.ydir=0;this.color="#ffd6cc";this.maxSpeed=5;this.accel=.4;this.yvel=this.xvel=0;this.maxCool=50;this.cool=0;this.maxPower=50;this.power=0;this.health=this.maxHealth=500;this.action=en.act.norm;this.pushRadius=240;this.timer=this.pushR=0;this.state=en.state.norm}title(a,b,d,e){this.color="#ffd6cc";this.wiggle(d/2,e/2);this.x=clamp(this.x,a+3*d/8,a+5*d/8);this.y=clamp(this.y,b+3*d/8,b+5*e/8)}shrink(a,b,d,e){d=clamp(d/
2,55,60+d/2);this.wiggle(55,d);this.x+=a;this.y+=b}draw(){let a=this.x-this.w/2,b=this.y-this.h/2;ctx.fillStyle=this.color;ctx.fillRect(a,b,this.w,this.h);ctx.lineWidth=1;ctx.beginPath();ctx.fillStyle="black";ctx.arc(a+this.w/6,b+this.h/6,(this.w/4+this.h/4)/4,0,2*Math.PI);ctx.stroke();ctx.closePath();ctx.beginPath();ctx.arc(a+this.w-this.w/8,b+this.h/6,(this.w/4+this.h/4)/6,0,2*Math.PI);ctx.stroke();ctx.closePath();ctx.beginPath();ctx.moveTo(a+this.w/8,b+this.h-this.h/3);ctx.bezierCurveTo(a+this.h/
8,b+this.h,a+this.w-this.h/8,b+this.h,a+this.w-this.h/8,b+this.h-this.h/3);ctx.stroke();ctx.closePath();this.action==en.act.push&&(ctx.beginPath(),ctx.arc(this.x,this.y,this.pushR,0,2*Math.PI),ctx.stroke(),ctx.closePath())}controller(a,b,d,e,f){if(this.state!=en.state.dead){0>=this.cool&&(this.cool=0,d.attack&&(this.action=en.act.attack),this.power==this.maxPower&&d.push&&(this.action=en.act.push));switch(this.action){case en.act.attack:this.color="#adedff";this.attack(a,b,8,e);return;case en.act.norm:this.move(a,
b,d);break;case en.act.push:this.move(a,b,d),this.color="#adedff",this.pushField(600,e)}this.x+=this.xvel;this.y+=this.yvel;this.action!=en.act.push&&(0<this.cool?(--this.cool,this.color="#adedff"):this.color="#ffd6cc");var g=!1;e.forEach(h=>{this.collides(h)&&h.state==en.state.norm&&(g=!0)});g&&(this.color="#ff6d6d",this.health--,null!=f&&f.spawn(this));0>=this.health&&(this.state=en.state.dead)}}move(a,b,d){d.right&&(this.xvel+=this.accel);d.left&&(this.xvel-=this.accel);d.down&&(this.yvel+=this.accel);
d.up&&(this.yvel-=this.accel);d.right||d.left||(Math.abs(this.xvel)<=this.accel?this.xvel=0:0<this.xvel?this.xvel-=this.accel:0>this.xvel&&(this.xvel+=this.accel));d.down||d.up||(Math.abs(this.yvel)<=this.accel?this.yvel=0:0<this.yvel?this.yvel-=this.accel:0>this.yvel&&(this.yvel+=this.accel));this.xvel=clamp(this.xvel,-this.maxSpeed,this.maxSpeed);this.yvel=clamp(this.yvel,-this.maxSpeed,this.maxSpeed);this.calculateDir();this.wiggle(50,69);this.keepOnScreen(a,b)}calculateDir(){let a=Math.sqrt(this.xvel*
this.xvel+this.yvel*this.yvel);0<a&&(this.xdir=this.xvel/a,this.ydir=this.yvel/a)}attack(a,b,d,e){++this.timer;this.cool+=this.maxCool/d;const f=Math.max(10,2*Math.abs(this.yvel));this.x+=this.xdir*Math.max(10,2*Math.abs(this.xvel));this.y+=this.ydir*f;e.forEach(g=>{this.collides(g)&&g.state!=en.state.dying&&g.state!=en.state.dead&&(g.state=en.state.dying)});this.keepOnScreen(a,b);this.timer>=d&&(this.timer=this.yvel=this.xvel=0,this.action=en.act.norm)}pushField(a,b){this.power-=this.maxPower/a;
++this.timer;this.cool+=this.maxCool/a;b.forEach(d=>{d.state!=en.state.dying&&d.state!=en.state.dead&&(this.pushR=Math.min(this.timer/(a/4),1)*this.pushRadius,d.pushField(this.pushR))});this.timer>=a&&(this.timer=0,this.action=en.act.norm,this.power=this.pushR=0)}collides(a){return null==a?!1:this.x+this.w/2<a.x-a.w/2||this.x-this.w/2>a.x+a.w/2||this.y+this.h/2<a.y-a.h/2||this.y-this.h/2>a.y+a.w/2?!1:!0}wiggle(a,b){let d=.5<Math.random()?1:-1;this.x+=d;d=.5<Math.random()?1:-1;this.y+=d;d=.5<Math.random()?
1:-1;this.w=clamp(this.w+d,a,b);d=.5<Math.random()?1:-1;this.h=clamp(this.h+d,a,b)}keepOnScreen(a,b){this.x=clamp(this.x,this.w/2+5,a-this.w/2-5);this.y=clamp(this.y,this.h/2+5,b-this.h/2-5)}};let background=new Image;background.src="paper.jpg";
let Stage={draw(a,b){document.body.style.backgroundColor="#000000";ctx.fillStyle="#fffbf9";ctx.fillRect(0,0,a,b);ctx.drawImage(background,0,0,a,b);ctx.lineWidth=10;ctx.strokeRect(0,0,a,b)},HUD(a,b,d){ctx.fillStyle="black";ctx.fillRect(a/2,10,a/2-10,20);ctx.fillStyle=d.color;ctx.font="10px monospace";ctx.fillText(d.health+"/"+d.maxHealth,3*a/4-10,23);ctx.fillRect(a/2+1,11,Math.max(0,d.health/d.maxHealth*(a/2-10)-2),18);ctx.fillStyle="black";ctx.fillRect(3*a/4+5,40,a/4-15,20);ctx.fillStyle="#33cc33";
0<d.power&&ctx.fillRect(3*a/4+6,41,d.power/d.maxPower*(a/4-15)-2,18);ctx.fillStyle="black";ctx.fillRect(a/2,40,a/4-5,20);ctx.fillStyle="blue";ctx.fillRect(a/2+1,41,(1-d.cool/d.maxCool)*(a/4-5)-2,18);ctx.fillStyle="black";ctx.font="20px monospace";ctx.fillText("Score: "+G.score,18,28,a/2);ctx.fillText("High-Score: "+G.highscore,18,58,a/2);ctx.fillStyle="black";ctx.font="20px monospace";a=`Difficulty ${G.difficulty}`;ctx.fillText(a,G.w-ctx.measureText(a).width-20,b-25)}},pauseMenu={draw(a,b){ctx.fillStyle=
"rgba(225, 220, 212, 0.4)";ctx.fillRect(0,0,a,b);ctx.fillStyle="grey";ctx.font="50px monospace";ctx.fillText("PAUSE",a/2-ctx.measureText("Pause").width/2,b/2+10)}};let mainTheme=new Howl({src:["Sound/No-Thanksv1.1.mp3"],volume:.5,loop:!0}),effects=new Howl({src:["Sound/Sound-effects.mp3"],sprite:{btn:[4980,500]}});class Tutorial{constructor(){this.timer=0;this.order="move enemy push bars goodLuck end".split(" ");this.i=0;this.check=!1;this.controlCheck=[0,0,0,0]}get step(){return this.order[this.i]}debug(){ctx.font="20px Arial Bold";ctx.color="black";let a=6*G.h/8+100;ctx.fillText("Stage: "+this.step,40,a);a+=20;ctx.fillText("Timer: "+this.timer,40,a);switch(this.step){case "enemy":ctx.fillText(`Enemy State: ${Enemies.instances[0].state}`,40,a+30)}}controller(a,b,d){++this.timer;this.check&&(this.i++,this.check=
!1);switch(this.step){case "move":d.right&&(this.controlCheck[0]=1);d.up&&(this.controlCheck[1]=1);d.left&&(this.controlCheck[2]=1);d.down&&(this.controlCheck[3]=1);!this.controlCheck.includes(0)&&200<this.timer&&(this.timer=0,this.check=!0);break;case "enemy":0==Enemies.instances.length&&Enemies.spawn(a,b,P);1==G.score&&(this.timer=0,this.check=!0,P.power=P.maxPower);break;case "push":5>=Enemies.instances.length&&Enemies.spawn(a,b,P);P.action==en.act.push&&(this.timer=0,this.check=!0);break;case "bars":0==
Enemies.instances.length&&(this.timer=0,this.check=!0);break;case "goodLuck":300<this.timer&&(this.check=!0)}}draw(a,b){let d,e;ctx.font="30px Comic Sans MS";switch(this.step){case "move":e="Use WASD or Arrow Keys to Move";d=a/2-ctx.measureText(e).width/2;ctx.fillStyle="black";ctx.fillText(e,d,2*b/8);break;case "enemy":e="This is an enemy! Use space to kill him";d=a/2-ctx.measureText(e).width/2;ctx.fillStyle="black";ctx.fillText(e,d,2*b/8);break;case "push":e="More Homies! Push em away with Q";d=
a/2-ctx.measureText(e).width/2;ctx.fillStyle="black";ctx.fillText(e,d,2*b/8);break;case "bars":ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(5*a/8-20,145);ctx.lineTo(5*a/8,80);ctx.stroke();ctx.closePath();ctx.beginPath();ctx.moveTo(5*a/8,80);ctx.lineTo(5*a/8-10,85);ctx.stroke();ctx.closePath();ctx.beginPath();ctx.moveTo(5*a/8,80);ctx.lineTo(5*a/8+5,89);ctx.stroke();ctx.closePath();ctx.beginPath();ctx.moveTo(7*a/8-20,145);ctx.lineTo(7*a/8,80);ctx.stroke();ctx.closePath();ctx.beginPath();ctx.moveTo(7*
a/8,80);ctx.lineTo(7*a/8-10,85);ctx.stroke();ctx.closePath();ctx.beginPath();ctx.moveTo(7*a/8,80);ctx.lineTo(7*a/8+5,89);ctx.stroke();ctx.closePath();ctx.fillStyle="black";ctx.font="25px Comic Sans MS";e="Cooldown";d=5*a/8-20-ctx.measureText(e).width/2;ctx.fillText(e,d,170);e="Power";d=7*a/8-20-ctx.measureText(e).width/2;ctx.fillText(e,d,170);ctx.font="30px Comic Sans MS";e="Attacks and specials have a Cooldown,";d=a/2-ctx.measureText(e).width/2;b=2*b/8;ctx.fillText(e,d,b);ctx.font="30px Comic Sans MS";
e="specials require full Power";d=a/2-ctx.measureText(e).width/2;ctx.fillText(e,d,b+34);break;case "goodLuck":e="Kill as many Blobs as you can,",d=a/2-ctx.measureText(e).width/2,b=2*b/8,ctx.fillStyle="black",ctx.fillText(e,d,b),e="Good luck!",d=a/2-ctx.measureText(e).width/2,ctx.fillText(e,d,b+34)}}}let T=new Tutorial;
function tutorial(){++G.frame;G.resizeWindow();P.controller(G.w,G.h,I.keyState,Enemies.instances,DP);50>=P.health&&(P.health=50);T.controller(G.w,G.h,I.keyState);Enemies.controller();ctx.clearRect(0,0,G.w,G.h);Stage.draw(G.w,G.h);P.draw();Enemies.draw();DP.controller();T.draw(G.w,G.h);"bars"!=T.step&&"goodLuck"!=T.step&&"end"!=T.step||Stage.HUD(G.w,G.h,P);"end"==T.step?(G.reset(P,Enemies,DP),G.setTutorial(),window.requestAnimationFrame(main)):loop(tutorial)};
