import { Router, type IRouter } from "express";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import {
  AccountInput,
  CreateAccountBody,
  CreateGoalBody,
  CreateTransactionBody,
  GetBudgetResponse,
  GetDashboardActivityResponse,
  GetDashboardSummaryResponse,
  ListAccountsResponse,
  ListCategoriesResponse,
  ListCardsResponse,
  ListGoalsResponse,
  ListTransactionsQueryParams,
  ListTransactionsResponse,
  UpdateBudgetBody,
} from "@workspace/api-zod";
import {
  accountsTable,
  budgetsTable,
  cardsTable,
  categoriesTable,
  db,
  goalsTable,
  transactionsTable,
} from "@workspace/db";

const router: IRouter = Router();

const asNumber = (value: string | number | null | undefined) => Number(value ?? 0);
const monthStart = new Date();
monthStart.setDate(1);
const currentMonth = monthStart.toISOString().slice(0, 7);

const serializeAccount = (row: typeof accountsTable.$inferSelect) => ({
  id: row.id,
  name: row.name,
  institution: row.institution,
  kind: row.kind,
  balance: asNumber(row.balance),
  color: row.color,
});

const serializeTransaction = (row: typeof transactionsTable.$inferSelect) => ({
  id: row.id,
  description: row.description,
  amount: asNumber(row.amount),
  type: row.type as "income" | "expense" | "transfer",
  category: row.category,
  account: row.account,
  date: row.date,
  status: row.status,
});

const serializeGoal = (row: typeof goalsTable.$inferSelect) => ({
  id: row.id,
  name: row.name,
  target: asNumber(row.target),
  current: asNumber(row.current),
  deadline: row.deadline,
  color: row.color,
});

const seededUsers = new Set<string>();
const seedingUsers = new Map<string, Promise<void>>();

async function seedDemoData(userId: string) {
  if (seededUsers.has(userId)) return;
  const inFlight = seedingUsers.get(userId);
  if (inFlight) return inFlight;

  const seed = (async () => {
    const existing = await db.select({ id: accountsTable.id }).from(accountsTable).where(eq(accountsTable.userId, userId)).limit(1);
    if (existing.length > 0) {
      seededUsers.add(userId);
      return;
    }

    const [existingCategory] = await db.select({ id: categoriesTable.id }).from(categoriesTable).limit(1);
    if (!existingCategory) {
      await db.insert(categoriesTable).values([
        { name: "Moradia", color: "#7856D6", icon: "home", budget: "2500" },
        { name: "Alimentação", color: "#F07845", icon: "utensils", budget: "1500" },
        { name: "Transporte", color: "#4C9BE8", icon: "car", budget: "800" },
        { name: "Lazer", color: "#E1B12C", icon: "sparkles", budget: "900" },
        { name: "Assinaturas", color: "#D85C9E", icon: "repeat", budget: "300" },
        { name: "Investimentos", color: "#28A878", icon: "trending-up", budget: "1800" },
      ]);
    }
    await db.insert(accountsTable).values([
      { userId, name: "Nubank", institution: "Nubank", kind: "Conta digital", balance: "8420.38", color: "#7856D6" },
      { userId, name: "Itaú", institution: "Itaú", kind: "Conta corrente", balance: "28960.10", color: "#F07845" },
      { userId, name: "Carteira", institution: "Dinheiro", kind: "Carteira", balance: "380.00", color: "#28A878" },
    ]);
    await db.insert(transactionsTable).values([
      { userId, description: "Salário mensal", amount: "12000", type: "income", category: "Receita", account: "Nubank", date: currentMonth + "-05", status: "completed" },
      { userId, description: "Aluguel", amount: "2450", type: "expense", category: "Moradia", account: "Nubank", date: currentMonth + "-06", status: "completed" },
      { userId, description: "Mercado Pão de Açúcar", amount: "386.42", type: "expense", category: "Alimentação", account: "Itaú", date: currentMonth + "-08", status: "completed" },
      { userId, description: "Aporte mensal", amount: "1800", type: "expense", category: "Investimentos", account: "Itaú", date: currentMonth + "-10", status: "completed" },
      { userId, description: "Uber", amount: "48.90", type: "expense", category: "Transporte", account: "Nubank", date: currentMonth + "-11", status: "completed" },
      { userId, description: "Netflix", amount: "55.90", type: "expense", category: "Assinaturas", account: "Nubank", date: currentMonth + "-12", status: "completed" },
      { userId, description: "Restaurante Maré", amount: "164.80", type: "expense", category: "Alimentação", account: "Nubank", date: currentMonth + "-13", status: "completed" },
      { userId, description: "Freelance de design", amount: "2400", type: "income", category: "Receita", account: "Itaú", date: currentMonth + "-14", status: "completed" },
    ]);
    await db.insert(goalsTable).values([
      { userId, name: "Reserva de emergência", target: "30000", current: "18450", deadline: "2026-12-31", color: "#7856D6" },
      { userId, name: "Viagem para o Chile", target: "8500", current: "5200", deadline: "2026-10-15", color: "#E1B12C" },
      { userId, name: "Entrada do carro", target: "40000", current: "12400", deadline: "2027-08-30", color: "#4C9BE8" },
    ]);
    await db.insert(budgetsTable).values({
      userId,
      month: currentMonth,
      planned: "7800",
      lines: [
        { category: "Moradia", planned: 2500, spent: 2450, color: "#7856D6" },
        { category: "Alimentação", planned: 1500, spent: 1120, color: "#F07845" },
        { category: "Transporte", planned: 800, spent: 420, color: "#4C9BE8" },
        { category: "Lazer", planned: 900, spent: 620, color: "#E1B12C" },
        { category: "Assinaturas", planned: 300, spent: 180, color: "#D85C9E" },
        { category: "Investimentos", planned: 1800, spent: 1800, color: "#28A878" },
      ],
    });
    await db.insert(cardsTable).values([
      { userId, name: "Nubank Platinum", institution: "Nubank", limit: "12000", used: "3160.80", closingDay: 12, dueDay: 20, color: "#7856D6" },
      { userId, name: "Visa Infinite", institution: "Itaú", limit: "18000", used: "4280.25", closingDay: 5, dueDay: 13, color: "#F07845" },
    ]);
    seededUsers.add(userId);
  })();

  seedingUsers.set(userId, seed);
  try {
    await seed;
  } finally {
    seedingUsers.delete(userId);
  }
}

router.get("/dashboard/summary", async (req, res) => {
  const userId = req.userId!;
  await seedDemoData(userId);
  const [accounts, transactions, goals] = await Promise.all([
    db.select().from(accountsTable).where(eq(accountsTable.userId, userId)),
    db.select().from(transactionsTable).where(eq(transactionsTable.userId, userId)),
    db.select().from(goalsTable).where(eq(goalsTable.userId, userId)),
  ]);
  const currentTransactions = transactions.filter((item) => item.date.startsWith(currentMonth));
  const income = currentTransactions.filter((item) => item.type === "income").reduce((sum, item) => sum + asNumber(item.amount), 0);
  const expenses = currentTransactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + asNumber(item.amount), 0);
  const available = accounts.reduce((sum, item) => sum + asNumber(item.balance), 0);
  const investments = currentTransactions.filter((item) => item.category === "Investimentos").reduce((sum, item) => sum + asNumber(item.amount), 0);
  const response = {
    netWorth: available + goals.reduce((sum, item) => sum + asNumber(item.current), 0),
    available,
    income,
    expenses,
    investments,
    bills: 3280,
    savingsRate: income ? Math.round(((income - expenses) / income) * 100) : 0,
    healthScore: 82,
    healthLabel: "Boa",
    monthlyChange: 8.4,
    cashFlow: [
      { month: "Abr", income: 10800, expenses: 8120 },
      { month: "Mai", income: 11600, expenses: 8640 },
      { month: "Jun", income: 12000, expenses: 9050 },
      { month: "Jul", income: 12400, expenses: 9380 },
      { month: "Ago", income: 12000, expenses: 7810 },
      { month: "Set", income, expenses },
    ],
  };
  res.json(GetDashboardSummaryResponse.parse(response));
});

router.get("/dashboard/activity", async (req, res) => {
  const userId = req.userId!;
  await seedDemoData(userId);
  const rows = await db.select().from(transactionsTable).where(eq(transactionsTable.userId, userId)).orderBy(desc(transactionsTable.date), desc(transactionsTable.id)).limit(6);
  res.json(GetDashboardActivityResponse.parse(rows.map(serializeTransaction)));
});

router.get("/accounts", async (req, res) => {
  const userId = req.userId!;
  await seedDemoData(userId);
  res.json(ListAccountsResponse.parse((await db.select().from(accountsTable).where(eq(accountsTable.userId, userId))).map(serializeAccount)));
});

router.post("/accounts", async (req, res) => {
  const userId = req.userId!;
  await seedDemoData(userId);
  const body = CreateAccountBody.parse(req.body);
  const [account] = await db.insert(accountsTable).values({
    userId,
    ...body,
    balance: String(body.balance),
  }).returning();
  res.status(201).json(serializeAccount(account));
});

router.get("/categories", async (req, res) => {
  const userId = req.userId!;
  await seedDemoData(userId);
  const categories = await db.select().from(categoriesTable);
  const expenses = await db.select().from(transactionsTable).where(eq(transactionsTable.userId, userId));
  const data = categories.map((category) => ({
    id: category.id,
    name: category.name,
    color: category.color,
    icon: category.icon,
    budget: asNumber(category.budget),
    spent: expenses.filter((item) => item.category === category.name && item.type === "expense").reduce((sum, item) => sum + asNumber(item.amount), 0),
  }));
  res.json(ListCategoriesResponse.parse(data));
});

router.get("/transactions", async (req, res) => {
  const userId = req.userId!;
  await seedDemoData(userId);
  const query = ListTransactionsQueryParams.parse(req.query);
  const filters = [eq(transactionsTable.userId, userId)];
  if (query.type) filters.push(eq(transactionsTable.type, query.type));
  if (query.search) {
    const searchFilter = or(
      ilike(transactionsTable.description, `%${query.search}%`),
      ilike(transactionsTable.category, `%${query.search}%`),
    );
    if (searchFilter) filters.push(searchFilter);
  }
  const rows = await db.select().from(transactionsTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(transactionsTable.date), desc(transactionsTable.id))
    .limit(query.limit);
  res.json(ListTransactionsResponse.parse(rows.map(serializeTransaction)));
});

router.post("/transactions", async (req, res) => {
  const userId = req.userId!;
  await seedDemoData(userId);
  const body = CreateTransactionBody.parse(req.body);
  const [transaction] = await db.insert(transactionsTable).values({
    userId,
    ...body,
    amount: String(body.amount),
  }).returning();
  res.status(201).json(serializeTransaction(transaction));
});

router.get("/goals", async (req, res) => {
  const userId = req.userId!;
  await seedDemoData(userId);
  res.json(ListGoalsResponse.parse((await db.select().from(goalsTable).where(eq(goalsTable.userId, userId))).map(serializeGoal)));
});

router.post("/goals", async (req, res) => {
  const userId = req.userId!;
  await seedDemoData(userId);
  const body = CreateGoalBody.parse(req.body);
  const [goal] = await db.insert(goalsTable).values({
    userId,
    ...body,
    target: String(body.target),
    current: String(body.current),
  }).returning();
  res.status(201).json(serializeGoal(goal));
});

router.get("/budget", async (req, res) => {
  const userId = req.userId!;
  await seedDemoData(userId);
  const [budget] = await db.select().from(budgetsTable).where(and(eq(budgetsTable.userId, userId), eq(budgetsTable.month, currentMonth))).limit(1);
  const data = { month: budget.month, planned: asNumber(budget.planned), spent: budget.lines.reduce((sum, line) => sum + line.spent, 0), lines: budget.lines };
  res.json(GetBudgetResponse.parse(data));
});

router.put("/budget", async (req, res) => {
  const userId = req.userId!;
  await seedDemoData(userId);
  const body = UpdateBudgetBody.parse(req.body);
  const [budget] = await db.insert(budgetsTable).values({
    userId,
    month: body.month,
    planned: String(body.planned),
    lines: body.lines,
  }).onConflictDoUpdate({
    target: [budgetsTable.userId, budgetsTable.month],
    set: { planned: String(body.planned), lines: body.lines, updatedAt: new Date() },
  }).returning();
  const data = { month: budget.month, planned: asNumber(budget.planned), spent: budget.lines.reduce((sum, line) => sum + line.spent, 0), lines: budget.lines };
  res.json(GetBudgetResponse.parse(data));
});

router.get("/cards", async (req, res) => {
  const userId = req.userId!;
  await seedDemoData(userId);
  const cards = await db.select().from(cardsTable).where(eq(cardsTable.userId, userId));
  res.json(ListCardsResponse.parse(cards.map((card) => ({
    id: card.id,
    name: card.name,
    institution: card.institution,
    limit: asNumber(card.limit),
    used: asNumber(card.used),
    closingDay: card.closingDay,
    dueDay: card.dueDay,
    color: card.color,
  }))));
});

export default router;