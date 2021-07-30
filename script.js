function getRandomInt(min, max)
{ return Math.floor(Math.random() * (max - min + 1)) + min; }
var canvas=document.getElementById('canvas');
var ctx=canvas.getContext('2d');
var canvas2=document.getElementById('canvas2');
var ctx2=canvas2.getContext('2d');
var arr=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]; //arr : 각 블록 객체를 담을 2차원 배열
var color=["#000000","#EEE4DA","#eee1c9","#F3B27A","#F69664","#F77C5F","#F7633D","#EDD073","#EDC964","#EDC950","#EDD073","#EDD073"];
var score=0;
var best_score = localStorage.getItem('high');
var now_user = prompt('당신의 이름을 영어로 입력해주세요.(최대 6자리)');
if(now_user.length>6){
  alert('잘못된 이름입니다!');
  location.reload();
}
var user = localStorage.getItem('best_user');
if(user==null)
  user=now_user;
document.addEventListener('keydown', keyDownHandler);
function show_arr(){
  for(var i=0; i<4; i++)
    for(var j=0; j<4; j++)
      console.log(arr[i][j]);
}
function keyDownHandler(e){
  if(e.keyCode==37)//왼쪽
    moveblock(1);
  else if(e.keyCode==38)
    moveblock(2);
  else if(e.keyCode==39)
    moveblock(3);
  else if(e.keyCode==40)
    moveblock(4);
}
function draw_block(block_color,text_color,x,y,num)
{
  font_size=canvas.width*0.15;
  dx=canvas.width/12;
  if(num>1000) font_size=canvas.width*0.08, dx*=0.3
  else if(num>100) font_size=canvas.width*0.1, dx*=0.5
  else if(num>10) font_size=canvas.width*0.12, dx*=0.75;
  ctx.fillStyle=block_color;
  ctx.fillRect(x*canvas.width/4+5,y*canvas.width/4+5,canvas.width/4*0.9,canvas.height/4*0.9);
  ctx.fillStyle=text_color;
  ctx.font="italic "+font_size+"px"+" Calibri";
  if(num!=0)
    ctx.fillText(num,x*canvas.width/4+dx,y*canvas.width/4+canvas.height/4*0.6);
}
function draw_randomblock(){
  x=getRandomInt(0,3);
  y=getRandomInt(0,3);
  if(arr[y][x]!=0)
    draw_randomblock();
  else{
    standard=Math.random();
    num=2
    if(standard>0.7) num=4
    arr[y][x]=num;
    block_color=color[Math.log2(num)]
    draw_block(block_color,"#766c65",x,y,num);
  }
}
function draw_allblock(){
  for(var y=0; y<4; y++){
    for(var x=0; x<4; x++){
      if(arr[y][x]!=0){
        text_color="white";
        if(arr[y][x]==2 || arr[y][x]==4) text_color="#766c65";
        block_color=color[Math.log2(arr[y][x])];
        draw_block(block_color,text_color,x,y,arr[y][x]);
      }
      else{
        draw_block("#cbbfb1","black",x,y,0);
      }
    }
  }
}

function moveblock(com){ // com : 1 left 2 up 3 right 4 down
  ctx.clearRect(0,0,600,600);
  if(com==1) moveleft();
  else if(com==2) moveup();
  else if(com==3) moveright();
  else if(com==4) movedown();
  draw_allblock();
  ctx2.clearRect(0,0,200,200);
  drawscore();
  setTimeout("draw_randomblock()",100);
  check_gameover();
}

function moveleft(){
  for(var i=0; i<4; i++){
    for(var j=1; j<4; j++){
      if(arr[i][j]!=0){
        idx=j;
        for(var t=j-1; t>=0; t--){
          if(arr[i][t]==0){
            arr[i][t]=arr[i][idx];
            arr[i][idx]=0;
            idx=t;
          }
          else{
            if(arr[i][t]==arr[i][idx]){
              arr[i][t]*=2;
              arr[i][idx]=0;
              idx=t;
              score+=arr[i][t];
              break;
            }
            else break;
          }
        }
      }
    }
  }
}
function moveright(){
  for(var i=0; i<4; i++){
    for(var j=2; j>=0; j--){
      if(arr[i][j]!=0){
        idx=j;
        for(var t=j+1; t<4; t++){
          if(arr[i][t]==0){
            arr[i][t]=arr[i][idx];
            arr[i][idx]=0;
            idx=t;
          }
          else{
            if(arr[i][t]==arr[i][idx]){
              arr[i][t]*=2;
              arr[i][idx]=0;
              idx=t;
              score+=arr[i][t];
              break;
            }
            else break;
          }
        }
      }
    }
  }
}
function moveup(){
  for(var j=0; j<4; j++){
    for(var i=1; i<4; i++){
      if(arr[i][j]!=0){
        idx=i;
        for(var t=i-1; t>=0; t--){
          if(arr[t][j]==0){
            arr[t][j]=arr[idx][j];
            arr[idx][j]=0;
            idx=t;
          }
          else{
            if(arr[t][j]==arr[idx][j]){
              arr[t][j]*=2;
              arr[idx][j]=0;
              idx=t;
              score+=arr[t][j];
              break;
            }
            else break;
          }
        }
      }
    }
  }
}
function movedown(){
  for(var j=0; j<4; j++){
    for(var i=2; i>=0; i--){
      if(arr[i][j]!=0){
        idx=i;
        for(var t=i+1; t<4; t++){
          if(arr[t][j]==0){
            arr[t][j]=arr[idx][j];
            arr[idx][j]=0;
            idx=t;
          }
          else{
            if(arr[t][j]==arr[idx][j]){
              arr[t][j]*=2;
              arr[idx][j]=0;
              idx=t;
              score+=arr[t][j];
              break;
            }
            else break;
          }
        }
      }
    }
  }
}
function drawscore(){
  ctx2.font = "italic 36px Calibri";
  ctx2.fillStyle = "#EEE4DA";
  ctx2.fillText("score",35,32);
  ctx2.fillStyle = "#FFFFFF";
  ctx2.fillText(score,35,70);
  ctx2.fillStyle = "#EEE4DA";
  ctx2.fillText(user,35,110);
  ctx2.fillStyle = "#FFFFFF";
  ctx2.fillText(best_score,35,160);
}
function check_gameover(){
  var flag=0;
  var flag2=0;
  for(var i=0; i<4; i++){
    for(var j=0; j<4; j++){
      if(j<3  && arr[i][j]==arr[i][j+1])
        flag++;
      if(i<3 && arr[i][j]==arr[i+1][j])
        flag++;
      if(arr[i][j]!=0)
        flag2++;
    }
  }
  if(flag==0 && flag2==16){
    alert("Game over!!");
    if(best_score<score){
      window.localStorage.setItem('best_user',user);
      window.localStorage.setItem('high',score);
    }
    location.reload();
  }
  else{
    console.log(flag);
  }
}
draw_allblock();
drawscore();
for(var i=0; i<4; i++){
  draw_randomblock();
}
