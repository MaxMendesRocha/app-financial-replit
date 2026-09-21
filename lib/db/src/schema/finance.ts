import { relations } from "drizzle-orm";
import {
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const accountsTable = pgTable("finance_accounts", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  name: text("name").notNull(),
  institution: text("institution").notNull(),
  kind: text("kind").notNull(),
  balance: numeric("balance", { precision: 14, scale: 2 }).notNull().default("0"),
  color: text("color").notNull().default("#7765E3"),
});

export const categoriesTable = pgTable("finance_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
  budget: numeric("budget", { precision: 14, scale: 2 }).notNull().default("0"),
});

export const transactionsTable = pgTable("finance_transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  account: text("account").notNull(),
  date: date("date").notNull(),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const goalsTable = pgTable("finance_goals", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  name: text("name").notNull(),
  target: numeric("target", { precision: 14, scale: 2 }).notNull(),
  current: numeric("current", { precision: 14, scale: 2 }).notNull().default("0"),
  deadline: date("deadline").notNull(),
  color: text("color").notNull(),
});

export const budgetsTable = pgTable(
  "finance_budgets",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id"),
    month: text("month").notNull(),
    planned: numeric("planned", { precision: 14, scale: 2 }).notNull(),
    lines: jsonb("lines").$type<Array<{ category: string; planned: number; spent: number; color: string }>>().notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userMonthUnique: uniqueIndex("finance_budgets_user_month_idx").on(table.userId, table.month),
  }),
);

export const cardsTable = pgTable("finance_cards", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  name: text("name").notNull(),
  institution: text("institution").notNull(),
  limit: numeric("limit", { precision: 14, scale: 2 }).notNull(),
  used: numeric("used", { precision: 14, scale: 2 }).notNull().default("0"),
  closingDay: integer("closing_day").notNull(),
  dueDay: integer("due_day").notNull(),
  color: text("color").notNull(),
});

export const insertAccountSchema = createInsertSchema(accountsTable).omit({ id: true });
export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({ id: true, createdAt: true });
export const insertGoalSchema = createInsertSchema(goalsTable).omit({ id: true });
export const insertBudgetSchema = createInsertSchema(budgetsTable).omit({ id: true, updatedAt: true });

export const accountsRelations = relations(accountsTable, ({ many }) => ({
  transactions: many(transactionsTable),
}));

export const transactionsRelations = relations(transactionsTable, ({ one }) => ({
  account: one(accountsTable, {
    fields: [transactionsTable.account],
    references: [accountsTable.name],
  }),
}));