import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
export const sales = sqliteTable('sales', {
 id: integer('id').primaryKey({autoIncrement:true}),
 product: text('product').notNull(), category: text('category').notNull(),
 amount: integer('amount').notNull(), quantity: integer('quantity').notNull(), date: text('date').notNull()
});
