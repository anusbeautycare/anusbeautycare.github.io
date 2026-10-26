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
 ['Corrective Make up: dark spot, contouring, hi-light + eye make up (with product)','','Rate is written as 5500 or 6500: the first digit is written over. Not confirmed, so the rate is blank. Enter it after you confirm.'],
 ['Corrective Make up (second rate, confirm)','','Notes show (8000/-) next to a hard to read word. Not confirmed, so the rate is blank. Enter it only after you confirm.'],
 ['HD Make up / long lasting, contour, hi-lights, eye make up on good product (with products)','9500','8000 is crossed out, 9500 written.'],
 ['HD / long lasting (second rate, confirm)','','Notes show (12500) next to a word that reads like "want". Not confirmed, so the rate is blank. Enter it only after you confirm.'],
 ['Notes page 2 (rates with crossed-out older prices)',null],
 ['Man Make up (if the product is yours)','2000','Underlined. Product wording is not fully clear. CONFIRM.'],
 ['Corrective Make up (Advance)','3500','3000 is crossed out, 3500 written. Product not stated.'],
 ['HD Make up','4500','4000 is crossed out, 4500 written. Product not stated.']
];

function ppName(base,rate,c){return base+' ('+String.fromCharCode(8377)+rate+' per person per makeup x '+c+(c===1?' person)':' persons)')}
function addPP(base,rate,c){lines.push({name:ppName(base,rate,c),amount:Math.round(rate*c*100),base:base,rate:rate,n:c});renderBill()}
var mkWrap=document.createElement('div');mkWrap.id='mkList';
var mkTitle=document.createElement('h3');mkTitle.style.cssText='margin:22px 0 4px;font-size:18px';mkTitle.textContent='Makeup price list from your notes';
var mkInfo=document.createElement('p');mkInfo.className='wsnote';mkInfo.textContent='Rates are per person, per makeup, as written in your two note pages. Every rate is per person, per makeup. Set the number of persons on each item (it starts at 1). Change the name or rate here, then tap Add. After adding, tap Edit on the line to change it again. Page 2 also says: no change for Man and Basic Make up. Travel allowance (the circled Petrol) and food are listed under Terms and conditions below.';
mkWrap.appendChild(mkTitle);mkWrap.appendChild(mkInfo);
mk.forEach(function(r){
 if(r[1]===null){var h=document.createElement('p');h.className='wsnote';h.style.cssText='margin-top:16px;font-weight:600';h.textContent=r[0];mkWrap.appendChild(h);return}
 var d=document.createElement('div');d.style.cssText='border:1px solid #e3d6dc;border-radius:14px;padding:12px;margin-top:10px';
 var n=document.createElement('input');n.value=r[0];n.maxLength=140;n.setAttribute('aria-label','Item name');
 var p=document.createElement('input');p.type='number';p.min='0';p.step='0.01';p.value=r[1];p.placeholder='Enter rate per person';p.setAttribute('aria-label','Rate per person in INR');var pl=document.createElement('label');pl.textContent='Rate per person, per makeup (INR)';var nl=document.createElement('label');nl.textContent='Number of persons';var np=document.createElement('input');np.type='number';np.min='1';np.max='99';np.step='1';np.value='1';np.setAttribute('aria-label','Number of persons');
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
   var lb=document.createElement('label');lb.textContent=pp?'Rate per person, per makeup (INR)':'Amount (INR)';
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

/* Branded quote-only print / PDF output. Uses the page's own logo and totals. */
var st=document.createElement('style');st.textContent=
'#quoteDoc{display:none}'+
'body.qprint>*:not(#quoteDoc){display:none!important}'+
'body.qprint #quoteDoc{display:block;background:#fff;color:#222;padding:22px 20px;max-width:760px;margin:0 auto;font-family:Georgia,serif;box-sizing:border-box}'+
'#quoteDoc .qh{text-align:center;border-bottom:2px solid #770f2e;padding-bottom:12px}'+
'#quoteDoc .qh img{max-height:84px;max-width:60%;display:block;margin:0 auto 6px}'+
'#quoteDoc .qw{font-size:26px;color:#770f2e}#quoteDoc .qw small{display:block;font:11px Arial;letter-spacing:3px}'+
'#quoteDoc h1{font-size:20px;letter-spacing:4px;margin:16px 0 4px;text-align:center}'+
'#quoteDoc .qm{font:14px Arial;margin:4px 0}'+
'#quoteDoc table{width:100%;border-collapse:collapse;margin-top:14px;font:14px Arial}'+
'#quoteDoc th{background:#770f2e;color:#fff;text-align:left;padding:8px}#quoteDoc td{padding:8px;border-bottom:1px solid #e3d6dc;vertical-align:top}'+
'#quoteDoc td.a,#quoteDoc th.a{text-align:right;white-space:nowrap}#quoteDoc td small{display:block;color:#666;margin-top:2px}'+
'#quoteDoc .qt{text-align:right;font:bold 20px Georgia,serif;color:#770f2e;margin-top:12px}'+
'#quoteDoc .qb{text-align:right;font:12px Arial;color:#555}'+
'#quoteDoc h3{font:bold 14px Arial;margin:18px 0 4px;color:#770f2e}#quoteDoc ol{font:13px Arial;margin:0;padding-left:20px}#quoteDoc li{margin:3px 0}'+
'@media print{body.qprint{background:#fff}#quoteDoc{padding:0}@page{margin:14mm}}';
document.head.appendChild(st);
function esc(x){return String(x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function money(p){return String.fromCharCode(8377)+(p/100).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}
function buildDoc(){
 var d=$('quoteDoc');if(!d){d=document.createElement('div');d.id='quoteDoc';document.body.appendChild(d)}
 var logo=document.querySelector('img[alt$="current logo"]');
 var rows=lines.map(function(l,i){var a=l.base!==undefined?esc(l.base)+'<small>'+String.fromCharCode(8377)+l.rate+' per person per makeup x '+l.n+(l.n===1?' person':' persons')+'</small>':esc(l.name);return '<tr><td>'+(i+1)+'</td><td>'+a+'</td><td class="a">'+money(l.amount)+'</td></tr>'});
 var pts=ta.value.split('\n').map(function(x){return x.trim()}).filter(function(x){var i=x.indexOf(':');return x&&(i<0||x.slice(i+1).trim())});
 var cl=$('billClient').value.trim(),nt=$('quoteNote').value.trim();
 d.innerHTML='<div class="qh">'+(logo?'<img src="'+logo.src+'" alt="Anu\'s Beauty Care logo">':'')+'<div class="qw">Anu\'s<small>BEAUTY CARE</small></div></div>'+
 '<h1>'+(isQuote()?'QUOTATION':'BILL DRAFT')+'</h1>'+(cl?'<p class="qm"><b>Client:</b> '+esc(cl)+'</p>':'')+(nt?'<p class="qm">'+esc(nt)+'</p>':'')+
 '<table><thead><tr><th>#</th><th>Description</th><th class="a">Amount</th></tr></thead><tbody>'+(rows.join('')||'<tr><td colspan="3">No items added yet.</td></tr>')+'</tbody></table>'+
 '<div class="qt">Total '+esc($('billTotal').textContent)+'</div><div class="qb">'+esc($('billBreakdown').textContent)+'</div>'+
 (pts.length?'<h3>Terms and conditions</h3><ol>'+pts.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ol>':'');
}
function doPrint(){buildDoc();document.body.classList.add('qprint');window.__qp=1;setTimeout(function(){window.print()},50)}
window.addEventListener('afterprint',function(){document.body.classList.remove('qprint')});
window.__anuQuotePreview=function(){buildDoc();document.body.classList.add('qprint')};
var pb=document.createElement('button');pb.type='button';pb.id='quotePrint';pb.textContent='Print / Save as PDF (branded)';pb.onclick=doPrint;
var oldPrint=btn(/^Print draft$/);
if(oldPrint&&oldPrint.parentNode)oldPrint.parentNode.insertBefore(pb,oldPrint.nextSibling);
document.title=document.title;
})();
