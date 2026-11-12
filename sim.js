(function(){
var X=[100,300,500],names=["第 1 盆","第 2 盆","第 3 盆"],LOW=30,OK=60,MAXR=10,m=[70,65,72],busy=false;
var $=function(id){return document.getElementById(id)};
var car=$("carriage"),cards=$("potCards"),msg=$("msg");
var sleep=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
var svg="";
X.forEach(function(x,i){svg+='<path d="M'+(x-42)+' 150 L'+(x+42)+' 150 L'+(x+32)+' 210 L'+(x-32)+' 210 Z" fill="var(--surface)" stroke="var(--ink)" stroke-width="3"/><rect id="soil'+i+'" x="'+(x-38)+'" y="152" width="76" height="14" fill="var(--soil)"/><path d="M'+x+' 150 C'+x+' 125 '+(x-18)+' 118 '+(x-26)+' 108 M'+x+' 150 C'+x+' 122 '+(x+16)+' 116 '+(x+26)+' 104" stroke="var(--leaf)" stroke-width="5" fill="none" stroke-linecap="round"/>'});
$("potsvg").innerHTML=svg;
names.forEach(function(n,i){var d=document.createElement("div");d.className="pot";d.innerHTML='<h3>'+n+'</h3><div id="v'+i+'"></div><div class="bar"><i id="b'+i+'"></i></div><button type="button" id="dry'+i+'">讓它變乾</button>';cards.appendChild(d);d.querySelector("button").addEventListener("click",function(){if(busy)return;m[i]=15;render();run()})});
function render(){m.forEach(function(v,i){v=Math.round(v);$("v"+i).textContent="濕度 "+v+"%"+(v<=LOW?"（太乾）":"");var b=$("b"+i);b.style.width=v+"%";b.className=v<=LOW?"low":"";$("soil"+i).setAttribute("height",8+v*.14)});for(var i=0;i<3;i++)$("dry"+i).disabled=busy}
function flags(a,b,c){$("cMove").className="chip"+(a?" on":"");$("cPump").className="chip"+(b?" on":"");$("cWait").className="chip"+(c?" on":"");$("drops").parentNode.classList.toggle("watering",b)}
function say(t){msg.textContent=t}
async function moveTo(i,l){flags(true,false,false);say("滑塊移動中，水泵已鎖定。");car.style.transform="translateX("+(X[i]-300)+"px)";await sleep(1200);$("pos").textContent="位置："+l;flags(false,false,false)}
async function water(i){say("到達"+names[i]+"，水泵啟動，滑塊已鎖定。");flags(false,true,false);for(var k=0;k<10;k++){m[i]=Math.min(100,m[i]+2.5);render();await sleep(250)}flags(false,false,false)}
async function absorb(){flags(false,false,true);for(var s=30;s>0;s-=6){say("等待土壤吸收水分……（還有約 "+s+" 秒，示範已加速）");await sleep(1000)}}
async function run(){if(busy)return;busy=true;render();
while(true){var i=m.findIndex(function(v){return v<=LOW});if(i<0)break;var r=0;
while(m[i]<OK&&r<MAXR){r++;say("偵測到"+names[i]+"太乾（"+Math.round(m[i])+"%），準備澆水。");await sleep(700);await moveTo(i,names[i]);await water(i);await moveTo(1,"中間");await absorb();say("重新偵測"+names[i]+"：濕度 "+Math.round(m[i])+"%"+(m[i]<OK?"，未達 "+OK+"%，再澆一次。":"，已達 "+OK+"% 以上，結束。"));await sleep(1200)}}
busy=false;flags(false,false,false);render();say("所有盆栽濕度足夠，系統待機中。")}
render();})();
