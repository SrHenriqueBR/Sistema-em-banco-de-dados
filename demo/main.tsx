import React from 'react';
import {createRoot} from 'react-dom/client';
import Home from '../app/page';
import '../app/globals.css';
type Sale={id:number;product:string;category:string;amount:number;quantity:number;date:string};
const key='pulso-portfolio-demo-v1';
function seed():Sale[]{return [['Notebook','Eletrônicos',389900,1],['Mouse sem fio','Acessórios',12990,3],['Manutenção','Serviços',18000,2],['Teclado','Acessórios',24990,2],['Monitor','Eletrônicos',119900,1],['Consultoria','Serviços',35000,1],['Suporte','Serviços',15000,3],['Headset','Acessórios',19990,2]].map((x,i)=>{const d=new Date();d.setDate(d.getDate()-(7-i)*3);return {id:i+1,product:String(x[0]),category:String(x[1]),amount:Number(x[2]),quantity:Number(x[3]),date:d.toISOString().slice(0,10)}})}
let sales:Sale[]=seed();
try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(Array.isArray(saved)&&saved.every(s=>typeof s.product==='string'&&Number.isSafeInteger(s.amount)&&Number.isSafeInteger(s.quantity)&&typeof s.date==='string'))sales=saved}catch{}
function persist(){try{localStorage.setItem(key,JSON.stringify(sales))}catch{}}
const originalFetch=window.fetch.bind(window);
window.fetch=async (input,options)=>{
 const url=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url,location.href);
 if(url.pathname!=='/api/sales')return originalFetch(input,options);
 if(options?.method==='POST'){
 const body=JSON.parse(String(options.body));
 if(body.action==='demo'){if(!sales.length)sales=seed()}
 else{if(!String(body.product||'').trim()||!Number.isSafeInteger(body.amount)||body.amount<=0||!Number.isSafeInteger(body.quantity)||body.quantity<=0)return Response.json({error:'Confira os campos.'},{status:400});sales.push({...body,id:Math.max(0,...sales.map(s=>s.id))+1})}
 persist();return Response.json({ok:true},{status:201});
 }
 const c=url.searchParams.get('category'),start=url.searchParams.get('start'),end=url.searchParams.get('end');
 const rows=sales.filter(s=>(!c||s.category===c)&&(!start||s.date>=start)&&(!end||s.date<=end));
 const daily:Record<string,number>={},categories:Record<string,number>={};let revenue=0,units=0;
 for(const s of rows){const total=s.amount*s.quantity;revenue+=total;units+=s.quantity;daily[s.date]=(daily[s.date]||0)+total;categories[s.category]=(categories[s.category]||0)+total}
 return Response.json({sales:[...rows].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id).slice(0,100),summary:{count:rows.length,revenue,units},daily:Object.entries(daily).sort().map(([date,total])=>({date,total})),categories:Object.entries(categories).sort((a,b)=>b[1]-a[1]).map(([category,total])=>({category,total}))});
};
createRoot(document.getElementById('root')!).render(<><div className="demo-banner"><span><b>DEMONSTRAÇÃO DE PORTFÓLIO</b> · Dados fictícios. Alterações ficam apenas neste navegador. Cálculos em JavaScript; versão SQL no repositório.</span><div><a href="https://github.com/SrHenriqueBR/Sistema-em-banco-de-dados">Ver código ↗</a><button onClick={()=>{if(confirm('Restaurar os exemplos? Isso remove apenas as alterações desta demonstração.')){sales=seed();persist();location.reload()}}}>Restaurar exemplos</button></div></div><Home/></>);
// Override wording specific to the server-backed version for this static demo.
const observer=new MutationObserver(()=>{document.querySelectorAll('.sidebottom div').forEach(el=>{if(el.firstChild?.textContent==='Conectado ao SQL')el.firstChild.textContent='Modo demonstração'});document.querySelectorAll('.sidebottom small').forEach(el=>{if(el.textContent!=='Dados fictícios • Neste navegador')el.textContent='Dados fictícios • Neste navegador'});document.querySelectorAll('footer>span:last-child').forEach(el=>{if(el.textContent?.includes('Resultados calculados com SQL'))el.textContent='Demonstração local • JavaScript'})});observer.observe(document.getElementById('root')!,{childList:true,subtree:true});
