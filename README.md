# Pulso — Dashboard de Vendas com SQL

Projeto full stack de portfólio para demonstrar construção de dashboards, integração com banco de dados, APIs, filtros, indicadores e visualização de dados em uma interface pronta para uso.

> **Objetivo:** transformar registros de vendas em informações claras para apoiar decisões comerciais.

## Ver o projeto

- **Demo interativa:** https://SrHenriqueBR.github.io/Sistema-em-banco-de-dados/
- **Código-fonte:** este repositório
- **Apresentação comercial:** [`PORTFOLIO.md`](./PORTFOLIO.md)

> Se a demo ainda não abrir, o GitHub Pages precisa ser ativado em **Settings → Pages → Deploy from a branch → `main` → `/docs` → Save**.

---

## O que o sistema faz

O Pulso permite registrar vendas e acompanhar os resultados em um dashboard responsivo. A aplicação calcula os indicadores automaticamente e apresenta os dados em gráficos e tabelas.

### Funcionalidades

- Cadastro de produto ou serviço.
- Categorias de vendas.
- Valor unitário, quantidade e data.
- Receita total.
- Número de vendas realizadas.
- Ticket médio.
- Quantidade de itens vendidos.
- Gráfico de evolução da receita.
- Gráfico por categoria.
- Filtros por período e categoria.
- Atualização automática a cada 10 segundos.
- Histórico das vendas recentes.
- Dados fictícios para demonstração.
- Interface responsiva em português.
- Valores formatados em Real (BRL).

---

## Por que este projeto é útil no portfólio

Este projeto demonstra competências que aparecem em sistemas comerciais reais:

- modelagem e persistência de dados;
- consultas SQL parametrizadas;
- agregações com `SUM`, `COUNT` e `GROUP BY`;
- criação e consumo de API;
- validação de entradas no backend;
- filtros dinâmicos;
- dashboards e indicadores de negócio;
- visualização de dados;
- desenvolvimento frontend responsivo;
- organização de um projeto full stack;
- preparação de uma versão pública de demonstração.

---

## Arquitetura

```text
Usuário
   ↓
React / TypeScript
   ↓
API de vendas
   ↓
SQL / Cloudflare D1 (SQLite)
   ↓
Indicadores + gráficos + tabela
```

A versão completa utiliza SQL no servidor. Para permitir que recrutadores e clientes experimentem o projeto sem infraestrutura adicional, existe também uma versão estática em `docs/` preparada para GitHub Pages.

| Versão | Armazenamento | Cálculos | Objetivo |
| --- | --- | --- | --- |
| Demo pública (`demo/` → `docs/`) | Navegador do visitante | JavaScript | Testar a interface sem servidor |
| Aplicação completa (`app/`) | SQLite / Cloudflare D1 | SQL na API | Demonstrar integração real com banco de dados |

A demo pública utiliza apenas dados fictícios e não envia informações para um banco privado.

---

## Tecnologias

### Frontend

- React
- TypeScript
- Recharts
- CSS responsivo
- Lucide Icons

### Backend e dados

- API server-side
- Cloudflare Workers
- Cloudflare D1 / SQLite
- Drizzle ORM
- SQL parametrizado

### Desenvolvimento

- Vite
- Vinext / Next.js
- ESLint
- TypeScript
- Git / GitHub

---

## Estrutura principal

```text
app/
├── page.tsx                 # Dashboard, filtros, formulário e gráficos
└── api/sales/route.ts       # Consulta e cadastro de vendas

db/
└── schema.ts                # Definição da tabela

drizzle/
└── 0000_stale_pyro.sql      # Criação do banco

sql/
└── consultas.sql            # Consultas SQL para estudo e demonstração

demo/
└── main.tsx                 # Versão pública sem backend

docs/
└── index.html               # Build preparado para GitHub Pages

tests/
└── test_sql.py              # Testes de consultas e carga de exemplos
```

---

## Banco de dados

Os valores monetários são armazenados em centavos inteiros para evitar erros comuns de ponto flutuante.

Exemplos de operações demonstradas no projeto:

```sql
SELECT COUNT(*) AS count,
       COALESCE(SUM(amount * quantity), 0) AS revenue,
       COALESCE(SUM(quantity), 0) AS units
FROM sales;
```

```sql
SELECT category,
       SUM(amount * quantity) AS total
FROM sales
GROUP BY category
ORDER BY total DESC;
```

As consultas usadas pela API recebem os filtros por parâmetros, evitando concatenar diretamente dados do usuário no SQL.

---

## Executar localmente

Requer **Node.js 22.13 ou superior**.

```bash
npm install
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_stale_pyro.sql
npm run dev
```

Abra o endereço informado no terminal.

A migração deve ser executada apenas na primeira configuração do banco local. Em uma base vazia, o botão **Experimentar com dados de exemplo** adiciona oito vendas fictícias sem duplicar os registros caso a base já esteja preenchida.

---

## Atualizar a demo do GitHub Pages

Depois de instalar as dependências:

```bash
npx vite build --config demo/vite.config.ts
```

O build é gerado em `docs/`. Depois, envie as alterações ao GitHub.

Para executar apenas a demo local:

```bash
npx vite --config demo/vite.config.ts
```

---

## Verificação

```bash
npx tsc --noEmit
npm run build
python tests/test_sql.py
```

O painel limita a tabela visual aos últimos 100 registros encontrados, enquanto indicadores e gráficos consideram todos os registros correspondentes aos filtros.

---

## Possíveis aplicações comerciais

A mesma arquitetura pode ser adaptada para diferentes tipos de negócio, por exemplo:

- dashboard de vendas;
- controle de estoque;
- sistema administrativo;
- painel financeiro;
- gestão de clientes;
- chamados e suporte técnico;
- acompanhamento de serviços;
- relatórios gerenciais.

O layout, regras de negócio, banco de dados e indicadores podem ser personalizados conforme a necessidade do cliente.

---

## Autor

**Luiz Henrique**  
GitHub: [SrHenriqueBR](https://github.com/SrHenriqueBR)

Projeto desenvolvido para estudo, demonstração técnica e portfólio profissional.
