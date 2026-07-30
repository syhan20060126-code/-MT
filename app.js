(() => {
  const totalSlides=95, removedSlides=new Set([48,49,50]), visibleSlides=Array.from({length:95},(_,i)=>i+1).filter(n=>!removedSlides.has(n)), people=['태화','명우','범서','채린','성민','가현','지은','지안'];
  const titles={1:'시작',2:'팀 소개',3:'비밀미션 정산',4:'GAME 1 · 종이컵 지키기',5:'GAME 2 · 몸으로 말해요',31:'GAME 3 · 환성연의 텔레파시',47:'GAME 4 · 환성연에 탈출하기',91:'최종정산',92:'최종 룰렛',93:'벌칙 공개',95:'종료'};
  let current=1, seconds=45, interval;
  let scores=JSON.parse(localStorage.getItem('hwansungyeon-mt-scores')||'null')||Object.fromEntries(people.map(p=>[p,0]));
  const $=s=>document.querySelector(s), pad=n=>String(n).padStart(3,'0');
  function title(){let k=Object.keys(titles).map(Number).filter(n=>n<=current).pop();return titles[k]||'진행 슬라이드'}
  function show(n){n=Math.max(1,Math.min(totalSlides,n));const direction=n>=current?1:-1;while(removedSlides.has(n))n+=direction;current=Math.max(1,Math.min(totalSlides,n));$('#slide').src=`./slide${pad(current)}.png`;$('#count').textContent=`${visibleSlides.indexOf(current)+1} / ${visibleSlides.length}`;$('#context').textContent=title();const isTimed=(current>=6&&current<=30)||(current>=32&&current<=46);$('#timer-box').classList.toggle('closed',!isTimed);if(isTimed)resetTimer((current>=32&&current<=46)?10:45);if(current===91)$('#scoreboard').classList.remove('closed')}
  function renderScores(){const ordered=[...people].sort((a,b)=>scores[b]-scores[a]||people.indexOf(a)-people.indexOf(b));$('#scores').innerHTML=people.map(p=>`<div class="score-row"><span>${p}</span><b>${scores[p]}점</b></div>`).join('');$('#ranking').innerHTML='<div class="rank-title">현재 순위</div>'+ordered.map((p,i)=>`<div class="rank-row">${i+1}위 · ${p} <b>${scores[p]}점</b></div>`).join('')}
  function save(){localStorage.setItem('hwansungyeon-mt-scores',JSON.stringify(scores));renderScores()}
  function paint(){let m=Math.floor(seconds/60),s=seconds%60;$('#timer').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
  function resetTimer(value=45){clearInterval(interval);interval=null;seconds=value;paint()}
  $('#prev').onclick=()=>show(current-1);$('#next').onclick=()=>show(current+1);document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' ')show(current+1);if(e.key==='ArrowLeft')show(current-1);if(e.key==='Escape'&&document.fullscreenElement)document.exitFullscreen()});
  $('#slide').onclick=()=>show(current+1);
  $('#fullscreen').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
  $('#score-toggle').onclick=()=>$('#scoreboard').classList.toggle('closed');
  $('#timer-start').onclick=()=>{if(!interval)interval=setInterval(()=>{if(seconds>0){seconds--;paint()}else clearInterval(interval)},1000)};
  $('#timer-pause').onclick=()=>{clearInterval(interval);interval=null};$('#timer-reset').onclick=()=>resetTimer((current>=32&&current<=46)?10:45);
  $('#score-edit').onclick=()=>{ $('#inputs').innerHTML=people.map(p=>`<label class="input-row"><span>${p}</span><span class="score-adjust"><button type="button" data-add="5">+5</button><button type="button" data-add="3">+3</button><button type="button" data-add="1">+1</button><button type="button" class="minus" data-add="-1">-1</button><button type="button" class="minus" data-add="-2">-2</button><button type="button" class="minus" data-add="-3">-3</button><input type="number" inputmode="numeric" value="${scores[p]}"></span></label>`).join('');document.querySelectorAll('[data-add]').forEach(button=>button.onclick=()=>{const input=button.parentElement.querySelector('input');input.value=(Number(input.value)||0)+Number(button.dataset.add)});$('#mission-award').style.display=current===3?'inline-block':'none';$('#score-dialog').showModal()};
  $('#save-scores').onclick=()=>{[...document.querySelectorAll('#inputs input')].forEach((el,i)=>scores[people[i]]=Number(el.value)||0);save();$('#score-dialog').close()};
  $('#mission-award').onclick=()=>{const missions=[['범서',1],['명우',2],['채린',3],['지안',1],['지은',2],['가현',3]];const checked=prompt('성공한 사람을 쉼표로 입력하세요. 예: 범서, 명우, 채린\n점수는 PPT 기준으로 자동 반영됩니다.');if(checked===null)return;checked.split(',').map(x=>x.trim()).forEach(name=>{let m=missions.find(x=>x[0]===name);if(m)scores[m[0]]+=m[1]});save();alert('비밀미션 점수를 반영했습니다. 승리팀 보너스는 필요하면 점수 입력에서 직접 더해 주세요.');};
  $('#reset').onclick=()=>{if(confirm('모든 점수를 0점으로 초기화할까요?')){scores=Object.fromEntries(people.map(p=>[p,0]));save()}};
  show(1);renderScores();
})();
