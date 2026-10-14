# Pulso — painel de vendas com SQL

Site em português com cadastro de vendas, filtros por data e categoria, indicadores e gráficos de área/barras. Os gráficos atualizam após salvar e, opcionalmente, a cada 10 segundos.

## Tecnologias
- React + TypeScript + Vinext
- SQLite via Cloudflare D1 (banco persistente no servidor)
- SQL parametrizado na API; valores monetários em centavos inteiros
- Recharts e CSS responsivo

## Executar localmente
Requer Node.js 22.13 ou superior.

```sh
npm install
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_stale_pyro.sql
npm run dev
```

Abra o endereço informado no terminal. Aplique a migração acima apenas na primeira configuração do banco local. O banco local é independente do banco hospedado. Na página vazia, clique em **Experimentar com dados de exemplo** para inserir oito vendas fictícias; o botão não duplica os exemplos em um banco já preenchido.

## Estrutura
- `app/page.tsx`: painel, filtros, formulário e gráficos.
- `app/api/sales/route.ts`: consulta e cadastro com validação no servidor.
- `db/schema.ts`: definição da tabela.
- `drizzle/0000_stale_pyro.sql`: SQL de criação do banco.
- `sql/consultas.sql`: exemplos de agregação para estudo.

O painel mostra os últimos 100 registros na tabela; indicadores e gráficos consideram todos os registros que correspondem aos filtros. O preço digitado é unitário; a receita multiplica preço por quantidade.

## Hospedagem
O projeto hospedado no ChatGPT Sites usa D1 e acesso privado do proprietário. GitHub Pages não executa esta API nem hospeda seu banco. Para expor o projeto em outro ambiente, configure hospedagem compatível com Workers/D1 e autenticação antes de disponibilizar dados reais. O servidor local é voltado para desenvolvimento.

## Verificação
`npx tsc --noEmit` verifica TypeScript. `npm run build` compila a aplicação. `python tests/test_sql.py` verifica as agregações e o carregamento único dos exemplos em SQLite.
