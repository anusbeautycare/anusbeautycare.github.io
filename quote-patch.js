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
document.title=document.title;
})();
