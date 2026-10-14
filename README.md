# Pulso — Dashboard de vendas | Projeto de portfólio

Uma aplicação web para transformar registros de vendas em indicadores e gráficos interativos. Projeto demonstrativo para apresentar habilidades em interfaces, APIs, SQL e visualização de dados.

## Demonstração interativa

A versão estática está pronta em `docs/` para publicação no **GitHub Pages**. Ela já abre com oito vendas fictícias e permite cadastrar novos exemplos, filtrar os gráficos e restaurar os dados iniciais.

**Ativação inicial pelo proprietário:** acesse **Settings → Pages → Deploy from a branch → main → /docs → Save**. Depois da publicação, o endereço esperado é:

**[Abrir demonstração](https://SrHenriqueBR.github.io/Sistema-em-banco-de-dados/)** — disponível após ativar o Pages.

| Versão | Armazenamento | Cálculos | Objetivo |
| --- | --- | --- | --- |
| Demo pública (`demo/`, compilada em `docs/`) | Navegador de cada visitante | JavaScript | Experimentar a interface sem servidor |
| Aplicação completa (`app/`) | SQLite / Cloudflare D1 | SQL na API | Demonstrar integração real com banco de dados |

A demo não acessa o banco privado e não envia vendas para um servidor. Se o armazenamento local estiver bloqueado, as alterações duram apenas até recarregar a página. GitHub Pages hospeda a demonstração estática; a API SQL exige hospedagem com suporte ao backend.

## Funcionalidades para explorar

- Cadastro de produto/serviço, categoria, preço unitário, quantidade e data.
- Receita total, ticket médio, número de vendas e quantidade de itens.
- Gráficos de área e barras com filtros por período e categoria.
- Atualização ao salvar e consulta automática a cada 10 segundos.
- Interface responsiva em português e valores em reais.

## O que este projeto demonstra

Integração frontend/backend, consultas SQL parametrizadas, agregações com `SUM`, `COUNT` e `GROUP BY`, validação de entradas e apresentação de resultados. A demo pública simula as respostas da API para permitir experimentação independente do banco.

## Atualizar a demonstração

Após instalar as dependências, execute:

```sh
npx vite build --config demo/vite.config.ts
```

Envie a pasta `docs/` atualizada ao GitHub. Para testar a demo localmente, execute `npx vite --config demo/vite.config.ts` e abra o endereço exibido.

---

## Aplicação completa com SQL


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
