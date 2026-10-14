import sqlite3
from pathlib import Path
root = Path(__file__).resolve().parents[1]
db = sqlite3.connect(':memory:')
db.executescript((root / 'drizzle/0000_stale_pyro.sql').read_text())
seed = 'INSERT INTO sales (product,category,amount,quantity,date) SELECT column1,column2,column3,column4,column5 FROM (VALUES (?,?,?,?,?),(?,?,?,?,?)) WHERE NOT EXISTS (SELECT 1 FROM sales)'
values = ['Mouse','Acessórios',12990,3,'2026-10-10','Monitor','Eletrônicos',119900,1,'2026-10-11']
db.execute(seed, values)
db.execute(seed, values)
assert db.execute('SELECT COUNT(*), SUM(amount*quantity), SUM(quantity) FROM sales').fetchone() == (2,158870,4)
assert db.execute('SELECT SUM(amount*quantity) FROM sales WHERE category=? AND date>=? AND date<=?', ('Acessórios','2026-10-01','2026-10-10')).fetchone()[0] == 38970
assert len(db.execute('SELECT date,SUM(amount*quantity) FROM sales GROUP BY date').fetchall()) == 2
assert db.execute('SELECT COUNT(*) FROM sales WHERE category=?', ("' OR 1=1 --",)).fetchone()[0] == 0
print('OK: agregações, filtros, parâmetros e seed sem duplicação.')
