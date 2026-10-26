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
 ['With Anu\'s products',null],
 ['Basic Makeup + Hairstyle','2700',''],
 ['Corrective Makeup: dark-spot correction, contouring and highlights, with eye makeup','6500','8000'],
 ['HD / Long-lasting Makeup: contouring, highlights and eye makeup, using good-quality products','9500','12500'],
 ['If the client provides the products',null],
 ["Men's Makeup",'2000',''],
 ['Corrective Makeup (Advance)','4550',''],
 ['HD Makeup','6550','']
];

function ppSub(rate,c,pk){var n=pk?'package':'person';return String.fromCharCode(8377)+rate+' per '+(pk?'package':'person per makeup')+' x '+c+' '+n+(c===1?'':'s')}
function ppName(base,rate,c,pk){return base+' ('+ppSub(rate,c,pk)+')'}
function addPP(base,rate,c,pk){lines.push({name:ppName(base,rate,c,pk),amount:Math.round(rate*c*100),base:base,rate:rate,n:c,pk:pk});renderBill()}
var mkWrap=document.createElement('div');mkWrap.id='mkList';
var mkTitle=document.createElement('h3');mkTitle.style.cssText='margin:22px 0 4px;font-size:18px';mkTitle.textContent='Makeup price list from your notes';
var mkInfo=document.createElement('p');mkInfo.className='wsnote';mkInfo.textContent='Rate per person, per makeup. Set persons, tap Add. Use Edit on an added line to change it.';
mkWrap.appendChild(mkTitle);mkWrap.appendChild(mkInfo);
var reg=[];
function hdr(w,t){var h=document.createElement('div');h.style.cssText='display:flex;gap:8px;font-size:12px;color:#7a6a70;margin:8px 0 2px';h.innerHTML='<span style="flex:1">'+t[0]+'</span><span style="width:64px">'+t[1]+'</span><span style="width:74px"></span>';w.appendChild(h)}
var curGrp='';function buildCards(list,wrap,pk){curGrp='';hdr(wrap,pk?['Rate per package (INR)','Qty']:['Discounted rate (INR)','Persons']);list.forEach(function(r){
 if(r[1]===null){var h=document.createElement('p');h.className='wsnote';h.style.cssText='margin:12px 0 0;font-weight:600';h.textContent=r[0];curGrp=r[0];wrap.appendChild(h);return}
 var d=document.createElement('div');d.className='qrow';d.style.cssText='border-top:1px solid #eadde2;padding:8px 0';
 var nm=document.createElement('div');nm.textContent=r[0];nm.style.cssText='font-size:14px;line-height:1.3;margin-bottom:6px';
 var line=document.createElement('div');line.style.cssText='display:flex;gap:8px;align-items:center';
 var p=document.createElement('input');p.type='number';p.min='0';p.step='0.01';p.value=r[1];p.placeholder='Rate to confirm';p.setAttribute('aria-label',(pk?'Rate per package in INR':'Rate per person in INR'));p.style.cssText='flex:1;min-width:0;width:auto;margin:0;height:40px';
 var np=document.createElement('input');np.type='number';np.min='1';np.max='99';np.step='1';np.value='1';np.setAttribute('aria-label',pk?'Number of packages':'Number of persons');np.style.cssText='width:64px;margin:0;height:40px;flex:none';
 var b=document.createElement('button');b.type='button';b.textContent='Add';b.style.cssText='width:74px;flex:none;height:40px;margin:0;padding:0';
 b.onclick=function(){var v=Number(p.value),c=Math.floor(Number(np.value));if(!p.value||!isFinite(v)||v<0){alert('Enter the rate first.');return}if(!isFinite(c)||c<1){alert('Enter the quantity (1 or more).');return}addPP(r[0],v,c,pk);b.textContent='Added';setTimeout(function(){b.textContent='Add'},1500)};
 if(!pk&&r[2]){var rg=document.createElement('div');rg.textContent='Our rates \u20B9'+Number(r[2]).toLocaleString('en-IN')+'';rg.style.cssText='font-size:12px;color:#7a6a70;margin:-2px 0 6px';d.insertBefore(rg,nm.nextSibling)}
 line.appendChild(p);line.appendChild(np);line.appendChild(b);d.appendChild(nm);d.appendChild(line);wrap.appendChild(d);
 reg.push({name:r[0],p:p,pk:pk,list:wrap.id,grp:curGrp});
});}
box.insertBefore(mkWrap,box.querySelector('h3'));
buildCards(mk,mkWrap,false);
var br=[
 ['Pre Bridal Basic: face and back bleach / de-tan, bridal facial, hand and full leg wax, manicure, pedicure, threading','5500',''],
 ['Pre Bridal Advanced: face and back bleach / de-tan, advanced bridal facial, hand and full leg wax, body polishing, hand nail art, threading','12000',''],
 ['Pre Bridal Premium: face / body bleach, face polishing, advanced body polishing and pack, special facial, full-body or hand-and-leg wax, hair spa, hand and toe nail art, threading','20000',''],
 ['Make-up + Pre Bridal: 1 HD make-up + Basic pre bridal','18000',''],
 ['Make-up + Pre Bridal: 1 HD + 1 Haldi / Sangeet + Basic pre bridal','30500',''],
 ['Make-up + Pre Bridal: 1 HD + 1 Haldi / Sangeet + Advanced pre bridal','37500',''],
 ['Make-up + Pre Bridal: 2 HD + 1 Haldi / Sangeet + 1 touch-up + Basic pre bridal','43000',''],
 ['Make-up + Pre Bridal: 2 HD + 1 Haldi / Sangeet + 1 touch-up + Advanced pre bridal','55000',''],
 ['Make-up + Pre Bridal: 2 HD + 1 Haldi / Sangeet + 1 touch-up + Premium pre bridal','62500',''],
 ["Anu's Package (rates to confirm before billing)",null],
 ["Anu's Package 1: 1 HD make-up + Basic pre bridal",'',"The app page shows 15,500 for this package. Confirmation needed before billing."],
 ["Anu's Package 2: 1 HD + 1 Haldi / Sangeet + Basic pre bridal",'',"The app page shows 25,500. Confirmation needed before billing."],
 ["Anu's Package 3: 1 HD + 1 Haldi / Sangeet + Advanced pre bridal",'',"The app page shows 33,000. Confirmation needed before billing."],
 ["Anu's Package 4: 2 HD + 1 Haldi / Sangeet + 1 touch-up + Basic pre bridal",'',"The app page shows 39,000. Confirmation needed before billing."],
 ["Anu's Package 5: 2 HD + 1 Haldi / Sangeet + 1 touch-up + Advanced pre bridal",'',"The app page shows 50,000. Confirmation needed before billing."],
 ["Anu's Package 6: 2 HD + 1 Haldi / Sangeet + 1 touch-up + Premium pre bridal",'',"The app page shows 58,000. Confirmation needed before billing."]
];
var brWrap=document.createElement('div');brWrap.id='brList';
var brTitle=document.createElement('h3');brTitle.style.cssText='margin:22px 0 4px;font-size:18px';brTitle.textContent='Bridal packages';
var brInfo=document.createElement('p');brInfo.className='wsnote';brInfo.textContent='Rate is per package. Anu\'s Package rates stay blank until confirmed.';
var brBody=document.createElement('div');brBody.hidden=true;brTitle.textContent='Bridal packages \u25B8';brTitle.style.cursor='pointer';brTitle.setAttribute('role','button');brTitle.tabIndex=0;
brTitle.onclick=function(){brBody.hidden=!brBody.hidden;brTitle.textContent='Bridal packages '+(brBody.hidden?'\u25B8':'\u25BE')};
brWrap.appendChild(brTitle);brBody.appendChild(brInfo);buildCards(br,brBody,true);brWrap.appendChild(brBody);
box.insertBefore(brWrap,mkWrap.nextSibling);


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
   var p=document.createElement('input');p.type='number';p.min='0';p.step='0.01';p.value=String(pp?x.rate:x.amount/100);p.setAttribute('aria-label',pp?(x.pk?'Rate per package in INR':'Rate per person in INR'):'Amount in INR');
   var q=document.createElement('input');q.type='number';q.min='1';q.step='1';q.value=pp?String(x.n):'1';q.setAttribute('aria-label','Number of persons');
   var sv=document.createElement('button');sv.type='button';sv.textContent='Save change';
   var cn=document.createElement('button');cn.type='button';cn.textContent='Cancel';
   sv.onclick=function(){var v=Number(p.value),c=Math.floor(Number(q.value));if(!n.value.trim()){alert('Enter the item name.');return}if(!p.value||!isFinite(v)||v<0){alert('Enter the rate.');return}if(pp){if(!isFinite(c)||c<1){alert('Enter the quantity (1 or more).');return}lines[i]={name:ppName(n.value.trim(),v,c,x.pk),amount:Math.round(v*c*100),base:n.value.trim(),rate:v,n:c,pk:x.pk}}else lines[i]={name:n.value.trim(),amount:Math.round(v*100)};renderBill()};
   cn.onclick=function(){renderBill()};
   var lb=document.createElement('label');lb.textContent=pp?(x.pk?'Rate per package (INR)':'Rate per person, per makeup (INR)'):'Amount (INR)';
   row.style.display='block';row.appendChild(n);row.appendChild(lb);row.appendChild(p);
   if(pp){var l2=document.createElement('label');l2.textContent=x.pk?'Quantity (number of packages)':'Number of persons';row.appendChild(l2);row.appendChild(q)}
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
var TERMS=['Travel allowance (petrol): travel allowance arrangements will be agreed with the client before the booking is confirmed.','Food: food arrangements for the makeup team will be agreed before the booking is confirmed.','Room for equipment and freshen up: arrangements for a room or space to keep the equipment and to freshen up will be agreed before the booking is confirmed.','Advance payment: the advance payment amount and payment date will be agreed before the booking is confirmed.','Remaining payment: the remaining payment amount and payment schedule will be agreed before the booking is confirmed.','Validity: the rates quoted are valid for 7 days from the date of this quotation.'].join('\n');
var tl=document.createElement('label');tl.setAttribute('for','quoteTerms');tl.textContent='Terms and conditions (edit each point)';
var tn=document.createElement('p');tn.className='wsnote';tn.textContent='Edit any point. Amounts and timing are not filled in; add them when confirmed.';
var ta=document.createElement('textarea');ta.id='quoteTerms';ta.rows=7;ta.maxLength=1200;ta.style.cssText='width:100%;box-sizing:border-box';
ta.value=TERMS;
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
'#quoteDoc{display:none}'+'#ws-bill .wsgrid>*{min-width:0;max-width:100%}#quoteExtras,#savedDocs{min-width:0;max-width:100%}'+
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
'#ws-bill .billrow{display:flex;flex-wrap:wrap;gap:8px;align-items:center}#ws-bill .billrow>span:first-child{flex:1 1 100%}#ws-bill .billrow>span:nth-child(2){flex:1 1 auto;font-weight:600}#ws-bill .billrow>button{padding:8px 14px;min-height:0;height:auto;align-self:center}#ws-bill .billrow input{width:100%;box-sizing:border-box;margin:4px 0}'+
'body.qprint #quoteDoc{border:1.2px solid #c4a15a;padding:22px 20px;font-family:Georgia,serif}'+'#quoteDoc .qh{border-bottom:1px solid #c4a15a}#quoteDoc .qh img{max-height:150px;max-width:80%}'+'#quoteDoc h1{font-weight:normal;letter-spacing:.45em;color:#770f2e}'+'#quoteDoc th{background:none;color:#770f2e;border-top:1.2px solid #c4a15a;border-bottom:1.2px solid #c4a15a}#quoteDoc td{border-bottom:.6px solid #eadfc8}#quoteDoc tr.g td{background:#fbf6ea;color:#770f2e;font:bold 12px Arial;letter-spacing:.12em;text-transform:uppercase}#quoteDoc s{color:#8a7f83}#quoteDoc td.d{color:#770f2e;font-weight:bold}#quoteDoc h3{border-bottom:1px solid #c4a15a;padding-bottom:4px;text-transform:uppercase;letter-spacing:.12em;font-size:13px}'+'body.qprint #quoteDoc.z{padding:0;max-width:760px;font-family:"Cormorant Garamond",Georgia,serif;color:#2a2521}'+
'#quoteDoc .zf{border:1.5px solid;border-image:linear-gradient(135deg,#d9c48a,#a8864f 50%,#e6d6a8) 1;padding:20px 18px 16px;margin:6px}'+
'#quoteDoc .zl{text-align:center}#quoteDoc .zl img{height:48mm;max-height:190px;max-width:75%;object-fit:contain}'+
'#quoteDoc .zt{text-align:center;font-style:italic;font-size:14px;letter-spacing:.1em;color:#770f2e;margin-top:6px}'+
'#quoteDoc .zd{display:flex;align-items:center;justify-content:center;gap:10px;margin:10px 0 12px}#quoteDoc .zd i{width:70px;height:1px;background:#bdb3a4}#quoteDoc .zd b{width:6px;height:6px;background:#a8864f;transform:rotate(45deg)}'+
'#quoteDoc .zh{color:#770f2e;font:300 24px Inter,Arial,sans-serif;letter-spacing:.18em;text-align:center}'+
'#quoteDoc .zi{display:flex;gap:10px;border-top:1px solid #d9d2c6;border-bottom:1px solid #e3d6b8;margin-top:16px;padding:8px 4px 10px}#quoteDoc .zi div{flex:1;min-height:34px;border-bottom:1px solid #8c7a55;font-size:16px;overflow-wrap:anywhere}'+
'#quoteDoc .lb{display:block;font:500 9px Inter,Arial,sans-serif;letter-spacing:.26em;color:#770f2e;text-transform:uppercase;margin-bottom:3px}'+
'#quoteDoc .zf table{width:100%;border-collapse:collapse;margin-top:14px}#quoteDoc .zf th{background:none;font:500 9px Inter,Arial,sans-serif;letter-spacing:.2em;color:#770f2e;text-transform:uppercase;padding:8px 5px;border-top:0;border-bottom:1px solid #b8975c;text-align:left}'+
'#quoteDoc .zf th.c,#quoteDoc .zf td.c{text-align:center}#quoteDoc .zf th.a,#quoteDoc .zf td.a{text-align:right;white-space:nowrap}'+
'#quoteDoc .zf td{padding:9px 5px;border-bottom:1px solid #eee6d6;font:400 12.5px Inter,Arial,sans-serif;vertical-align:top}#quoteDoc .zf td.b{font:500 17px/1.2 "Cormorant Garamond",Georgia,serif}#quoteDoc .zf td.b small{display:block;font:italic 400 13px "Cormorant Garamond",Georgia,serif;color:#6d6459;margin-top:2px}'+
'#quoteDoc .zf td.d{font-weight:600;color:#770f2e}#quoteDoc .zf tr.g td{font:500 9px Inter,Arial,sans-serif;letter-spacing:.24em;color:#770f2e;text-transform:uppercase;padding:12px 5px 5px;border-bottom:1px solid #b8975c;background:none}#quoteDoc .zf s{color:#8b8378}'+
'#quoteDoc .zf th.a{white-space:normal;line-height:1.3}#quoteDoc .zf td.a{padding-left:2px;padding-right:2px}'+'#quoteDoc .zn{margin-top:14px}#quoteDoc .zn p{margin:4px 0;font:500 14px/1.3 "Cormorant Garamond",Georgia,serif}'+
'#quoteDoc .zT{text-align:right;margin-top:12px;font:500 22px "Cormorant Garamond",Georgia,serif}#quoteDoc .zB{text-align:right;font:11px Inter,Arial,sans-serif;color:#6d6459}'+
'#quoteDoc .zy{text-align:center;font-style:italic;font-size:16px;color:#6d6459;margin-top:16px}'+
'@media print{body.qprint{background:#fff}#quoteDoc{padding:0}@page{margin:14mm}}';
document.head.appendChild(st);var fl=document.createElement('link');fl.rel='stylesheet';fl.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500&display=swap';document.head.appendChild(fl);
function esc(x){return String(x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function money(p){return String.fromCharCode(8377)+(p/100).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}
function zHead(title,sub){
 var logo=document.querySelector('img[alt$="current logo"]');var nt=$('quoteNote').value.trim(),cl=$('billClient').value.trim();
 return '<div class="zf"><div class="zl">'+(logo?'<img src="'+logo.src+'" alt="Anu\'s Beauty Care logo">':'<div style="font-size:26px;color:#770f2e">Anu\'s Beauty Care</div>')+'</div><div class="zt">A space for beauty. A moment for you.</div><div class="zd"><i></i><b></b><i></i></div><div class="zh">'+title+'</div>'+(sub?'<div style="text-align:center;font:italic 15px Georgia,serif;color:#6d6459;margin-top:4px">'+sub+'</div>':'')+
 '<div class="zi"><div><span class="lb">Client</span>'+esc(cl)+'</div>'+(nt?'<div style="flex:2"><span class="lb">Date / Venue</span>'+esc(nt)+'</div>':'<div><span class="lb">Date</span></div><div><span class="lb">Venue</span></div>')+'</div>';
}
function zTerms(extra){
 var pts=ta.value.split('\n').map(function(x){return x.trim()}).filter(function(x){var i=x.indexOf(':');return x&&(i<0||x.slice(i+1).trim())});
 return '<div class="zn">'+(extra?'<p>'+extra+'</p>':'')+'<span class="lb">Terms and conditions</span><ul style="margin:6px 0 0;padding-left:16px">'+pts.map(function(x){var i=x.indexOf(':');return '<li style="margin:4px 0;font:500 14px/1.3 Cormorant Garamond,Georgia,serif">'+(i<0?esc(x):'<b style="font-weight:600">'+esc(x.slice(0,i))+':</b> '+esc(x.slice(i+1).trim()))+'</li>'}).join('')+'</ul></div><div class="zy">Thank You</div></div>';
}
function buildDoc(){
 var d=$('quoteDoc');if(!d){d=document.createElement('div');d.id='quoteDoc';document.body.appendChild(d)}d.className='z';
 var rows=lines.map(function(l,i){var a=l.base!==undefined?esc(l.base)+'<small>'+ppSub(l.rate,l.n,l.pk)+'</small>':esc(l.name);return '<tr><td class="c">'+(i+1)+'</td><td class="b">'+a+'</td><td class="a d">'+money(l.amount)+'</td></tr>'});
 d.innerHTML=zHead(isQuote()?'QUOTATION':'BILL DRAFT')+
 '<table><thead><tr><th class="c" style="width:40px">Sr.<br>No.</th><th>Particular</th><th class="a">Amount</th></tr></thead><tbody>'+(rows.join('')||'<tr><td colspan="3">No items added yet.</td></tr>')+'</tbody></table>'+
 '<div class="zT">Total '+esc($('billTotal').textContent)+'</div><div class="zB">'+esc($('billBreakdown').textContent.replace(/\s*Draft total only\.?/,''))+'</div>'+zTerms('');
}
function doPrint(){buildDoc();document.body.classList.add('qprint');window.__qp=1;setTimeout(function(){window.print()},50)}
window.addEventListener('afterprint',function(){document.body.classList.remove('qprint')});
window.__anuQuotePreview=function(){buildDoc();document.body.classList.add('qprint')};
var pb=document.createElement('button');pb.type='button';pb.id='quotePrint';pb.textContent='Print / Save as PDF (branded)';pb.onclick=doPrint;
var oldPrint=btn(/^Print draft$/);
if(oldPrint&&oldPrint.parentNode){oldPrint.parentNode.insertBefore(pb,oldPrint.nextSibling);var hn=document.createElement('p');hn.className='wsnote';hn.textContent='PDF: tap the branded button, then in the print screen choose Save as PDF (iPhone: use Share, Print, then pinch the preview open and share or save the PDF).';pb.parentNode.insertBefore(hn,pb.nextSibling)}

/* Price list quotation (from the owner's handwritten notes): customer-facing document with the Anu logo. */
function buildPriceDoc(){
 var d=$('quoteDoc');if(!d){d=document.createElement('div');d.id='quoteDoc';document.body.appendChild(d)}d.className='z';
 var rows=[],lastG=null,n=0;var R=String.fromCharCode(8377);reg.filter(function(r){return !r.pk}).forEach(function(r){
  var v=r.p.value,x=mk.filter(function(m){return m[0]===r.name})[0],rg=x&&x[2];
  if(r.grp!==lastG){lastG=r.grp;n=0;rows.push('<tr class="g"><td colspan="4">'+esc(lastG)+'</td></tr>')}n++;
  rows.push('<tr><td class="c">'+n+'</td><td class="b">'+esc(r.name)+'</td><td class="a">'+(rg?'<s>'+R+Number(rg).toLocaleString('en-IN')+'</s>':'&mdash;')+'</td><td class="a d">'+(v?R+Number(v).toLocaleString('en-IN'):'To be confirmed')+'</td></tr>')});
 d.innerHTML=zHead('QUOTATION','Makeup rates, per person, per makeup')+
 '<table><thead><tr><th class="c" style="width:40px">Sr.<br>No.</th><th>Particular</th><th class="a">Our rates</th><th class="a">Discounted rates</th></tr></thead><tbody>'+rows.join('')+'</tbody></table>'+zTerms('No change in rate for Men\'s Makeup and Basic Makeup + Hairstyle.');
}
function doPricePrint(){buildPriceDoc();document.body.classList.add('qprint');window.__qp=1;setTimeout(function(){window.print()},50)}
window.__anuPricePreview=function(){buildPriceDoc();document.body.classList.add('qprint')};
var pp2=document.createElement('button');pp2.type='button';pp2.id='quotePricePrint';pp2.textContent='Print / PDF: makeup price list quotation';pp2.onclick=doPricePrint;
mkWrap.appendChild(pp2);

/* Saved quotations and bills: kept only in this phone's browser storage, shown in their own section. */
var SK='anuQuoteList.v1';
function loadList(){try{return JSON.parse(localStorage.getItem(SK)||'[]')}catch(e){return []}}
function storeList(a){try{localStorage.setItem(SK,JSON.stringify(a));return true}catch(e){alert('Could not save on this device.');return false}}
var sec=document.createElement('div');sec.className='wspanel';sec.id='savedDocs';
var panel=panelTitle&&panelTitle.closest?panelTitle.closest('.wspanel'):null;
if(panel&&panel.parentNode)panel.parentNode.insertBefore(sec,panel.nextSibling);else box.parentNode.appendChild(sec);
function renderSaved(){
 var a=loadList();sec.textContent='';
 var h=document.createElement('h2');h.textContent='Created quotations and bills ('+a.length+')';sec.appendChild(h);
 var n=document.createElement('p');n.className='wsnote';n.textContent='Saved on this phone only. Not sent or shared.';sec.appendChild(n);
 if(!a.length){var e=document.createElement('p');e.className='wsnote';e.textContent='Nothing saved yet. Build a quotation or bill above and tap Save to list.';sec.appendChild(e);return}
 a.slice().reverse().forEach(function(x){
  var tot=x.lines.reduce(function(t,l){return t+l.amount},0);
  var d=document.createElement('div');d.style.cssText='border-top:1px solid #eadde2;padding:10px 0';
  var t=document.createElement('div');t.style.cssText='font-weight:600;font-size:15px';t.textContent=(x.type==='quote'?'Quotation':'Bill')+' - '+(x.client||'No client name');
  var m=document.createElement('div');m.style.cssText='font-size:13px;color:#7a6a70;margin:2px 0 8px';m.textContent=x.date+' | '+x.lines.length+' item'+(x.lines.length===1?'':'s')+' | '+money(tot);
  var r=document.createElement('div');r.style.cssText='display:flex;gap:8px';
  function mb(txt,fn){var b=document.createElement('button');b.type='button';b.textContent=txt;b.style.cssText='flex:1;height:40px;margin:0;padding:0';b.onclick=fn;r.appendChild(b)}
  mb('Open',function(){openDoc(x)});
  mb('Print / PDF',function(){openDoc(x);setTimeout(doPrint,100)});
  mb('Delete',function(){if(confirm('Delete this saved item?')){storeList(loadList().filter(function(y){return y.id!==x.id}));renderSaved()}});
  d.appendChild(t);d.appendChild(m);d.appendChild(r);sec.appendChild(d);
 });
}
function openDoc(x){
 lines.length=0;x.lines.forEach(function(l){lines.push(JSON.parse(JSON.stringify(l)))});
 $('docType').value=x.type;$('billClient').value=x.client||'';$('quoteNote').value=x.note||'';ta.value=x.terms||ta.value;
 labels();renderBill();$('quoteExtras').scrollIntoView({behavior:'smooth',block:'start'});
}
var sb=document.createElement('button');sb.type='button';sb.id='quoteSave';sb.textContent='Save to Created list';
sb.onclick=function(){
 if(!lines.length){alert('Add at least one item first.');return}
 var a=loadList();a.push({id:Date.now()+'-'+Math.random().toString(36).slice(2,7),type:isQuote()?'quote':'bill',client:$('billClient').value.trim(),note:$('quoteNote').value.trim(),terms:ta.value,date:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),lines:JSON.parse(JSON.stringify(lines))});
 if(storeList(a)){renderSaved();sb.textContent='Saved';setTimeout(function(){sb.textContent='Save to Created list'},1500)}
};
pb.parentNode.insertBefore(sb,pb);
renderSaved();
document.title=document.title;
})();
