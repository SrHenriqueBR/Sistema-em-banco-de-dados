-- Receita total, quantidade de vendas e unidades vendidas.
-- amount armazena o preço unitário em CENTAVOS.
SELECT COUNT(*) AS vendas, SUM(amount * quantity) / 100.0 AS receita,
       SUM(quantity) AS itens FROM sales;

-- Gráfico por dia
SELECT date, SUM(amount * quantity) / 100.0 AS receita
FROM sales GROUP BY date ORDER BY date;

-- Participação por categoria
SELECT category, SUM(amount * quantity) / 100.0 AS receita
FROM sales GROUP BY category ORDER BY receita DESC;

-- Exemplo de filtro parametrizado usado na aplicação
SELECT * FROM sales WHERE category = ? AND date >= ? AND date <= ?
ORDER BY date DESC, id DESC;
