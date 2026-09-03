import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import {
  useCreateAccount,
  useCreateGoal,
  useCreateTransaction,
  useGetBudget,
  useGetDashboardActivity,
  useGetDashboardSummary,
  useListAccounts,
  useListCards,
  useListCategories,
  useListGoals,
  useListTransactions,
  useUpdateBudget,
  getGetBudgetQueryKey,
  getGetDashboardActivityQueryKey,
  getGetDashboardSummaryQueryKey,
  getListAccountsQueryKey,
  getListGoalsQueryKey,
  getListTransactionsQueryKey,
} from '@workspace/api-client-react';
import type {
  AccountInput,
  BudgetLine,
  GoalInput,
  TransactionInput,
  TransactionType,
} from '@workspace/api-client-react';
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Grid2X2,
  Landmark,
  LayoutDashboard,
  ListFilter,
  Menu,
  MoreHorizontal,
  PiggyBank,
  Plus,
  Receipt,
  Search,
  Settings2,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

const fallbackSummary = {
  netWorth: 84260,
  available: 12640,
  income: 8240,
  expenses: 5168,
  investments: 56820,
  bills: 1810,
  savingsRate: 37.3,
  healthScore: 82,
  healthLabel: 'Steady & growing',
  monthlyChange: 6.8,
  cashFlow: [
    { month: 'Oct', income: 6800, expenses: 4920 },
    { month: 'Nov', income: 7300, expenses: 4680 },
    { month: 'Dec', income: 9150, expenses: 6210 },
    { month: 'Jan', income: 7900, expenses: 5010 },
    { month: 'Feb', income: 8120, expenses: 5360 },
    { month: 'Mar', income: 8240, expenses: 5168 },
  ],
};

const fallbackTransactions = [
  { id: 1, description: 'Northstar Studio', amount: 4200, type: 'income' as const, category: 'Salary', account: 'Everyday checking', date: '2025-03-28', status: 'cleared' },
  { id: 2, description: 'Hearth & Grain', amount: 86.4, type: 'expense' as const, category: 'Groceries', account: 'Everyday checking', date: '2025-03-27', status: 'cleared' },
  { id: 3, description: 'Cityline Electric', amount: 124.2, type: 'expense' as const, category: 'Home', account: 'Everyday checking', date: '2025-03-26', status: 'cleared' },
  { id: 4, description: 'Moss & Metric', amount: 240, type: 'expense' as const, category: 'Dining', account: 'Venture card', date: '2025-03-25', status: 'cleared' },
  { id: 5, description: 'Acorn brokerage', amount: 750, type: 'transfer' as const, category: 'Investments', account: 'Acorn brokerage', date: '2025-03-24', status: 'pending' },
];

const fallbackAccounts = [
  { id: 1, name: 'Everyday checking', institution: 'Morrow Bank', kind: 'Checking', balance: 9040, color: '#e5b94f' },
  { id: 2, name: 'Rainy day savings', institution: 'Morrow Bank', kind: 'Savings', balance: 3600, color: '#88b7a3' },
  { id: 3, name: 'Acorn brokerage', institution: 'Vanguard', kind: 'Investment', balance: 56820, color: '#df8c75' },
];

const fallbackCategories = [
  { id: 1, name: 'Home', color: '#88b7a3', icon: 'H', spent: 1452, budget: 1700 },
  { id: 2, name: 'Groceries', color: '#e5b94f', icon: 'G', spent: 486, budget: 620 },
  { id: 3, name: 'Dining', color: '#df8c75', icon: 'D', spent: 290, budget: 400 },
  { id: 4, name: 'Transport', color: '#8e9dc0', icon: 'T', spent: 215, budget: 340 },
];

const fallbackGoals = [
  { id: 1, name: 'A quiet summer', target: 4800, current: 3120, deadline: '2025-06-30', color: '#e5b94f' },
  { id: 2, name: 'Home reserve', target: 12000, current: 7650, deadline: '2025-12-31', color: '#88b7a3' },
  { id: 3, name: 'Long horizon', target: 25000, current: 14820, deadline: '2026-03-01', color: '#df8c75' },
];

const fallbackCards = [
  { id: 1, name: 'Venture card', institution: 'Morrow Bank', limit: 9000, used: 1880, closingDay: 18, dueDay: 11, color: '#263e39' },
  { id: 2, name: 'Travel card', institution: 'Harbor Union', limit: 12000, used: 4320, closingDay: 4, dueDay: 27, color: '#b37c62' },
];

const fallbackBudget = {
  month: 'Setembro de 2026',
  planned: 5300,
  spent: 5168,
  lines: fallbackCategories.map(({ name, color, spent, budget }) => ({ category: name, color, spent, planned: budget })),
};

const nav = [
  { href: '/', label: 'Visão geral', icon: LayoutDashboard },
  { href: '/transactions', label: 'Movimentações', icon: ArrowLeftRight },
  { href: '/accounts', label: 'Contas', icon: Wallet },
  { href: '/goals', label: 'Metas', icon: Target },
  { href: '/budget', label: 'Orçamento', icon: Grid2X2 },
  { href: '/cards', label: 'Cartões', icon: CreditCard },
  { href: '/insights', label: 'Inteligência', icon: Sparkles },
];

const money = (value: number, compact = false) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: compact ? 'compact' : 'standard', maximumFractionDigits: compact ? 1 : 2 }).format(value);

const dateLabel = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
};

function LoadingState({ label = 'Buscando seus números mais recentes' }: { label?: string }) {
  return <div className="space-y-4 page-enter" data-testid="status-loading">
    <div className="h-8 w-52 animate-pulse rounded bg-muted" />
    <div className="grid gap-4 md:grid-cols-3"><div className="h-32 animate-pulse rounded-2xl bg-muted" /><div className="h-32 animate-pulse rounded-2xl bg-muted" /><div className="h-32 animate-pulse rounded-2xl bg-muted" /></div>
    <p className="text-sm text-muted-foreground">{label}...</p>
  </div>;
}

function ErrorState({ retry }: { retry: () => void }) {
  return <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center page-enter" data-testid="status-error">
    <CircleHelp className="mx-auto mb-3 h-8 w-8 text-destructive" />
    <h2 className="font-display text-2xl">Os números deram uma pausa</h2>
    <p className="mt-2 text-sm text-muted-foreground">Não conseguimos acessar seu retrato financeiro mais recente.</p>
    <button type="button" data-testid="button-retry" onClick={retry} className="mt-5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Tentar novamente</button>
  </div>;
}

function EmptyState({ icon: Icon, title, body, action }: { icon: typeof Wallet; title: string; body: string; action?: ReactNode }) {
  return <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center page-enter" data-testid="status-empty">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/35 text-primary"><Icon className="h-5 w-5" /></div>
    <h2 className="font-display text-2xl">{title}</h2><p className="mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>{action}
  </div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary/20 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" data-testid="modal">
    <div className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl border border-border bg-background p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8 page-enter">
      <div className="mb-6 flex items-center justify-between"><h2 className="font-display text-3xl">{title}</h2><button type="button" aria-label="Close" data-testid="button-close-modal" onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted"><X className="h-5 w-5" /></button></div>
      {children}
    </div>
  </div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-2"><span className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">{label}</span>{children}</label>;
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-xl border border-input bg-card px-3.5 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary ${props.className ?? ''}`} />;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageName = location === '/' ? 'Bom dia, Sam' : nav.find((item) => item.href === location)?.label ?? 'Configurações';
  const today = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());
  return <div className="noise min-h-[100dvh] bg-background text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-sidebar px-5 py-6 text-sidebar-foreground transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-12 flex items-center justify-between px-2"><Link href="/" data-testid="link-brand" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"><TrendingUp className="h-5 w-5" /></span><span className="font-display text-xl tracking-tight">Finch</span></Link><button type="button" aria-label="Fechar menu" data-testid="button-close-nav" className="md:hidden" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button></div>
      <nav className="space-y-1" aria-label="Navegação principal">{nav.map(({ href, label, icon: Icon }) => <Link href={href} key={href} data-testid={`link-nav-${label.toLowerCase()}`} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${location === href ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'}`}><Icon className="h-[18px] w-[18px]" /><span>{label}</span>{href === '/insights' && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}</Link>)}</nav>
      <div className="mt-auto space-y-1">
        <Link href="/settings" data-testid="link-nav-settings" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${location === '/settings' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}><Settings2 className="h-[18px] w-[18px]" /><span>Configurações</span></Link>
        <div className="mt-5 border-t border-sidebar-border pt-5"><div className="flex items-center gap-3 px-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">SM</div><div className="min-w-0"><p className="truncate text-sm font-semibold">Sam Morgan</p><p className="truncate text-xs text-sidebar-foreground/50">Espaço pessoal</p></div><ChevronDown className="ml-auto h-4 w-4 opacity-50" /></div></div>
      </div>
    </aside>
    {mobileOpen && <button type="button" aria-label="Fechar sobreposição do menu" data-testid="button-overlay-nav" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-primary/20 md:hidden" />}
    <main className="md:pl-[248px]"><header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-md sm:px-8 lg:px-12"><div className="flex items-center gap-3"><button type="button" aria-label="Abrir menu" data-testid="button-open-nav" className="rounded-lg p-2 hover:bg-muted md:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></button><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">{today}</p><h1 className="font-display text-xl leading-none sm:text-2xl">{pageName}</h1></div></div><div className="flex items-center gap-2"><button type="button" data-testid="button-notifications" aria-label="Notificações" className="relative rounded-full p-2.5 text-muted-foreground hover:bg-muted"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" /></button><div className="hidden h-8 w-px bg-border sm:block" /><div className="hidden items-center gap-2 pl-1 sm:flex"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">SM</div><span className="text-sm font-medium">Sam</span><ChevronDown className="h-4 w-4 text-muted-foreground" /></div></div></header><div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-12 lg:py-10">{children}</div></main>
  </div>;
}

function SectionTitle({ eyebrow, title, body, action }: { eyebrow: string; title: string; body?: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between page-enter"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">{eyebrow}</p><h2 className="mt-2 font-display text-4xl tracking-[-.03em] sm:text-5xl">{title}</h2>{body && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{body}</p>}</div>{action}</div>;
}

function Button({ children, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'soft' | 'plain' }) {
  const styles = variant === 'primary' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : variant === 'soft' ? 'bg-accent text-accent-foreground hover:bg-accent/80' : 'text-muted-foreground hover:bg-muted hover:text-foreground';
  return <button {...props} className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold ${styles} ${props.className ?? ''}`} />;
}

function Metric({ label, value, detail, tone = 'default', icon: Icon }: { label: string; value: string; detail: string; tone?: 'default' | 'warm' | 'coral'; icon: typeof Wallet }) {
  return <div className={`rounded-2xl border border-border p-5 ${tone === 'warm' ? 'bg-accent/25' : tone === 'coral' ? 'bg-[#df8c75]/15' : 'bg-card'} page-enter`}><div className="mb-6 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">{label}</span><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/60 text-primary"><Icon className="h-4 w-4" /></span></div><p className="font-mono-ui text-2xl tracking-tight sm:text-3xl" data-testid={`text-metric-${label.toLowerCase().replaceAll(' ', '-')}`}>{value}</p><p className="mt-2 text-xs text-muted-foreground">{detail}</p></div>;
}

function CashFlowChart({ data }: { data: { month: string; income: number; expenses: number }[] }) {
  const max = Math.max(...data.map((item) => item.income), 1);
  const incomePoints = data.map((item, index) => `${20 + index * 64},${142 - (item.income / max) * 105}`).join(' ');
  const expensePoints = data.map((item, index) => `${20 + index * 64},${142 - (item.expenses / max) * 105}`).join(' ');
  return <div className="relative h-52 w-full" data-testid="chart-cash-flow"><svg viewBox="0 0 360 175" preserveAspectRatio="none" className="h-full w-full overflow-visible"><line x1="20" y1="142" x2="340" y2="142" stroke="hsl(var(--border))" /><line x1="20" y1="90" x2="340" y2="90" stroke="hsl(var(--border))" strokeDasharray="3 5" /><line x1="20" y1="38" x2="340" y2="38" stroke="hsl(var(--border))" strokeDasharray="3 5" /><polyline points={incomePoints} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><polyline points={expensePoints} fill="none" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{data.map((item, index) => <g key={item.month}><circle cx={20 + index * 64} cy={142 - (item.income / max) * 105} r="4" fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth="3" /><circle cx={20 + index * 64} cy={142 - (item.expenses / max) * 105} r="4" fill="hsl(var(--accent))" stroke="hsl(var(--card))" strokeWidth="3" /><text x={20 + index * 64} y="165" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">{item.month}</text></g>)}</svg><div className="absolute right-0 top-0 flex gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-primary" />Income</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-accent" />Outflow</span></div></div>;
}

function TransactionRow({ transaction, index }: { transaction: (typeof fallbackTransactions)[number]; index: number }) {
  const positive = transaction.type === 'income';
  return <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border/70 py-4 last:border-b-0 sm:grid-cols-[1.8fr_1fr_1fr_auto] page-enter" style={{ animationDelay: `${index * 45}ms` }} data-testid={`row-transaction-${transaction.id}`}><div className="flex min-w-0 items-center gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${positive ? 'bg-[#88b7a3]/25 text-primary' : 'bg-muted text-muted-foreground'}`}>{positive ? <ArrowDownLeft className="h-4 w-4" /> : transaction.type === 'transfer' ? <ArrowLeftRight className="h-4 w-4" /> : <Receipt className="h-4 w-4" />}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{transaction.description}</p><p className="truncate text-xs text-muted-foreground">{transaction.category} · {transaction.account}</p></div></div><span className="hidden text-sm text-muted-foreground sm:block">{dateLabel(transaction.date)}</span><span className="hidden capitalize text-xs text-muted-foreground sm:block">{transaction.status}</span><span className={`text-right font-mono-ui text-sm ${positive ? 'text-primary' : 'text-foreground'}`}>{positive ? '+' : transaction.type === 'transfer' ? '' : '-'}{money(transaction.amount)}</span></div>;
}

function Dashboard() {
  const summaryQuery = useGetDashboardSummary();
  const activityQuery = useGetDashboardActivity();
  const summary = summaryQuery.data ?? fallbackSummary;
  const activity = activityQuery.data ?? fallbackTransactions;
  if (summaryQuery.isLoading && !summaryQuery.data) return <LoadingState />;
  if (summaryQuery.isError && !summaryQuery.data) return <ErrorState retry={() => summaryQuery.refetch()} />;
  return <div className="space-y-8">
    <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
      <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:p-8 page-enter"><div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[30px] border-sidebar-primary/15" /><div className="absolute -bottom-32 right-16 h-72 w-72 rounded-full border-[20px] border-sidebar-primary/10" /><div className="relative"><div className="flex items-start justify-between"><div><p className="text-sm text-primary-foreground/60">Patrimônio líquido</p><p className="mt-3 font-mono-ui text-4xl tracking-tight sm:text-5xl" data-testid="text-net-worth">{money(summary.netWorth)}</p><p className="mt-3 flex items-center gap-1.5 text-sm text-sidebar-primary"><ArrowUpRight className="h-4 w-4" />{summary.monthlyChange}% <span className="text-primary-foreground/60">desde o mês passado</span></p></div><span className="rounded-full border border-primary-foreground/15 px-3 py-1 font-mono-ui text-[10px] uppercase tracking-widest text-primary-foreground/60">Setembro 2026</span></div><div className="mt-12 flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[.15em] text-primary-foreground/50">Dinheiro em movimento</p><div className="mt-2 flex items-center gap-3"><span className="font-mono-ui text-xl">{money(summary.available)}</span><span className="rounded-full bg-sidebar-primary/20 px-2 py-1 text-xs text-sidebar-primary">disponível</span></div></div><Link href="/insights" data-testid="link-view-insights" className="rounded-full bg-sidebar-primary px-4 py-2.5 text-xs font-bold text-sidebar-primary-foreground hover:translate-y-[-1px]">Ver panorama completo</Link></div></div></section>
       <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 page-enter stagger-1"><div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">Saúde financeira</p><p className="mt-2 font-display text-3xl">{summary.healthLabel === 'Boa' ? 'Boa' : summary.healthLabel}</p></div><span className="flex h-11 w-11 items-center justify-center rounded-full border-[5px] border-accent text-sm font-bold text-primary">{summary.healthScore}</span></div><div className="mt-8 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-accent" style={{ width: `${summary.healthScore}%` }} /></div><p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">Mais espaço para respirar neste mês. Seu ritmo de economia está fazendo a diferença.</p><Link href="/insights" data-testid="link-health-insights" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">Como esse score é calculado <ArrowUpRight className="h-4 w-4" /></Link></section>
    </div>
     <div className="grid gap-4 md:grid-cols-3"><Metric label="Receitas" value={money(summary.income)} detail="neste mês · +4,2% vs. agosto" tone="warm" icon={ArrowDownLeft} /><Metric label="Despesas" value={money(summary.expenses)} detail="neste mês · 34,1% das receitas" icon={ArrowUpRight} /><Metric label="Investimentos" value={money(summary.investments, true)} detail="em toda a carteira" tone="coral" icon={TrendingUp} /></div>
    <div className="grid gap-4 lg:grid-cols-[1.4fr_.8fr]">
       <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 page-enter stagger-2"><div className="mb-5 flex items-center justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">Fluxo de caixa</p><h2 className="mt-1 font-display text-2xl">Seu ritmo nos últimos seis meses</h2></div><Link href="/budget" data-testid="link-chart-budget" className="rounded-full p-2 text-muted-foreground hover:bg-muted"><MoreHorizontal className="h-5 w-5" /></Link></div><CashFlowChart data={summary.cashFlow ?? fallbackSummary.cashFlow} /></section>
       <section className="rounded-3xl border border-border bg-accent/25 p-6 sm:p-8 page-enter stagger-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card text-primary"><Sparkles className="h-5 w-5" /></div><p className="mt-7 font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">Um ponto importante</p><h2 className="mt-2 font-display text-2xl leading-tight">Você pode colocar mais R$ 132 na sua meta de viagem.</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Suas despesas essenciais estão dentro do plano. Redirecionar essa sobra mantém a meta no ritmo sem mexer na sua reserva.</p><Link href="/goals" data-testid="link-action-goal" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">Abrir meta de viagem <ArrowUpRight className="h-4 w-4" /></Link></section>
    </div>
     <section className="rounded-3xl border border-border bg-card px-6 py-3 sm:px-8"><div className="flex items-center justify-between border-b border-border py-5"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">Últimas movimentações</p><h2 className="mt-1 font-display text-2xl">Atividade recente</h2></div><Link href="/transactions" data-testid="link-all-transactions" className="text-sm font-semibold text-primary">Ver todas</Link></div>{activity.length ? activity.slice(0, 5).map((item, index) => <TransactionRow transaction={item} index={index} key={item.id} />) : <EmptyState icon={Receipt} title="Tudo limpo por aqui" body="Suas movimentações mais recentes aparecerão aqui." />}</section>
  </div>;
}

function Transactions() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'all' | TransactionType>('all');
  const [open, setOpen] = useState(false);
  const transactionsQuery = useListTransactions({ limit: 100, ...(type !== 'all' ? { type } : {}), ...(search ? { search } : {}) });
  const categoriesQuery = useListCategories();
  const accountsQuery = useListAccounts();
  const create = useCreateTransaction();
  const list = transactionsQuery.data ?? fallbackTransactions;
  const categories = categoriesQuery.data ?? fallbackCategories;
  const accounts = accountsQuery.data ?? fallbackAccounts;
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); const data: TransactionInput = { description: String(form.get('description')), amount: Number(form.get('amount')), type: String(form.get('type')) as TransactionInput['type'], category: String(form.get('category')), account: String(form.get('account')), date: String(form.get('date')) }; create.mutate({ data }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() }); queryClient.invalidateQueries({ queryKey: getGetDashboardActivityQueryKey() }); queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() }); setOpen(false); } }); };
  return <div className="space-y-7"><SectionTitle eyebrow="The paper trail" title="Transactions" body="Search the small decisions and the big ones. They all add up." action={<Button data-testid="button-open-transaction" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add transaction</Button>} /><div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" /><TextInput data-testid="input-search-transactions" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a merchant, category, or account" className="pl-10" /></div><div className="flex items-center gap-1 rounded-xl border border-input bg-card p-1"><ListFilter className="ml-2 h-4 w-4 text-muted-foreground" />{(['all', 'income', 'expense', 'transfer'] as const).map((item) => <button type="button" data-testid={`button-filter-${item}`} key={item} onClick={() => setType(item)} className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize ${type === item ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>{item}</button>)}</div></div><section className="rounded-3xl border border-border bg-card px-5 py-2 sm:px-8"><div className="hidden grid-cols-[1.8fr_1fr_1fr_auto] border-b border-border py-4 text-[10px] font-bold uppercase tracking-[.15em] text-muted-foreground sm:grid"><span>Details</span><span>Date</span><span>Status</span><span>Amount</span></div>{transactionsQuery.isLoading && !transactionsQuery.data ? <LoadingState label="Loading transactions" /> : transactionsQuery.isError && !transactionsQuery.data ? <ErrorState retry={() => transactionsQuery.refetch()} /> : list.length ? list.map((item, index) => <TransactionRow transaction={item} index={index} key={item.id} />) : <EmptyState icon={Receipt} title="No matching movement" body="Try another search or add your first transaction." action={<Button className="mt-5" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add transaction</Button>} />}</section>{open && <Modal title="Add a transaction" onClose={() => setOpen(false)}><form onSubmit={submit} className="space-y-4"><Field label="Description"><TextInput required name="description" data-testid="input-transaction-description" placeholder="e.g. Corner market" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Amount"><TextInput required min="0.01" step="0.01" name="amount" type="number" data-testid="input-transaction-amount" placeholder="0.00" /></Field><Field label="Type"><select name="type" data-testid="select-transaction-type" defaultValue="expense" className="w-full rounded-xl border border-input bg-card px-3.5 py-3 text-sm"><option value="expense">Expense</option><option value="income">Income</option><option value="transfer">Transfer</option></select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Category"><select name="category" data-testid="select-transaction-category" className="w-full rounded-xl border border-input bg-card px-3.5 py-3 text-sm">{categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}</select></Field><Field label="Account"><select name="account" data-testid="select-transaction-account" className="w-full rounded-xl border border-input bg-card px-3.5 py-3 text-sm">{accounts.map((account) => <option key={account.id} value={account.name}>{account.name}</option>)}</select></Field></div><Field label="Date"><TextInput required name="date" type="date" data-testid="input-transaction-date" defaultValue="2025-03-26" /></Field><Button type="submit" disabled={create.isPending} data-testid="button-submit-transaction" className="mt-3 w-full">{create.isPending ? 'Saving...' : 'Save transaction'}</Button>{create.isError && <p className="text-sm text-destructive">Could not save this transaction. Please try again.</p>}</form></Modal>}</div>;
}

function Accounts() {
  const queryClient = useQueryClient();
  const accountsQuery = useListAccounts();
  const create = useCreateAccount();
  const [open, setOpen] = useState(false);
  const accounts = accountsQuery.data ?? fallbackAccounts;
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); const data: AccountInput = { name: String(form.get('name')), institution: String(form.get('institution')), kind: String(form.get('kind')), balance: Number(form.get('balance')), color: String(form.get('color')) }; create.mutate({ data }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAccountsQueryKey() }); setOpen(false); } }); };
  return <div className="space-y-8"><SectionTitle eyebrow="Your foundations" title="Accounts" body="The places your money rests, moves, and grows." action={<Button data-testid="button-open-account" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add account</Button>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{accountsQuery.isLoading && !accountsQuery.data ? <LoadingState label="Loading accounts" /> : accounts.map((account, index) => <article key={account.id} data-testid={`card-account-${account.id}`} className="group rounded-3xl border border-border bg-card p-6 page-enter" style={{ animationDelay: `${index * 70}ms` }}><div className="mb-10 flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${account.color}30`, color: account.color }}><Landmark className="h-5 w-5" /></span><button type="button" data-testid={`button-account-menu-${account.id}`} aria-label={`More options for ${account.name}`} className="rounded-full p-1.5 text-muted-foreground opacity-50 hover:bg-muted hover:opacity-100"><MoreHorizontal className="h-5 w-5" /></button></div><p className="text-sm font-semibold">{account.name}</p><p className="mt-1 text-xs text-muted-foreground">{account.institution} · {account.kind}</p><p className="mt-5 font-mono-ui text-3xl">{money(account.balance)}</p><div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: account.color }} />Connected and syncing</div></article>)}</div><div className="grid gap-4 lg:grid-cols-[1fr_.75fr]"><div className="rounded-3xl bg-primary p-7 text-primary-foreground"><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-sidebar-primary">Account total</p><p className="mt-3 font-mono-ui text-4xl">{money(accounts.reduce((total, account) => total + account.balance, 0))}</p><p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-foreground/65">Your connected accounts are in a good place. Keep one month of expenses close at hand.</p></div><div className="rounded-3xl border border-border bg-accent/25 p-7"><PiggyBank className="h-5 w-5 text-primary" /><h2 className="mt-5 font-display text-2xl">A softer landing</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your savings account covers 21 days of essentials. That is up from 18 days last month.</p></div></div>{open && <Modal title="Add an account" onClose={() => setOpen(false)}><form onSubmit={submit} className="space-y-4"><Field label="Account name"><TextInput required name="name" data-testid="input-account-name" placeholder="Rainy day savings" /></Field><Field label="Institution"><TextInput required name="institution" data-testid="input-account-institution" placeholder="Morrow Bank" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Kind"><select name="kind" data-testid="select-account-kind" className="w-full rounded-xl border border-input bg-card px-3.5 py-3 text-sm"><option>Checking</option><option>Savings</option><option>Investment</option><option>Cash</option></select></Field><Field label="Balance"><TextInput required name="balance" type="number" step=".01" data-testid="input-account-balance" placeholder="0.00" /></Field></div><Field label="Accent color"><input name="color" type="color" data-testid="input-account-color" defaultValue="#e5b94f" className="h-12 w-full cursor-pointer rounded-xl border border-input bg-card p-1" /></Field><Button type="submit" disabled={create.isPending} data-testid="button-submit-account" className="mt-3 w-full">{create.isPending ? 'Saving...' : 'Save account'}</Button></form></Modal>}</div>;
}

function Goals() {
  const queryClient = useQueryClient();
  const goalsQuery = useListGoals();
  const create = useCreateGoal();
  const [open, setOpen] = useState(false);
  const goals = goalsQuery.data ?? fallbackGoals;
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); const data: GoalInput = { name: String(form.get('name')), target: Number(form.get('target')), current: Number(form.get('current')), deadline: String(form.get('deadline')), color: String(form.get('color')) }; create.mutate({ data }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListGoalsQueryKey() }); setOpen(false); } }); };
  return <div className="space-y-8"><SectionTitle eyebrow="The long view" title="Goals" body="Give the future a name. Then let small, regular choices do their work." action={<Button data-testid="button-open-goal" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New goal</Button>} /><div className="grid gap-4 lg:grid-cols-3">{goalsQuery.isLoading && !goalsQuery.data ? <LoadingState label="Loading goals" /> : goals.length ? goals.map((goal, index) => { const percent = Math.min(100, (goal.current / goal.target) * 100); return <article key={goal.id} data-testid={`card-goal-${goal.id}`} className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 page-enter" style={{ animationDelay: `${index * 80}ms` }}><div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full opacity-20" style={{ backgroundColor: goal.color }} /><div className="relative"><div className="flex items-center justify-between"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: goal.color }} /><span className="font-mono-ui text-xs text-muted-foreground">{Math.round(percent)}%</span></div><h2 className="mt-9 font-display text-2xl">{goal.name}</h2><p className="mt-1 text-xs text-muted-foreground">Target by {dateLabel(goal.deadline)}</p><div className="mt-9"><div className="flex items-baseline justify-between"><span className="font-mono-ui text-xl">{money(goal.current)}</span><span className="text-xs text-muted-foreground">of {money(goal.target)}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: goal.color }} /></div></div><div className="mt-6 flex items-center justify-between text-xs text-muted-foreground"><span>{money(Math.max(0, goal.target - goal.current))} to go</span><button type="button" data-testid={`button-goal-add-${goal.id}`} onClick={() => setOpen(true)} className="font-semibold text-primary hover:underline">Add money</button></div></div></article>; }) : <EmptyState icon={Target} title="Nothing on the horizon yet" body="Create a goal to give your next good decision somewhere to land." action={<Button className="mt-5" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Create a goal</Button>} />}</div><section className="rounded-3xl border border-border bg-accent/25 p-7 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">A gentle nudge</p><h2 className="mt-2 font-display text-3xl">Progress loves a little consistency.</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Across your goals, you are 61% of the way to the life you are planning for. Keep your weekly rhythm and you will get there.</p></div><div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[8px] border-primary/15 border-t-primary font-mono-ui text-xl text-primary">61%</div></div></section>{open && <Modal title="Create a goal" onClose={() => setOpen(false)}><form onSubmit={submit} className="space-y-4"><Field label="Goal name"><TextInput required name="name" data-testid="input-goal-name" placeholder="A quiet summer" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Target amount"><TextInput required name="target" type="number" step=".01" data-testid="input-goal-target" placeholder="4800" /></Field><Field label="Already saved"><TextInput required name="current" type="number" step=".01" defaultValue="0" data-testid="input-goal-current" /></Field></div><Field label="Target date"><TextInput required name="deadline" type="date" data-testid="input-goal-deadline" /></Field><Field label="Accent color"><input name="color" type="color" data-testid="input-goal-color" defaultValue="#e5b94f" className="h-12 w-full cursor-pointer rounded-xl border border-input bg-card p-1" /></Field><Button type="submit" disabled={create.isPending} data-testid="button-submit-goal" className="mt-3 w-full">{create.isPending ? 'Saving...' : 'Create goal'}</Button></form></Modal>}</div>;
}

function Budget() {
  const queryClient = useQueryClient();
  const budgetQuery = useGetBudget();
  const update = useUpdateBudget();
  const categoriesQuery = useListCategories();
  const budget = budgetQuery.data ?? fallbackBudget;
  const lines = budget.lines?.length ? budget.lines : fallbackBudget.lines;
  const [editing, setEditing] = useState(false);
  const [planned, setPlanned] = useState(String(budget.planned));
  const [lineValues, setLineValues] = useState<Record<string, string>>({});
  const totalPercent = Math.min(100, (budget.spent / budget.planned) * 100);
  const save = () => { const nextLines: BudgetLine[] = lines.map((line) => ({ ...line, planned: Number(lineValues[line.category] ?? line.planned) })); update.mutate({ data: { month: budget.month, planned: Number(planned), lines: nextLines } }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetBudgetQueryKey() }); setEditing(false); } }); };
  return <div className="space-y-8"><SectionTitle eyebrow="Give every dollar a job" title="Budget" body="This month is not a test. It is a clear, adjustable plan." action={editing ? <div className="flex gap-2"><Button variant="plain" data-testid="button-cancel-budget" onClick={() => setEditing(false)}>Cancel</Button><Button data-testid="button-save-budget" disabled={update.isPending} onClick={save}>{update.isPending ? 'Saving...' : 'Save plan'}</Button></div> : <Button variant="soft" data-testid="button-edit-budget" onClick={() => setEditing(true)}>Adjust plan</Button>} /><div className="grid gap-4 lg:grid-cols-[.85fr_1.4fr]"><section className="rounded-3xl bg-primary p-7 text-primary-foreground sm:p-8 page-enter"><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-sidebar-primary">{budget.month}</p><p className="mt-5 font-mono-ui text-4xl">{money(budget.spent)}</p><p className="mt-1 text-sm text-primary-foreground/60">of {money(budget.planned)} planned</p><div className="mt-9 h-3 overflow-hidden rounded-full bg-primary-foreground/15"><div className="h-full rounded-full bg-sidebar-primary" style={{ width: `${totalPercent}%` }} /></div><div className="mt-3 flex justify-between text-xs text-primary-foreground/60"><span>{Math.round(totalPercent)}% used</span><span>{money(Math.max(0, budget.planned - budget.spent))} left</span></div><div className="mt-10 border-t border-primary-foreground/15 pt-5"><p className="text-xs text-primary-foreground/60">Monthly plan</p>{editing ? <TextInput data-testid="input-budget-planned" value={planned} onChange={(event) => setPlanned(event.target.value)} type="number" className="mt-2 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground" /> : <p className="mt-1 font-mono-ui text-xl">{money(budget.planned)}</p>}</div></section><section className="rounded-3xl border border-border bg-card px-6 py-2 sm:px-8 page-enter stagger-1"><div className="grid grid-cols-[1fr_auto] border-b border-border py-5 text-[10px] font-bold uppercase tracking-[.15em] text-muted-foreground sm:grid-cols-[1.3fr_1fr_1fr]"><span>Category</span><span>Spent</span><span className="text-right">Plan</span></div>{budgetQuery.isLoading && !budgetQuery.data ? <LoadingState label="Loading budget" /> : lines.map((line, index) => { const percent = Math.min(100, (line.spent / line.planned) * 100); return <div key={line.category} data-testid={`row-budget-${index}`} className="border-b border-border/70 py-5 last:border-0"><div className="flex items-center justify-between sm:grid sm:grid-cols-[1.3fr_1fr_1fr]"><div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: line.color }} /><span className="text-sm font-semibold">{line.category}</span></div><span className="font-mono-ui text-sm">{money(line.spent)}</span>{editing ? <TextInput data-testid={`input-budget-line-${index}`} value={lineValues[line.category] ?? String(line.planned)} onChange={(event) => setLineValues((current) => ({ ...current, [line.category]: event.target.value }))} type="number" className="mt-3 w-28 justify-self-end py-2 sm:mt-0" /> : <span className="text-right font-mono-ui text-sm text-muted-foreground">{money(line.planned)}</span>}</div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted sm:mr-[33%]"><div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: line.color }} /></div></div>; })}</section></div><div className="rounded-3xl border border-border bg-accent/25 p-7"><div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary"><Sparkles className="h-5 w-5" /></div><div><p className="font-semibold">Your plan has a little flex.</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">Home is running 15% under its monthly pace. That gives you a useful cushion for the last week of March.</p></div></div></div><span className="sr-only">{categoriesQuery.data?.length ?? 0} categories loaded</span></div>;
}

function Cards() {
  const cardsQuery = useListCards();
  const cards = cardsQuery.data ?? fallbackCards;
  return <div className="space-y-8"><SectionTitle eyebrow="Keep an eye on the edges" title="Cards" body="Know what is due before it becomes a surprise." /><div className="grid gap-5 lg:grid-cols-2">{cardsQuery.isLoading && !cardsQuery.data ? <LoadingState label="Loading cards" /> : cards.map((card, index) => { const usage = Math.min(100, (card.used / card.limit) * 100); return <article key={card.id} data-testid={`card-credit-${card.id}`} className="overflow-hidden rounded-3xl border border-border bg-card page-enter" style={{ animationDelay: `${index * 80}ms` }}><div className="relative h-52 overflow-hidden p-7 text-card-foreground" style={{ backgroundColor: card.color }}><div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[24px] border-white/10" /><div className="relative flex h-full flex-col justify-between"><div className="flex items-center justify-between"><span className="text-sm font-semibold">{card.institution}</span><CreditCard className="h-5 w-5 opacity-70" /></div><div><p className="font-mono-ui text-2xl tracking-[.18em]">•••• 4821</p><p className="mt-2 text-xs opacity-60">{card.name}</p></div></div></div><div className="p-7"><div className="flex items-end justify-between"><div><p className="text-xs uppercase tracking-[.14em] text-muted-foreground">Current balance</p><p className="mt-2 font-mono-ui text-2xl">{money(card.used)}</p></div><div className="text-right"><p className="text-xs text-muted-foreground">of {money(card.limit)}</p><p className="mt-1 text-xs font-semibold text-primary">{Math.round(usage)}% used</p></div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${usage > 70 ? 'bg-destructive' : 'bg-accent'}`} style={{ width: `${usage}%` }} /></div><div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5 text-xs"><div><p className="text-muted-foreground">Statement closes</p><p className="mt-1 font-semibold">Day {card.closingDay}</p></div><div><p className="text-muted-foreground">Payment due</p><p className="mt-1 font-semibold">Day {card.dueDay}</p></div></div></div></article>; })}</div><section className="rounded-3xl bg-primary p-7 text-primary-foreground sm:p-8"><div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-sidebar-primary">Next payment</p><h2 className="mt-2 font-display text-3xl">Venture card is due in 16 days.</h2><p className="mt-2 text-sm text-primary-foreground/65">You have enough in Everyday checking to cover it and keep your buffer intact.</p></div><Button variant="soft" data-testid="button-card-details">View payment details <ArrowUpRight className="h-4 w-4" /></Button></div></section></div>;
}

function Insights() {
  const summaryQuery = useGetDashboardSummary();
  const summary = summaryQuery.data ?? fallbackSummary;
  return <div className="space-y-8"><SectionTitle eyebrow="A clearer point of view" title="Insights" body="Not predictions. Just helpful context for the choices in front of you." /><section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]"><div className="rounded-3xl bg-primary p-7 text-primary-foreground sm:p-10 page-enter"><div className="flex items-center gap-2 text-sidebar-primary"><Sparkles className="h-5 w-5" /><span className="font-mono-ui text-[10px] uppercase tracking-[.18em]">This month’s read</span></div><h2 className="mt-10 max-w-lg font-display text-4xl leading-[1.05] sm:text-5xl">Your money is making more room for what matters.</h2><p className="mt-6 max-w-lg text-sm leading-relaxed text-primary-foreground/65">Income is up while your fixed costs are holding steady. That is why your savings rate reached {summary.savingsRate}% without requiring a dramatic change of pace.</p><div className="mt-10 flex flex-wrap gap-3"><span className="rounded-full bg-sidebar-primary px-4 py-2 font-mono-ui text-xs text-sidebar-primary-foreground">{summary.savingsRate}% savings rate</span><span className="rounded-full border border-primary-foreground/20 px-4 py-2 font-mono-ui text-xs">+{summary.monthlyChange}% net worth</span></div></div><div className="rounded-3xl border border-border bg-card p-7 sm:p-10 page-enter stagger-1"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary"><BarChart3 className="h-5 w-5" /></div><p className="mt-9 font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">The useful number</p><p className="mt-2 font-mono-ui text-5xl">{money(summary.bills)}</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">of your monthly outflow is predictable bills. That is a good base to build around.</p><Link href="/budget" data-testid="link-insight-budget" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">Look at your plan <ArrowUpRight className="h-4 w-4" /></Link></div></section><div className="grid gap-4 md:grid-cols-3"><InsightCard icon={BookOpen} eyebrow="Pattern" title="Groceries are calmer" body="You are 22% under your grocery pace compared with the last three months." tone="warm" /><InsightCard icon={Target} eyebrow="Opportunity" title="A goal within reach" body="At this rhythm, A quiet summer is fully funded 11 days early." /><InsightCard icon={BriefcaseBusiness} eyebrow="Watch" title="Card utilization" body="Travel card usage is higher than usual. A payment this week would restore your buffer." tone="coral" /></div><section className="rounded-3xl border border-border bg-card p-7"><div className="flex items-center justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">How your health score moves</p><h2 className="mt-2 font-display text-3xl">Small signals, not a grade.</h2></div><span className="font-mono-ui text-3xl text-primary">{summary.healthScore}<span className="text-sm text-muted-foreground">/100</span></span></div><div className="mt-8 grid gap-5 sm:grid-cols-4">{[['Cash buffer', 'Strong', 86], ['Savings rhythm', 'Strong', 78], ['Debt load', 'Light', 91], ['Plan clarity', 'Good', 73]].map(([label, value, score], index) => <div key={String(label)} data-testid={`metric-health-${index}`}><div className="flex justify-between text-xs"><span className="font-semibold">{label}</span><span className="text-muted-foreground">{value}</span></div><div className="mt-3 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} /></div></div>)}</div></section></div>;
}

function InsightCard({ icon: Icon, eyebrow, title, body, tone = 'default' }: { icon: typeof BookOpen; eyebrow: string; title: string; body: string; tone?: 'default' | 'warm' | 'coral' }) {
  return <article className={`rounded-3xl border border-border p-7 page-enter ${tone === 'warm' ? 'bg-accent/25' : tone === 'coral' ? 'bg-[#df8c75]/15' : 'bg-card'}`}><Icon className="h-5 w-5 text-primary" /><p className="mt-7 font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">{eyebrow}</p><h2 className="mt-2 font-display text-2xl">{title}</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p></article>;
}

function Settings() {
  const [saved, setSaved] = useState(false);
  const [dark, setDark] = useState(false);
  const save = () => { setSaved(true); window.setTimeout(() => setSaved(false), 2200); };
  return <div className="space-y-8"><SectionTitle eyebrow="Make it yours" title="Settings" body="A few quiet choices for the way Finch meets you each day." /><div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><aside className="rounded-3xl border border-border bg-card p-3"><button type="button" data-testid="button-settings-profile" className="flex w-full items-center gap-3 rounded-2xl bg-accent/40 p-4 text-left"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">SM</div><div><p className="text-sm font-semibold">Profile</p><p className="text-xs text-muted-foreground">Your personal details</p></div></button><button type="button" data-testid="button-settings-preferences" className="mt-1 flex w-full items-center gap-3 rounded-2xl p-4 text-left text-muted-foreground hover:bg-muted"><Settings2 className="ml-1 h-5 w-5" /><div><p className="text-sm font-semibold">Preferences</p><p className="text-xs text-muted-foreground">How the app behaves</p></div></button><button type="button" data-testid="button-settings-notifications" className="mt-1 flex w-full items-center gap-3 rounded-2xl p-4 text-left text-muted-foreground hover:bg-muted"><Bell className="ml-1 h-5 w-5" /><div><p className="text-sm font-semibold">Notifications</p><p className="text-xs text-muted-foreground">Useful nudges, never noise</p></div></button></aside><section className="rounded-3xl border border-border bg-card p-6 sm:p-8"><div className="flex items-center justify-between border-b border-border pb-6"><div><h2 className="font-display text-3xl">Profile</h2><p className="mt-1 text-sm text-muted-foreground">This is how we will greet you.</p></div><div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">SM</div></div><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="First name"><TextInput data-testid="input-settings-first-name" defaultValue="Sam" /></Field><Field label="Last name"><TextInput data-testid="input-settings-last-name" defaultValue="Morgan" /></Field><Field label="Email address"><TextInput data-testid="input-settings-email" type="email" defaultValue="sam@morgan.house" /></Field><Field label="Home currency"><select data-testid="select-settings-currency" className="w-full rounded-xl border border-input bg-card px-3.5 py-3 text-sm"><option>US Dollar ($)</option><option>Euro (€)</option><option>British Pound (£)</option></select></Field></div><div className="mt-9 border-t border-border pt-7"><h3 className="font-semibold">Appearance</h3><div className="mt-4 flex items-center justify-between rounded-2xl bg-muted/60 p-4"><div><p className="text-sm font-semibold">Night reading</p><p className="mt-1 text-xs text-muted-foreground">Use a deeper palette when the sun goes down.</p></div><button type="button" role="switch" aria-checked={dark} data-testid="button-toggle-theme" onClick={() => { setDark((value) => !value); document.documentElement.classList.toggle('dark'); }} className={`flex h-7 w-12 items-center rounded-full p-1 ${dark ? 'bg-primary justify-end' : 'bg-border justify-start'}`}><span className="h-5 w-5 rounded-full bg-card shadow-sm" /></button></div></div><div className="mt-8 flex items-center justify-end gap-3"><span className={`text-sm text-primary ${saved ? 'opacity-100' : 'opacity-0'}`}><Check className="mr-1 inline h-4 w-4" />Saved</span><Button data-testid="button-save-settings" onClick={save}>Save changes</Button></div></section></div></div>;
}

function Router() {
  return <ErrorBoundary><Shell><Switch><Route path="/" component={Dashboard} /><Route path="/transactions" component={Transactions} /><Route path="/accounts" component={Accounts} /><Route path="/goals" component={Goals} /><Route path="/budget" component={Budget} /><Route path="/cards" component={Cards} /><Route path="/insights" component={Insights} /><Route path="/settings" component={Settings} /><Route component={NotFound} /></Switch></Shell></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><Router /></QueryClientProvider>;
}

export default App;