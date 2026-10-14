import { env } from 'cloudflare:workers';
const categories=['Eletrônicos','Acessórios','Serviços','Outros'];
function db(){if(!env.DB) throw new Error('Banco indisponível');return env.DB}
export async function GET(request:Request){try{
 const u=new URL(request.url); const category=u.searchParams.get('category')||'';const start=u.searchParams.get('start')||'';const end=u.searchParams.get('end')||'';
 const where=' WHERE (? = \'\' OR category = ?) AND (? = \'\' OR date >= ?) AND (? = \'\' OR date <= ?)';
 const args=[category,category,start,start,end,end];
 const results=await db().batch([
 db().prepare('SELECT * FROM sales'+where+' ORDER BY date DESC,id DESC LIMIT 100').bind(...args),
 db().prepare('SELECT COUNT(*) AS count,COALESCE(SUM(amount*quantity),0) AS revenue,COALESCE(SUM(quantity),0) AS units FROM sales'+where).bind(...args),
 db().prepare('SELECT date,SUM(amount*quantity) AS total FROM sales'+where+' GROUP BY date ORDER BY date').bind(...args),
 db().prepare('SELECT category,SUM(amount*quantity) AS total FROM sales'+where+' GROUP BY category ORDER BY total DESC').bind(...args)]);
 return Response.json({sales:results[0].results,summary:results[1].results[0],daily:results[2].results,categories:results[3].results});
 }catch{return Response.json({error:'Não foi possível carregar os dados.'},{status:500})}}
export async function POST(request:Request){try{
 if(request.headers.get('origin') && request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Origem inválida'},{status:403});
 const b=await request.json() as any;
 if(b.action==='demo'){
 const items=[['Notebook','Eletrônicos',389900,1],['Mouse sem fio','Acessórios',12990,3],['Manutenção','Serviços',18000,2],['Teclado','Acessórios',24990,2],['Monitor','Eletrônicos',119900,1],['Consultoria','Serviços',35000,1],['Suporte','Serviços',15000,3],['Headset','Acessórios',19990,2]];
 const values=items.map((x,i)=>{const d=new Date();d.setUTCDate(d.getUTCDate()-(7-i)*3);return [...x,d.toISOString().slice(0,10)]});
 await db().prepare('INSERT INTO sales (product,category,amount,quantity,date) SELECT column1,column2,column3,column4,column5 FROM (VALUES '+values.map(()=>'(?,?,?,?,?)').join(',')+') WHERE NOT EXISTS (SELECT 1 FROM sales)').bind(...values.flat()).run();
 return Response.json({ok:true});
 }
 const {product,category,amount,quantity,date}=b;
 if(typeof product!=='string'||!product.trim()||product.length>100||!categories.includes(category)||!Number.isSafeInteger(amount)||amount<=0||amount>100000000||!Number.isSafeInteger(quantity)||quantity<1||quantity>10000||typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)return Response.json({error:'Confira os campos da venda.'},{status:400});
 await db().prepare('INSERT INTO sales (product,category,amount,quantity,date) VALUES (?,?,?,?,?)').bind(product.trim(),category,amount,quantity,date).run();return Response.json({ok:true},{status:201});
 }catch{return Response.json({error:'Não foi possível salvar a venda.'},{status:500})}}
