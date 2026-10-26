/* Anu's Beauty Care - custom quotation and day-wise package addition. No rates, tax or customer data are stored here. */
(function(){
if(window.__anuQuote||!document.getElementById('billTax'))return;window.__anuQuote=1;
var $=function(id){return document.getElementById(id)};
var anchor=$('billTax').previousElementSibling;
var box=document.createElement('div');box.id='quoteExtras';
box.innerHTML=
'<label for="docType">Document type</label>'+
'<select id="docType"><option value="bill">Bill</option><option value="quote">Quotation</option></select>'+
'<label for="quoteNote">Function date / note (optional)</label>'+
'<input id="quoteNote" maxlength="120" placeholder="Example: function date, venue">'+
'<h3 style="margin:22px 0 4px;font-size:18px">Custom item</h3>'+
'<p class="wsnote">Type any makeup option or service that is not in the menu, with your own price.</p>'+
'<label for="customName">Custom service / makeup option</label>'+
'<input id="customName" maxlength="120" placeholder="Enter service or makeup option">'+
'<label for="customPrice">Price (INR)</label>'+
'<input id="customPrice" type="number" min="0" step="0.01" placeholder="Enter your price">'+
'<button type="button" id="customAdd">Add custom item</button>'+
'<h3 style="margin:22px 0 4px;font-size:18px">Day-wise package</h3>'+
'<p class="wsnote">Choose how many days, then enter what is done each day and its price.</p>'+
'<label for="pkgName">Package name (optional)</label>'+
'<input id="pkgName" maxlength="80" placeholder="Enter package name">'+
'<label for="pkgDays">Number of days</label>'+
'<input id="pkgDays" type="number" min="1" max="31" step="1" placeholder="How many days">'+
'<button type="button" id="pkgMake">Create day rows</button>'+
'<div id="pkgRows"></div>'+
'<button type="button" id="pkgAdd" hidden>Add package to list</button>';
anchor.parentNode.insertBefore(box,anchor);

function addLine(name,amount){lines.push({name:name,amount:Math.round(amount*100)});renderBill()}
$('customAdd').onclick=function(){
 var n=$('customName').value.trim(),p=Number($('customPrice').value);
 if(!n){alert('Enter the service or makeup option name.');return}
 if(!$('customPrice').value||!isFinite(p)||p<0){alert('Enter the price first.');return}
 addLine(n,p);$('customName').value='';$('customPrice').value='';
};
$('pkgMake').onclick=function(){
 var d=Math.floor(Number($('pkgDays').value));
 if(!isFinite(d)||d<1||d>31){alert('Enter the number of days (1 to 31).');return}
 var h='';
 for(var i=1;i<=d;i++)h+='<div class="pkgDay" style="margin-top:14px"><label>Day '+i+' - makeup / services</label><input class="pkgDesc" maxlength="140" placeholder="What is done on day '+i+'"><label>Day '+i+' price (INR)</label><input class="pkgAmt" type="number" min="0" step="0.01" placeholder="Enter day '+i+' price"></div>';
 $('pkgRows').innerHTML=h;$('pkgAdd').hidden=false;
};
$('pkgAdd').onclick=function(){
 var ds=[].slice.call(document.querySelectorAll('#pkgRows .pkgDay')),out=[],pre=$('pkgName').value.trim();
 for(var i=0;i<ds.length;i++){
  var t=ds[i].querySelector('.pkgDesc').value.trim(),a=ds[i].querySelector('.pkgAmt').value,p=Number(a);
  if(!t||!a||!isFinite(p)||p<0){alert('Fill the details and price for Day '+(i+1)+'.');return}
  out.push([(pre?pre+' - ':'')+'Day '+(i+1)+': '+t,p]);
 }
 if(!out.length){alert('Create the day rows first.');return}
 out.forEach(function(x){addLine(x[0],x[1])});
 $('pkgRows').innerHTML='';$('pkgAdd').hidden=true;$('pkgDays').value='';$('pkgName').value='';
};

var panelTitle=document.querySelector('#ws-bill .wspanel:nth-child(2) h2');
var shareBtn=[].slice.call(document.querySelectorAll('#ws-bill button')).filter(function(b){return /Send bill on WhatsApp/.test(b.textContent)})[0];
var reviewLabel=document.querySelector('#billShareReview label');
function btn(re){return [].slice.call(document.querySelectorAll('#ws-bill button')).filter(function(b){return re.test(b.textContent)})[0]}
var copyBtn=btn(/^(Copy bill text|Copy quotation text)$/),saveBtn=btn(/^Save (bill|quotation)/);
function isQuote(){return $('docType').value==='quote'}
function labels(){var q=isQuote();
 if(panelTitle)panelTitle.textContent=q?'Quotation preview':'Bill preview';
 if(shareBtn)shareBtn.textContent=q?'Send quotation on WhatsApp':'Send bill on WhatsApp';
 if(reviewLabel)reviewLabel.textContent=q?'Quotation text to review':'Bill text to review';
 if(copyBtn)copyBtn.textContent=q?'Copy quotation text':'Copy bill text';
 if(saveBtn)saveBtn.textContent=q?'Save quotation \u00b7 connection pending':'Save bill \u00b7 connection pending';
}
$('docType').onchange=function(){labels();if(!$('billShareReview').hidden)reviewBillShare()};
var orig=billShareContent;
window.billShareContent=billShareContent=function(){
 var t=orig();
 if(isQuote())t=t.replace('BILL DRAFT','QUOTATION DRAFT');
 var n=$('quoteNote').value.trim();
 if(n){var a=t.split('\n'),i=a.indexOf('BILL DRAFT')>=0?a.indexOf('BILL DRAFT'):a.indexOf('QUOTATION DRAFT');a.splice(i+1,0,n);t=a.join('\n')}
 return t;
};

/* Makeup price list copied from the owner's two handwritten note pages. Rates are as written. Nothing is added to the quotation until Add is tapped. */
var mk=[
 ['Notes page 1 (with product)',null],
 ['Basic Make up + Hair Style (with product)','2700','"My product" is crossed out; "with product" kept.'],
 ['Corrective Make up: dark spot, contouring, hi-light + eye make up (with product)','5500','One word in the bracket is crossed out and one is unclear.'],
 ['Corrective Make up (second rate, confirm)','','Notes show (8000/-) next to a hard to read word. Not confirmed, so the rate is blank. Enter it only after you confirm.'],
 ['HD Make up / long lasting, contour, hi-lights, eye make up on good product (with products)','9500','8000 is crossed out, 9500 written.'],
 ['HD / long lasting (second rate, confirm)','','Notes show (12500) next to a word that reads like "want". Not confirmed, so the rate is blank. Enter it only after you confirm.'],
 ['Extra charges (no amount written)',null],
 ['Travel allowance (Petrol)','','Your note says Petrol means travel allowance. No amount is written. Enter it.'],
 ['Food allowance','','No amount is written. Enter it.'],
 ['Notes page 2 (rates with crossed-out older prices)',null],
 ['Man Make up (if the product is yours)','2000','Underlined. Product wording is not fully clear. CONFIRM.'],
 ['Corrective Make up (Advance)','3500','3000 is crossed out, 3500 written. Product not stated.'],
 ['HD Make up','4500','4000 is crossed out, 4500 written. Product not stated.']
];

function ppName(base,rate,c){return base+' ('+String.fromCharCode(8377)+rate+' per person x '+c+(c===1?' person)':' persons)')}
function addPP(base,rate,c){lines.push({name:ppName(base,rate,c),amount:Math.round(rate*c*100),base:base,rate:rate,n:c});renderBill()}
var mkWrap=document.createElement('div');mkWrap.id='mkList';
var mkTitle=document.createElement('h3');mkTitle.style.cssText='margin:22px 0 4px;font-size:18px';mkTitle.textContent='Makeup price list from your notes';
var mkInfo=document.createElement('p');mkInfo.className='wsnote';mkInfo.textContent='Rates are per person, per makeup, as written in your two note pages. Set the number of persons on each item (it starts at 1). Change the name or rate here, then tap Add. After adding, tap Edit on the line to change it again. Page 2 also says: no change for Man and Basic Make up. Travel and food allowance have no amount yet, so add them after you enter one.';
mkWrap.appendChild(mkTitle);mkWrap.appendChild(mkInfo);
mk.forEach(function(r){
 if(r[1]===null){var h=document.createElement('p');h.className='wsnote';h.style.cssText='margin-top:16px;font-weight:600';h.textContent=r[0];mkWrap.appendChild(h);return}
 var d=document.createElement('div');d.style.cssText='border:1px solid #e3d6dc;border-radius:14px;padding:12px;margin-top:10px';
 var n=document.createElement('input');n.value=r[0];n.maxLength=140;n.setAttribute('aria-label','Item name');
 var p=document.createElement('input');p.type='number';p.min='0';p.step='0.01';p.value=r[1];p.placeholder='Enter rate per person';p.setAttribute('aria-label','Rate per person in INR');var pl=document.createElement('label');pl.textContent='Rate per person (INR)';var nl=document.createElement('label');nl.textContent='Number of persons';var np=document.createElement('input');np.type='number';np.min='1';np.max='99';np.step='1';np.value='1';np.setAttribute('aria-label','Number of persons');
 var t=document.createElement('p');t.className='wsnote';t.textContent=r[2];
 var b=document.createElement('button');b.type='button';b.textContent='Add to quotation';
 b.onclick=function(){var v=Number(p.value),c=Math.floor(Number(np.value));if(!n.value.trim()){alert('Enter the item name.');return}if(!p.value||!isFinite(v)||v<0){alert('Enter the rate per person first.');return}if(!isFinite(c)||c<1){alert('Enter the number of persons (1 or more).');return}addPP(n.value.trim(),v,c);b.textContent='Added';setTimeout(function(){b.textContent='Add to quotation'},2000)};
 d.appendChild(n);d.appendChild(pl);d.appendChild(p);d.appendChild(nl);d.appendChild(np);d.appendChild(t);d.appendChild(b);mkWrap.appendChild(d);
});
box.insertBefore(mkWrap,box.querySelector('h3'));

/* Edit a line after it is added: name or details, and rate. */
var origRender=renderBill;
function decorate(){
 [].slice.call(document.querySelectorAll('#ws-bill .billrow')).forEach(function(row,i){
  if(row.querySelector('.editBtn'))return;
  var e=document.createElement('button');e.type='button';e.className='editBtn';e.textContent='Edit';
  e.onclick=function(){
   var x=lines[i];if(!x)return;row.textContent='';
   var pp=x.base!==undefined;
   var n=document.createElement('input');n.value=pp?x.base:x.name;n.maxLength=160;n.setAttribute('aria-label','Item name or details');
   var p=document.createElement('input');p.type='number';p.min='0';p.step='0.01';p.value=String(pp?x.rate:x.amount/100);p.setAttribute('aria-label',pp?'Rate per person in INR':'Amount in INR');
   var q=document.createElement('input');q.type='number';q.min='1';q.step='1';q.value=pp?String(x.n):'1';q.setAttribute('aria-label','Number of persons');
   var sv=document.createElement('button');sv.type='button';sv.textContent='Save change';
   var cn=document.createElement('button');cn.type='button';cn.textContent='Cancel';
   sv.onclick=function(){var v=Number(p.value),c=Math.floor(Number(q.value));if(!n.value.trim()){alert('Enter the item name.');return}if(!p.value||!isFinite(v)||v<0){alert('Enter the rate.');return}if(pp){if(!isFinite(c)||c<1){alert('Enter the number of persons (1 or more).');return}lines[i]={name:ppName(n.value.trim(),v,c),amount:Math.round(v*c*100),base:n.value.trim(),rate:v,n:c}}else lines[i]={name:n.value.trim(),amount:Math.round(v*100)};renderBill()};
   cn.onclick=function(){renderBill()};
   var lb=document.createElement('label');lb.textContent=pp?'Rate per person (INR)':'Amount (INR)';
   row.style.display='block';row.appendChild(n);row.appendChild(lb);row.appendChild(p);
   if(pp){var l2=document.createElement('label');l2.textContent='Number of persons';row.appendChild(l2);row.appendChild(q)}
   row.appendChild(sv);row.appendChild(cn);
   return;
   row.style.display='block';row.appendChild(n);row.appendChild(p);row.appendChild(sv);row.appendChild(cn);
  };
  row.appendChild(e);
 });
}
window.renderBill=renderBill=function(){origRender.apply(this,arguments);decorate()};
renderBill();

/* Terms and conditions: separate editable points. Headings only; no amounts or rules are filled in. A heading with nothing after the colon is left out of the shared text. */
var tl=document.createElement('label');tl.setAttribute('for','quoteTerms');tl.textContent='Terms and conditions (edit each point)';
var tn=document.createElement('p');tn.className='wsnote';tn.textContent='Write the detail after each colon. Points left empty are not added to the text you send.';
var ta=document.createElement('textarea');ta.id='quoteTerms';ta.rows=7;ta.maxLength=1200;ta.style.cssText='width:100%;box-sizing:border-box';
ta.value='Travel allowance: \nFood: \nRoom for equipment and freshen up: \nAdvance payment: \nRemaining payment: ';
box.appendChild(tl);box.appendChild(tn);box.appendChild(ta);
var origShare2=billShareContent;
window.billShareContent=billShareContent=function(){
 var t=origShare2();
 var pts=ta.value.split('\n').map(function(x){return x.trim()}).filter(function(x){var i=x.indexOf(':');return x&&(i<0||x.slice(i+1).trim())});
 if(pts.length)t+='\n\nTerms and conditions:\n'+pts.map(function(x,i){return (i+1)+'. '+x}).join('\n');
 return t;
};
document.title=document.title;
})();
