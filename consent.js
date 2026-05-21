/* OffPrice.me — Consent Manager + Analytics Loader
   Handles: GDPR/UAE PDPL cookie consent, GA4, Microsoft Clarity, AdSense
   Consent stored in localStorage as 'op-consent-v1'
*/
(function(){
'use strict';

var CFG={
  key:'op-consent-v1',
  ga4:'G-8H38LKX6SY',
  clarity:'wud2fqdxmr',
  adsense:'ca-pub-8758262297449266'
};

/* ── Storage ─────────────────────────────────────────────────── */
function getC(){try{return JSON.parse(localStorage.getItem(CFG.key))||null}catch(e){return null}}
function saveC(a,m){
  localStorage.setItem(CFG.key,JSON.stringify({analytics:!!a,marketing:!!m,ts:Date.now()}));
}

/* ── Script Loaders ──────────────────────────────────────────── */
function loadGA4(){
  if(window.__opGA4)return;window.__opGA4=true;
  var s=document.createElement('script');
  s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id='+CFG.ga4;
  document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){dataLayer.push(arguments)};
  gtag('js',new Date());
  gtag('config',CFG.ga4,{
    anonymize_ip:true,
    send_page_view:true,
    cookie_flags:'SameSite=None;Secure'
  });
}

function loadClarity(){
  if(window.__opClarity)return;window.__opClarity=true;
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window,document,'clarity','script',CFG.clarity);
}

function loadAdSense(){
  if(window.__opAds)return;window.__opAds=true;
  var s=document.createElement('script');
  s.async=true;
  s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+CFG.adsense;
  s.setAttribute('data-ad-client',CFG.adsense);
  s.crossOrigin='anonymous';
  document.head.appendChild(s);
}

function applyConsent(c){
  if(c.analytics){loadGA4();loadClarity();}
  if(c.marketing){loadAdSense();}
}

/* ── GA4 Event Helper (safe no-op when GA not loaded) ─────────── */
window.trackEvent=function(name,params){
  try{if(window.gtag)gtag('event',name,Object.assign({page:location.pathname},params||{}));}catch(e){}
};

/* ── Styles ──────────────────────────────────────────────────── */
var CSS=[
  /* Banner */
  '#op-cb{position:fixed;bottom:0;left:0;right:0;z-index:99999;padding:16px 24px;background:#111119;border-top:1px solid rgba(255,255,255,.08);box-shadow:0 -8px 40px rgba(0,0,0,.7);font-family:Outfit,sans-serif;animation:opIn .4s cubic-bezier(.34,1.56,.64,1)}',
  '@keyframes opIn{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}',
  '@keyframes opOut{from{transform:translateY(0);opacity:1}to{transform:translateY(100%);opacity:0}}',
  '.op-cb-i{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:20px;flex-wrap:wrap}',
  '.op-cb-ico{font-size:1.8rem;flex-shrink:0;line-height:1}',
  '.op-cb-txt{flex:1;min-width:200px}',
  '.op-cb-txt p{font-size:.82rem;color:#C0C0D0;line-height:1.55;margin:0}',
  '.op-cb-txt a{color:#F0C040;text-decoration:underline;text-underline-offset:2px}',
  '.op-cb-txt a:hover{color:#FFD760}',
  '.op-cb-btns{display:flex;flex-direction:column;align-items:center;gap:6px;flex-shrink:0}',
  '.op-btn-acc{background:linear-gradient(135deg,#E53E3E,#FF6B35);color:#fff;border:none;border-radius:10px;padding:13px 36px;font:700 .92rem Outfit,sans-serif;cursor:pointer;transition:opacity .2s,transform .15s;white-space:nowrap;box-shadow:0 4px 18px rgba(229,62,62,.45);letter-spacing:.3px}',
  '.op-btn-acc:hover{opacity:.9;transform:translateY(-1px)}',
  '.op-btn-acc:active{transform:translateY(0)}',
  '.op-btn-tiny{background:none;border:none;color:#4A4A6A;font:400 .7rem Outfit,sans-serif;cursor:pointer;padding:2px 4px;text-decoration:none;transition:color .2s;white-space:nowrap}',
  '.op-btn-tiny:hover{color:#888AA8;text-decoration:underline}',
  /* Modal overlay */
  '#op-cm{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);padding:16px;animation:opFadeIn .25s ease}',
  '@keyframes opFadeIn{from{opacity:0}to{opacity:1}}',
  '#op-cm-box{background:#15151F;border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:28px 26px;max-width:460px;width:100%;box-shadow:0 24px 64px rgba(0,0,0,.8);font-family:Outfit,sans-serif}',
  '#op-cm-box h3{font-size:1.1rem;color:#F0F0F8;margin:0 0 6px;font-weight:700}',
  '#op-cm-box .op-cm-sub{font-size:.78rem;color:#888AA8;margin:0 0 18px;line-height:1.6}',
  '.op-tog-row{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:14px 0;border-top:1px solid rgba(255,255,255,.07)}',
  '.op-tog-row:first-of-type{padding-top:0;border-top:none}',
  '.op-tl strong{font-size:.85rem;color:#F0F0F8;display:block;margin-bottom:3px;font-weight:600}',
  '.op-tl p{font-size:.74rem;color:#888AA8;margin:0;line-height:1.5}',
  '.op-sw{position:relative;width:44px;height:24px;flex-shrink:0;margin-top:1px}',
  '.op-sw input{opacity:0;width:0;height:0;position:absolute}',
  '.op-sw-sl{position:absolute;inset:0;border-radius:24px;cursor:pointer;background:#3E3E5A;transition:.25s}',
  '.op-sw-sl:before{content:"";position:absolute;width:18px;height:18px;left:3px;top:3px;border-radius:50%;background:#fff;transition:.25s;box-shadow:0 1px 4px rgba(0,0,0,.4)}',
  '.op-sw input:checked+.op-sw-sl{background:#E53E3E}',
  '.op-sw input:checked+.op-sw-sl:before{transform:translateX(20px)}',
  '.op-sw input:disabled+.op-sw-sl{background:#38B27A;cursor:not-allowed;opacity:.85}',
  '.op-cm-footer{display:flex;flex-direction:column;gap:8px;margin-top:22px}',
  '.op-btn-all2{width:100%;background:linear-gradient(135deg,#E53E3E,#FF6B35);color:#fff;border:none;border-radius:9px;padding:13px;font:700 .9rem Outfit,sans-serif;cursor:pointer;transition:opacity .2s;box-shadow:0 4px 16px rgba(229,62,62,.35)}',
  '.op-btn-all2:hover{opacity:.9}',
  '.op-btn-save{width:100%;background:transparent;color:#4A4A6A;border:none;border-radius:9px;padding:8px;font:400 .74rem Outfit,sans-serif;cursor:pointer;transition:color .2s;text-align:center}',
  '.op-btn-save:hover{color:#888AA8}',
  '.op-cm-close{position:absolute;top:14px;right:16px;background:transparent;border:none;color:#888AA8;font-size:1.2rem;cursor:pointer;line-height:1;padding:4px 8px;border-radius:6px;transition:color .2s}',
  '.op-cm-close:hover{color:#F0F0F8}',
  '@media(max-width:520px){.op-cb-i{gap:14px}.op-cb-btns{width:100%}.op-btn-acc{width:100%;padding:13px}#op-cm-box{padding:22px 18px}}'
].join('');

function injectCSS(){
  if(document.getElementById('op-css'))return;
  var s=document.createElement('style');s.id='op-css';s.textContent=CSS;
  document.head.appendChild(s);
}

/* ── Banner ──────────────────────────────────────────────────── */
function showBanner(){
  if(document.getElementById('op-cb'))return;
  injectCSS();
  var b=document.createElement('div');b.id='op-cb';
  b.innerHTML=
    '<div class="op-cb-i">'+
      '<div class="op-cb-ico">🍪</div>'+
      '<div class="op-cb-txt">'+
        '<p>We use cookies to improve your experience and for marketing. '+
        'See our <a href="/privacy.html">Privacy Policy</a>.</p>'+
      '</div>'+
      '<div class="op-cb-btns">'+
        '<button class="op-btn-acc" id="op-acc-btn">✓ Accept All Cookies</button>'+
        '<button class="op-btn-tiny" id="op-mgn-btn">Cookie settings</button>'+
      '</div>'+
    '</div>';
  document.body.appendChild(b);
  document.getElementById('op-acc-btn').addEventListener('click',function(){acceptAll();hideBanner();});
  document.getElementById('op-mgn-btn').addEventListener('click',function(){hideBanner();showModal();});
}

function hideBanner(){
  var b=document.getElementById('op-cb');
  if(!b)return;
  b.style.animation='opOut .3s ease forwards';
  setTimeout(function(){if(b.parentNode)b.parentNode.removeChild(b);},290);
}

/* ── Preferences Modal ───────────────────────────────────────── */
function showModal(){
  if(document.getElementById('op-cm'))return;
  injectCSS();
  var c=getC()||{analytics:true,marketing:true};
  var m=document.createElement('div');m.id='op-cm';
  m.innerHTML=
    '<div id="op-cm-box" style="position:relative">'+
      '<button class="op-cm-close" id="op-cm-x" aria-label="Close">✕</button>'+
      '<h3>🔧 Cookie Preferences</h3>'+
      '<p class="op-cm-sub">Choose which cookies to allow. Your preference is saved and can be changed anytime via the footer link.</p>'+
      '<div class="op-tog-row">'+
        '<div class="op-tl">'+
          '<strong>Necessary Cookies</strong>'+
          '<p>Theme preference and admin state. Required for the site to work — cannot be disabled.</p>'+
        '</div>'+
        '<label class="op-sw"><input type="checkbox" checked disabled><span class="op-sw-sl"></span></label>'+
      '</div>'+
      '<div class="op-tog-row">'+
        '<div class="op-tl">'+
          '<strong>Analytics Cookies</strong>'+
          '<p>Google Analytics 4 and Microsoft Clarity track page views, popular deals, scroll depth and user flow so we can improve the site.</p>'+
        '</div>'+
        '<label class="op-sw"><input type="checkbox" id="op-an-chk"'+(c.analytics?' checked':'')+'>'+
        '<span class="op-sw-sl"></span></label>'+
      '</div>'+
      '<div class="op-tog-row">'+
        '<div class="op-tl">'+
          '<strong>Advertising Cookies</strong>'+
          '<p>Google AdSense shows relevant ads to keep OffPrice.me free. Disabling this means ads may still appear but won\'t be personalised.</p>'+
        '</div>'+
        '<label class="op-sw"><input type="checkbox" id="op-mk-chk"'+(c.marketing?' checked':'')+'>'+
        '<span class="op-sw-sl"></span></label>'+
      '</div>'+
      '<div class="op-cm-footer">'+
        '<button class="op-btn-all2" id="op-all-btn">✓ Accept All Cookies</button>'+
        '<button class="op-btn-save" id="op-sv-btn">Save my current selection</button>'+
      '</div>'+
    '</div>';
  document.body.appendChild(m);
  document.getElementById('op-sv-btn').addEventListener('click',function(){
    var a=document.getElementById('op-an-chk').checked;
    var mk=document.getElementById('op-mk-chk').checked;
    saveC(a,mk);applyConsent({analytics:a,marketing:mk});closeModal();
  });
  document.getElementById('op-all-btn').addEventListener('click',function(){acceptAll();closeModal();});
  document.getElementById('op-cm-x').addEventListener('click',closeModal);
  m.addEventListener('click',function(e){if(e.target===m)closeModal();});
  document.addEventListener('keydown',escClose);
}

function escClose(e){if(e.key==='Escape')closeModal();}
function closeModal(){
  var m=document.getElementById('op-cm');
  if(m&&m.parentNode)m.parentNode.removeChild(m);
  document.removeEventListener('keydown',escClose);
}

function acceptAll(){saveC(true,true);applyConsent({analytics:true,marketing:true});}
function rejectAll(){saveC(false,false);}

/* ── Public API ──────────────────────────────────────────────── */
window.opConsent={
  open:function(){closeModal();showModal();},
  reset:function(){localStorage.removeItem(CFG.key);location.reload();}
};

/* ── Init ────────────────────────────────────────────────────── */
var existing=getC();
if(existing){
  applyConsent(existing);
}else{
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',showBanner);
  }else{
    setTimeout(showBanner,800);
  }
}

})();
