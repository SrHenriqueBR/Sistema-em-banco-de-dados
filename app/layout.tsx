import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Pulso | Vendas e resultados',description:'Seu negócio em números. Painel de vendas com banco SQL.'};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="pt-BR"><body>{children}</body></html>}
