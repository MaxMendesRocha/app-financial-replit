import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
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
import { ClerkProvider, Show, SignIn, SignUp, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Link, Redirect, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

if (!clerkPubKey) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY não foi configurada.');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#286f61',
    colorForeground: '#263e39',
    colorMutedForeground: '#72817d',
    colorDanger: '#b94b4b',
    colorBackground: '#fbfaf6',
    colorInput: '#ffffff',
    colorInputForeground: '#263e39',
    colorNeutral: '#d9dfd9',
    fontFamily: 'DM Sans, sans-serif',
    borderRadius: '1rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#fbfaf6] rounded-3xl w-[440px] max-w-full overflow-hidden',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'font-display text-3xl text-[#263e39]',
    headerSubtitle: 'text-[#72817d]',
    socialButtonsBlockButtonText: '!text-[#263e39]',
    formFieldLabel: 'text-[#263e39] font-semibold',
    footerActionLink: '!text-[#286f61] font-semibold',
    footerActionText: '!text-[#72817d]',
    dividerText: 'text-[#72817d]',
    formButtonPrimary: '!bg-[#286f61] hover:!bg-[#20594e] !text-white',
    formFieldInput: 'border-[#d9dfd9] bg-white !text-[#263e39]',
    dividerLine: 'bg-[#d9dfd9]',
    main: 'bg-transparent',
  },
};

const fallbackSummary = {
  netWorth: 84260,
  available: 12640,
  income: 8240,
  expenses: 5168,
  investments: 56820,
  bills: 1810,
  savingsRate: 37.3,
  healthScore: 82,
  healthLabel: 'Estável e em crescimento',
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
  { id: 1, description: 'Northstar Studio', amount: 4200, type: 'income' as const, category: 'Salary', account: 'Conta principal', date: '2026-08-28', status: 'cleared' },
  { id: 2, description: 'Hearth & Grain', amount: 86.4, type: 'expense' as const, category: 'Groceries', account: 'Conta principal', date: '2026-08-27', status: 'cleared' },
  { id: 3, description: 'Cityline Electric', amount: 124.2, type: 'expense' as const, category: 'Home', account: 'Conta principal', date: '2026-08-26', status: 'cleared' },
  { id: 4, description: 'Moss & Metric', amount: 240, type: 'expense' as const, category: 'Dining', account: 'Cartão principal', date: '2026-08-25', status: 'cleared' },
  { id: 5, description: 'Carteira de investimentos', amount: 750, type: 'transfer' as const, category: 'Investments', account: 'Investimentos', date: '2026-08-24', status: 'pending' },
];

const fallbackAccounts = [
  { id: 1, name: 'Conta principal', institution: 'Banco Morrow', kind: 'Checking', balance: 9040, color: '#e5b94f' },
  { id: 2, name: 'Reserva de emergência', institution: 'Banco Morrow', kind: 'Savings', balance: 3600, color: '#88b7a3' },
  { id: 3, name: 'Investimentos', institution: 'Vanguard', kind: 'Investment', balance: 56820, color: '#df8c75' },
];

const fallbackCategories = [
  { id: 1, name: 'Moradia', color: '#88b7a3', icon: 'M', spent: 1452, budget: 1700 },
  { id: 2, name: 'Mercado', color: '#e5b94f', icon: 'M', spent: 486, budget: 620 },
  { id: 3, name: 'Alimentação', color: '#df8c75', icon: 'A', spent: 290, budget: 400 },
  { id: 4, name: 'Transporte', color: '#8e9dc0', icon: 'T', spent: 215, budget: 340 },
];

const fallbackGoals = [
  { id: 1, name: 'Viagem de férias', target: 8500, current: 5200, deadline: '2026-12-30', color: '#e5b94f' },
  { id: 2, name: 'Reserva da casa', target: 12000, current: 7650, deadline: '2026-12-31', color: '#88b7a3' },
  { id: 3, name: 'Futuro', target: 25000, current: 14820, deadline: '2027-03-01', color: '#df8c75' },
];

const fallbackCards = [
  { id: 1, name: 'Cartão principal', institution: 'Banco Morrow', limit: 9000, used: 1880, closingDay: 18, dueDay: 11, color: '#263e39' },
  { id: 2, name: 'Cartão viagens', institution: 'União Harbor', limit: 12000, used: 4320, closingDay: 4, dueDay: 27, color: '#b37c62' },
];

const fallbackBudget = {
  month: 'Setembro de 2026',
  planned: 5300,
  spent: 5168,
  lines: fallbackCategories.map(({ name, color, spent, budget }) => ({ category: name, color, spent, planned: budget })),
};

const nav = [
  { href: '/app', label: 'Visão geral', icon: LayoutDashboard },
  { href: '/app/transactions', label: 'Movimentações', icon: ArrowLeftRight },
  { href: '/app/accounts', label: 'Contas', icon: Wallet },
  { href: '/app/goals', label: 'Metas', icon: Target },
  { href: '/app/budget', label: 'Orçamento', icon: Grid2X2 },
  { href: '/app/cards', label: 'Cartões', icon: CreditCard },
  { href: '/app/insights', label: 'Inteligência', icon: Sparkles },
];

const transactionTypeLabels: Record<TransactionType | 'all', string> = {
  all: 'Todos',
  income: 'Receitas',
  expense: 'Despesas',
  transfer: 'Transferências',
};

const transactionStatusLabels: Record<string, string> = {
  cleared: 'Confirmada',
  pending: 'Pendente',
  completed: 'Concluída',
};

const accountKindLabels: Record<string, string> = {
  Checking: 'Conta corrente',
  Savings: 'Poupança',
  Investment: 'Investimentos',
  Cash: 'Carteira',
};

const categoryLabels: Record<string, string> = {
  Home: 'Moradia',
  Groceries: 'Mercado',
  Dining: 'Alimentação',
  Transport: 'Transporte',
  Salary: 'Salário',
  Investments: 'Investimentos',
};

const monthLabels: Record<string, string> = {
  Jan: 'Jan',
  Feb: 'Fev',
  Mar: 'Mar',
  Apr: 'Abr',
  May: 'Mai',
  Jun: 'Jun',
  Jul: 'Jul',
  Aug: 'Ago',
  Sep: 'Set',
  Oct: 'Out',
  Nov: 'Nov',
  Dec: 'Dez',
};

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
      <div className="mb-6 flex items-center justify-between"><h2 className="font-display text-3xl">{title}</h2><button type="button" aria-label="Fechar" data-testid="button-close-modal" onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted"><X className="h-5 w-5" /></button></div>
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
  const { user } = useUser();
  const { signOut } = useClerk();
  const firstName = user?.firstName || 'você';
  const displayName = user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Sua conta';
  const pageName = location === '/app' ? `Bom dia, ${firstName}` : nav.find((item) => item.href === location)?.label ?? 'Configurações';
  const today = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());
  return <div className="noise min-h-[100dvh] bg-background text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-sidebar px-5 py-6 text-sidebar-foreground transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-12 flex items-center justify-between px-2"><Link href="/app" data-testid="link-brand" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"><TrendingUp className="h-5 w-5" /></span><span className="font-display text-xl tracking-tight">Finch</span></Link><button type="button" aria-label="Fechar menu" data-testid="button-close-nav" className="md:hidden" onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button></div>
      <nav className="space-y-1" aria-label="Navegação principal">{nav.map(({ href, label, icon: Icon }) => <Link href={href} key={href} data-testid={`link-nav-${label.toLowerCase()}`} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${location === href ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'}`}><Icon className="h-[18px] w-[18px]" /><span>{label}</span>{href === '/app/insights' && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}</Link>)}</nav>
      <div className="mt-auto space-y-1">
        <Link href="/app/settings" data-testid="link-nav-settings" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${location === '/app/settings' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}><Settings2 className="h-[18px] w-[18px]" /><span>Configurações</span></Link>
        <div className="mt-5 border-t border-sidebar-border pt-5"><div className="flex items-center gap-3 px-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">{displayName.slice(0, 2).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm font-semibold">{displayName}</p><p className="truncate text-xs text-sidebar-foreground/50">Espaço pessoal</p></div><button type="button" aria-label="Sair da conta" onClick={() => void signOut({ redirectUrl: basePath || '/' })} className="ml-auto rounded-full p-1 hover:bg-sidebar-accent"><ChevronDown className="h-4 w-4 opacity-50" /></button></div></div>
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
  return <div className="relative h-52 w-full" data-testid="chart-cash-flow"><svg viewBox="0 0 360 175" preserveAspectRatio="none" className="h-full w-full overflow-visible"><line x1="20" y1="142" x2="340" y2="142" stroke="hsl(var(--border))" /><line x1="20" y1="90" x2="340" y2="90" stroke="hsl(var(--border))" strokeDasharray="3 5" /><line x1="20" y1="38" x2="340" y2="38" stroke="hsl(var(--border))" strokeDasharray="3 5" /><polyline points={incomePoints} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><polyline points={expensePoints} fill="none" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{data.map((item, index) => <g key={item.month}><circle cx={20 + index * 64} cy={142 - (item.income / max) * 105} r="4" fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth="3" /><circle cx={20 + index * 64} cy={142 - (item.expenses / max) * 105} r="4" fill="hsl(var(--accent))" stroke="hsl(var(--card))" strokeWidth="3" /><text x={20 + index * 64} y="165" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">{monthLabels[item.month] ?? item.month}</text></g>)}</svg><div className="absolute right-0 top-0 flex gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-primary" />Receitas</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-accent" />Despesas</span></div></div>;
}

function TransactionRow({ transaction, index }: { transaction: (typeof fallbackTransactions)[number]; index: number }) {
  const positive = transaction.type === 'income';
  return <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border/70 py-4 last:border-b-0 sm:grid-cols-[1.8fr_1fr_1fr_auto] page-enter" style={{ animationDelay: `${index * 45}ms` }} data-testid={`row-transaction-${transaction.id}`}><div className="flex min-w-0 items-center gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${positive ? 'bg-[#88b7a3]/25 text-primary' : 'bg-muted text-muted-foreground'}`}>{positive ? <ArrowDownLeft className="h-4 w-4" /> : transaction.type === 'transfer' ? <ArrowLeftRight className="h-4 w-4" /> : <Receipt className="h-4 w-4" />}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{transaction.description}</p><p className="truncate text-xs text-muted-foreground">{categoryLabels[transaction.category] ?? transaction.category} · {transaction.account}</p></div></div><span className="hidden text-sm text-muted-foreground sm:block">{dateLabel(transaction.date)}</span><span className="hidden text-xs text-muted-foreground sm:block">{transactionStatusLabels[transaction.status] ?? transaction.status}</span><span className={`text-right font-mono-ui text-sm ${positive ? 'text-primary' : 'text-foreground'}`}>{positive ? '+' : transaction.type === 'transfer' ? '' : '-'}{money(transaction.amount)}</span></div>;
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
  return <div className="space-y-7"><SectionTitle eyebrow="Seu histórico financeiro" title="Movimentações" body="Pesquise as pequenas e grandes decisões. Tudo se soma." action={<Button data-testid="button-open-transaction" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Adicionar movimentação</Button>} /><div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" /><TextInput data-testid="input-search-transactions" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar estabelecimento, categoria ou conta" className="pl-10" /></div><div className="flex items-center gap-1 rounded-xl border border-input bg-card p-1"><ListFilter className="ml-2 h-4 w-4 text-muted-foreground" />{(['all', 'income', 'expense', 'transfer'] as const).map((item) => <button type="button" data-testid={`button-filter-${item}`} key={item} onClick={() => setType(item)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${type === item ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>{transactionTypeLabels[item]}</button>)}</div></div><section className="rounded-3xl border border-border bg-card px-5 py-2 sm:px-8"><div className="hidden grid-cols-[1.8fr_1fr_1fr_auto] border-b border-border py-4 text-[10px] font-bold uppercase tracking-[.15em] text-muted-foreground sm:grid"><span>Detalhes</span><span>Data</span><span>Status</span><span>Valor</span></div>{transactionsQuery.isLoading && !transactionsQuery.data ? <LoadingState label="Carregando movimentações" /> : transactionsQuery.isError && !transactionsQuery.data ? <ErrorState retry={() => transactionsQuery.refetch()} /> : list.length ? list.map((item, index) => <TransactionRow transaction={item} index={index} key={item.id} />) : <EmptyState icon={Receipt} title="Nenhuma movimentação encontrada" body="Tente outra busca ou adicione sua primeira movimentação." action={<Button className="mt-5" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Adicionar movimentação</Button>} />}</section>{open && <Modal title="Adicionar movimentação" onClose={() => setOpen(false)}><form onSubmit={submit} className="space-y-4"><Field label="Descrição"><TextInput required name="description" data-testid="input-transaction-description" placeholder="ex.: Mercado do bairro" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Valor"><TextInput required min="0.01" step="0.01" name="amount" type="number" data-testid="input-transaction-amount" placeholder="0,00" /></Field><Field label="Tipo"><select name="type" data-testid="select-transaction-type" defaultValue="expense" className="w-full rounded-xl border border-input bg-card px-3.5 py-3 text-sm"><option value="expense">Despesa</option><option value="income">Receita</option><option value="transfer">Transferência</option></select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Categoria"><select name="category" data-testid="select-transaction-category" className="w-full rounded-xl border border-input bg-card px-3.5 py-3 text-sm">{categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}</select></Field><Field label="Conta"><select name="account" data-testid="select-transaction-account" className="w-full rounded-xl border border-input bg-card px-3.5 py-3 text-sm">{accounts.map((account) => <option key={account.id} value={account.name}>{account.name}</option>)}</select></Field></div><Field label="Data"><TextInput required name="date" type="date" data-testid="input-transaction-date" defaultValue="2026-09-02" /></Field><Button type="submit" disabled={create.isPending} data-testid="button-submit-transaction" className="mt-3 w-full">{create.isPending ? 'Salvando...' : 'Salvar movimentação'}</Button>{create.isError && <p className="text-sm text-destructive">Não foi possível salvar esta movimentação. Tente novamente.</p>}</form></Modal>}</div>;
}

function Accounts() {
  const queryClient = useQueryClient();
  const accountsQuery = useListAccounts();
  const create = useCreateAccount();
  const [open, setOpen] = useState(false);
  const accounts = accountsQuery.data ?? fallbackAccounts;
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); const data: AccountInput = { name: String(form.get('name')), institution: String(form.get('institution')), kind: String(form.get('kind')), balance: Number(form.get('balance')), color: String(form.get('color')) }; create.mutate({ data }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAccountsQueryKey() }); setOpen(false); } }); };
  return <div className="space-y-8"><SectionTitle eyebrow="Suas bases financeiras" title="Contas" body="Onde seu dinheiro descansa, circula e cresce." action={<Button data-testid="button-open-account" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Adicionar conta</Button>} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{accountsQuery.isLoading && !accountsQuery.data ? <LoadingState label="Carregando contas" /> : accounts.map((account, index) => <article key={account.id} data-testid={`card-account-${account.id}`} className="group rounded-3xl border border-border bg-card p-6 page-enter" style={{ animationDelay: `${index * 70}ms` }}><div className="mb-10 flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${account.color}30`, color: account.color }}><Landmark className="h-5 w-5" /></span><button type="button" data-testid={`button-account-menu-${account.id}`} aria-label={`Mais opções para ${account.name}`} className="rounded-full p-1.5 text-muted-foreground opacity-50 hover:bg-muted hover:opacity-100"><MoreHorizontal className="h-5 w-5" /></button></div><p className="text-sm font-semibold">{account.name}</p><p className="mt-1 text-xs text-muted-foreground">{account.institution} · {accountKindLabels[account.kind] ?? account.kind}</p><p className="mt-5 font-mono-ui text-3xl">{money(account.balance)}</p><div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: account.color }} />Conectada e sincronizada</div></article>)}</div><div className="grid gap-4 lg:grid-cols-[1fr_.75fr]"><div className="rounded-3xl bg-primary p-7 text-primary-foreground"><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-sidebar-primary">Total nas contas</p><p className="mt-3 font-mono-ui text-4xl">{money(accounts.reduce((total, account) => total + account.balance, 0))}</p><p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-foreground/65">Suas contas conectadas estão em uma boa posição. Mantenha um mês de despesas sempre disponível.</p></div><div className="rounded-3xl border border-border bg-accent/25 p-7"><PiggyBank className="h-5 w-5 text-primary" /><h2 className="mt-5 font-display text-2xl">Mais tranquilidade</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Sua conta de reserva cobre 21 dias de despesas essenciais, acima dos 18 dias do mês passado.</p></div></div>{open && <Modal title="Adicionar conta" onClose={() => setOpen(false)}><form onSubmit={submit} className="space-y-4"><Field label="Nome da conta"><TextInput required name="name" data-testid="input-account-name" placeholder="Reserva de emergência" /></Field><Field label="Instituição"><TextInput required name="institution" data-testid="input-account-institution" placeholder="Nubank" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Tipo"><select name="kind" data-testid="select-account-kind" className="w-full rounded-xl border border-input bg-card px-3.5 py-3 text-sm"><option>Conta corrente</option><option>Poupança</option><option>Investimentos</option><option>Carteira</option></select></Field><Field label="Saldo"><TextInput required name="balance" type="number" step=".01" data-testid="input-account-balance" placeholder="0,00" /></Field></div><Field label="Cor de destaque"><input name="color" type="color" data-testid="input-account-color" defaultValue="#e5b94f" className="h-12 w-full cursor-pointer rounded-xl border border-input bg-card p-1" /></Field><Button type="submit" disabled={create.isPending} data-testid="button-submit-account" className="mt-3 w-full">{create.isPending ? 'Salvando...' : 'Salvar conta'}</Button></form></Modal>}</div>;
}

function Goals() {
  const queryClient = useQueryClient();
  const goalsQuery = useListGoals();
  const create = useCreateGoal();
  const [open, setOpen] = useState(false);
  const goals = goalsQuery.data ?? fallbackGoals;
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); const data: GoalInput = { name: String(form.get('name')), target: Number(form.get('target')), current: Number(form.get('current')), deadline: String(form.get('deadline')), color: String(form.get('color')) }; create.mutate({ data }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListGoalsQueryKey() }); setOpen(false); } }); };
  return <div className="space-y-8"><SectionTitle eyebrow="O olhar para o futuro" title="Metas" body="Dê um nome ao futuro. Depois, deixe as pequenas escolhas fazerem seu trabalho." action={<Button data-testid="button-open-goal" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Nova meta</Button>} /><div className="grid gap-4 lg:grid-cols-3">{goalsQuery.isLoading && !goalsQuery.data ? <LoadingState label="Carregando metas" /> : goals.length ? goals.map((goal, index) => { const percent = Math.min(100, (goal.current / goal.target) * 100); return <article key={goal.id} data-testid={`card-goal-${goal.id}`} className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 page-enter" style={{ animationDelay: `${index * 80}ms` }}><div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full opacity-20" style={{ backgroundColor: goal.color }} /><div className="relative"><div className="flex items-center justify-between"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: goal.color }} /><span className="font-mono-ui text-xs text-muted-foreground">{Math.round(percent)}%</span></div><h2 className="mt-9 font-display text-2xl">{goal.name}</h2><p className="mt-1 text-xs text-muted-foreground">Meta até {dateLabel(goal.deadline)}</p><div className="mt-9"><div className="flex items-baseline justify-between"><span className="font-mono-ui text-xl">{money(goal.current)}</span><span className="text-xs text-muted-foreground">de {money(goal.target)}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: goal.color }} /></div></div><div className="mt-6 flex items-center justify-between text-xs text-muted-foreground"><span>Faltam {money(Math.max(0, goal.target - goal.current))}</span><button type="button" data-testid={`button-goal-add-${goal.id}`} onClick={() => setOpen(true)} className="font-semibold text-primary hover:underline">Adicionar valor</button></div></div></article>; }) : <EmptyState icon={Target} title="Nenhuma meta no horizonte" body="Crie uma meta para dar um destino à sua próxima boa decisão." action={<Button className="mt-5" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Criar uma meta</Button>} />}</div><section className="rounded-3xl border border-border bg-accent/25 p-7 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-primary">Um incentivo</p><h2 className="mt-2 font-display text-3xl">Progresso gosta de consistência.</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Juntas, suas metas já estão 61% a caminho da vida que você está planejando. Mantenha seu ritmo semanal e você chega lá.</p></div><div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[8px] border-primary/15 border-t-primary font-mono-ui text-xl text-primary">61%</div></div></section>{open && <Modal title="Criar uma meta" onClose={() => setOpen(false)}><form onSubmit={submit} className="space-y-4"><Field label="Nome da meta"><TextInput required name="name" data-testid="input-goal-name" placeholder="Viagem de férias" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Valor alvo"><TextInput required name="target" type="number" step=".01" data-testid="input-goal-target" placeholder="8500" /></Field><Field label="Valor já guardado"><TextInput required name="current" type="number" step=".01" defaultValue="0" data-testid="input-goal-current" /></Field></div><Field label="Data da meta"><TextInput required name="deadline" type="date" data-testid="input-goal-deadline" /></Field><Field label="Cor de destaque"><input name="color" type="color" data-testid="input-goal-color" defaultValue="#e5b94f" className="h-12 w-full cursor-pointer rounded-xl border border-input bg-card p-1" /></Field><Button type="submit" disabled={create.isPending} data-testid="button-submit-goal" className="mt-3 w-full">{create.isPending ? 'Salvando...' : 'Criar meta'}</Button></form></Modal>}</div>;
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
  return <div className="space-y-8"><SectionTitle eyebrow="Dê um destino a cada real" title="Orçamento" body="Este mês não é uma prova. É um plano claro e ajustável." action={editing ? <div className="flex gap-2"><Button variant="plain" data-testid="button-cancel-budget" onClick={() => setEditing(false)}>Cancelar</Button><Button data-testid="button-save-budget" disabled={update.isPending} onClick={save}>{update.isPending ? 'Salvando...' : 'Salvar plano'}</Button></div> : <Button variant="soft" data-testid="button-edit-budget" onClick={() => setEditing(true)}>Ajustar plano</Button>} /><div className="grid gap-4 lg:grid-cols-[.85fr_1.4fr]"><section className="rounded-3xl bg-primary p-7 text-primary-foreground sm:p-8 page-enter"><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-sidebar-primary">{budget.month}</p><p className="mt-5 font-mono-ui text-4xl">{money(budget.spent)}</p><p className="mt-1 text-sm text-primary-foreground/60">de {money(budget.planned)} planejados</p><div className="mt-9 h-3 overflow-hidden rounded-full bg-primary-foreground/15"><div className="h-full rounded-full bg-sidebar-primary" style={{ width: `${totalPercent}%` }} /></div><div className="mt-3 flex justify-between text-xs text-primary-foreground/60"><span>{Math.round(totalPercent)}% utilizado</span><span>{money(Math.max(0, budget.planned - budget.spent))} restantes</span></div><div className="mt-10 border-t border-primary-foreground/15 pt-5"><p className="text-xs text-primary-foreground/60">Plano mensal</p>{editing ? <TextInput data-testid="input-budget-planned" value={planned} onChange={(event) => setPlanned(event.target.value)} type="number" className="mt-2 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground" /> : <p className="mt-1 font-mono-ui text-xl">{money(budget.planned)}</p>}</div></section><section className="rounded-3xl border border-border bg-card px-6 py-2 sm:px-8 page-enter stagger-1"><div className="grid grid-cols-[1fr_auto] border-b border-border py-5 text-[10px] font-bold uppercase tracking-[.15em] text-muted-foreground sm:grid-cols-[1.3fr_1fr_1fr]"><span>Categoria</span><span>Gasto</span><span className="text-right">Plano</span></div>{budgetQuery.isLoading && !budgetQuery.data ? <LoadingState label="Carregando orçamento" /> : lines.map((line, index) => { const percent = Math.min(100, (line.spent / line.planned) * 100); return <div key={line.category} data-testid={`row-budget-${index}`} className="border-b border-border/70 py-5 last:border-0"><div className="flex items-center justify-between sm:grid sm:grid-cols-[1.3fr_1fr_1fr]"><div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: line.color }} /><span className="text-sm font-semibold">{line.category}</span></div><span className="font-mono-ui text-sm">{money(line.spent)}</span>{editing ? <TextInput data-testid={`input-budget-line-${index}`} value={lineValues[line.category] ?? String(line.planned)} onChange={(event) => setLineValues((current) => ({ ...current, [line.category]: event.target.value }))} type="number" className="mt-3 w-28 justify-self-end py-2 sm:mt-0" /> : <span className="text-right font-mono-ui text-sm text-muted-foreground">{money(line.planned)}</span>}</div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted sm:mr-[33%]"><div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: line.color }} /></div></div>; })}</section></div><div className="rounded-3xl border border-border bg-accent/25 p-7"><div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary"><Sparkles className="h-5 w-5" /></div><div><p className="font-semibold">Seu plano ainda tem espaço.</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">Moradia está 15% abaixo do ritmo mensal. Isso dá uma margem útil para a última semana do mês.</p></div></div></div><span className="sr-only">{categoriesQuery.data?.length ?? 0} categorias carregadas</span></div>;
}

function Cards() {
  const cardsQuery = useListCards();
  const cards = cardsQuery.data ?? fallbackCards;
  return <div className="space-y-8"><SectionTitle eyebrow="Acompanhe seus limites" title="Cartões" body="Saiba o que vence antes que vire uma surpresa." /><div className="grid gap-5 lg:grid-cols-2">{cardsQuery.isLoading && !cardsQuery.data ? <LoadingState label="Carregando cartões" /> : cards.map((card, index) => { const usage = Math.min(100, (card.used / card.limit) * 100); return <article key={card.id} data-testid={`card-credit-${card.id}`} className="overflow-hidden rounded-3xl border border-border bg-card page-enter" style={{ animationDelay: `${index * 80}ms` }}><div className="relative h-52 overflow-hidden p-7 text-card-foreground" style={{ backgroundColor: card.color }}><div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[24px] border-white/10" /><div className="relative flex h-full flex-col justify-between"><div className="flex items-center justify-between"><span className="text-sm font-semibold">{card.institution}</span><CreditCard className="h-5 w-5 opacity-70" /></div><div><p className="font-mono-ui text-2xl tracking-[.18em]">•••• 4821</p><p className="mt-2 text-xs opacity-60">{card.name}</p></div></div></div><div className="p-7"><div className="flex items-end justify-between"><div><p className="text-xs uppercase tracking-[.14em] text-muted-foreground">Fatura atual</p><p className="mt-2 font-mono-ui text-2xl">{money(card.used)}</p></div><div className="text-right"><p className="text-xs text-muted-foreground">de {money(card.limit)}</p><p className="mt-1 text-xs font-semibold text-primary">{Math.round(usage)}% utilizado</p></div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${usage > 70 ? 'bg-destructive' : 'bg-accent'}`} style={{ width: `${usage}%` }} /></div><div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5 text-xs"><div><p className="text-muted-foreground">Fechamento</p><p className="mt-1 font-semibold">Dia {card.closingDay}</p></div><div><p className="text-muted-foreground">Vencimento</p><p className="mt-1 font-semibold">Dia {card.dueDay}</p></div></div></div></article>; })}</div><section className="rounded-3xl bg-primary p-7 text-primary-foreground sm:p-8"><div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-sidebar-primary">Próximo vencimento</p><h2 className="mt-2 font-display text-3xl">O cartão principal vence em 16 dias.</h2><p className="mt-2 text-sm text-primary-foreground/65">Você tem saldo suficiente na conta para cobrir a fatura e manter sua reserva.</p></div><Button variant="soft" data-testid="button-card-details">Ver detalhes da fatura <ArrowUpRight className="h-4 w-4" /></Button></div></section></div>;
}

function Insights() {
  const summaryQuery = useGetDashboardSummary();
  const summary = summaryQuery.data ?? fallbackSummary;
  return <div className="space-y-8"><SectionTitle eyebrow="Uma visão mais clara" title="Inteligência" body="Não são previsões. É contexto útil para as escolhas que estão à sua frente." /><section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]"><div className="rounded-3xl bg-primary p-7 text-primary-foreground sm:p-10 page-enter"><div className="flex items-center gap-2 text-sidebar-primary"><Sparkles className="h-5 w-5" /><span className="font-mono-ui text-[10px] uppercase tracking-[.18em]">Leitura do mês</span></div><h2 className="mt-10 max-w-lg font-display text-4xl leading-[1.05] sm:text-5xl">Seu dinheiro está abrindo espaço para o que importa.</h2><p className="mt-6 max-w-lg text-sm leading-relaxed text-primary-foreground/65">As receitas subiram enquanto seus custos fixos ficaram estáveis. Por isso sua taxa de economia chegou a {summary.savingsRate}% sem exigir uma mudança brusca de ritmo.</p><div className="mt-10 flex flex-wrap gap-3"><span className="rounded-full bg-sidebar-primary px-4 py-2 font-mono-ui text-xs text-sidebar-primary-foreground">{summary.savingsRate}% de economia</span><span className="rounded-full border border-primary-foreground/20 px-4 py-2 font-mono-ui text-xs">+{summary.monthlyChange}% de patrimônio</span></div></div><div className="rounded-3xl border border-border bg-card p-7 sm:p-10 page-enter stagger-1"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-primary"><BarChart3 className="h-5 w-5" /></div><p className="mt-9 font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">O número importante</p><p className="mt-2 font-mono-ui text-5xl">{money(summary.bills)}</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">das suas despesas mensais são contas previsíveis. É uma boa base para planejar.</p><Link href="/budget" data-testid="link-insight-budget" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">Ver seu plano <ArrowUpRight className="h-4 w-4" /></Link></div></section><div className="grid gap-4 md:grid-cols-3"><InsightCard icon={BookOpen} eyebrow="Padrão" title="Alimentação mais tranquila" body="Você está 22% abaixo do ritmo de gastos com alimentação em comparação aos últimos três meses." tone="warm" /><InsightCard icon={Target} eyebrow="Oportunidade" title="Uma meta ao alcance" body="Nesse ritmo, sua meta de viagem será concluída 11 dias antes do prazo." /><InsightCard icon={BriefcaseBusiness} eyebrow="Atenção" title="Uso do cartão" body="O uso do cartão está acima do normal. Um pagamento nesta semana pode recuperar sua margem." tone="coral" /></div><section className="rounded-3xl border border-border bg-card p-7"><div className="flex items-center justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">Como seu score evolui</p><h2 className="mt-2 font-display text-3xl">Sinais pequenos, não uma nota.</h2></div><span className="font-mono-ui text-3xl text-primary">{summary.healthScore}<span className="text-sm text-muted-foreground">/100</span></span></div><div className="mt-8 grid gap-5 sm:grid-cols-4">{[['Reserva de caixa', 'Forte', 86], ['Ritmo de economia', 'Forte', 78], ['Nível de dívidas', 'Leve', 91], ['Clareza do plano', 'Boa', 73]].map(([label, value, score], index) => <div key={String(label)} data-testid={`metric-health-${index}`}><div className="flex justify-between text-xs"><span className="font-semibold">{label}</span><span className="text-muted-foreground">{value}</span></div><div className="mt-3 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} /></div></div>)}</div></section></div>;
}

function InsightCard({ icon: Icon, eyebrow, title, body, tone = 'default' }: { icon: typeof BookOpen; eyebrow: string; title: string; body: string; tone?: 'default' | 'warm' | 'coral' }) {
  return <article className={`rounded-3xl border border-border p-7 page-enter ${tone === 'warm' ? 'bg-accent/25' : tone === 'coral' ? 'bg-[#df8c75]/15' : 'bg-card'}`}><Icon className="h-5 w-5 text-primary" /><p className="mt-7 font-mono-ui text-[10px] uppercase tracking-[.18em] text-muted-foreground">{eyebrow}</p><h2 className="mt-2 font-display text-2xl">{title}</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p></article>;
}

function Settings() {
  const [saved, setSaved] = useState(false);
  const [dark, setDark] = useState(false);
  const save = () => { setSaved(true); window.setTimeout(() => setSaved(false), 2200); };
  return <div className="space-y-8"><SectionTitle eyebrow="Deixe do seu jeito" title="Configurações" body="Escolhas simples para definir como o Finch acompanha você todos os dias." /><div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><aside className="rounded-3xl border border-border bg-card p-3"><button type="button" data-testid="button-settings-profile" className="flex w-full items-center gap-3 rounded-2xl bg-accent/40 p-4 text-left"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">SM</div><div><p className="text-sm font-semibold">Perfil</p><p className="text-xs text-muted-foreground">Seus dados pessoais</p></div></button><button type="button" data-testid="button-settings-preferences" className="mt-1 flex w-full items-center gap-3 rounded-2xl p-4 text-left text-muted-foreground hover:bg-muted"><Settings2 className="ml-1 h-5 w-5" /><div><p className="text-sm font-semibold">Preferências</p><p className="text-xs text-muted-foreground">Como o app funciona</p></div></button><button type="button" data-testid="button-settings-notifications" className="mt-1 flex w-full items-center gap-3 rounded-2xl p-4 text-left text-muted-foreground hover:bg-muted"><Bell className="ml-1 h-5 w-5" /><div><p className="text-sm font-semibold">Notificações</p><p className="text-xs text-muted-foreground">Lembretes úteis, nunca excesso</p></div></button></aside><section className="rounded-3xl border border-border bg-card p-6 sm:p-8"><div className="flex items-center justify-between border-b border-border pb-6"><div><h2 className="font-display text-3xl">Perfil</h2><p className="mt-1 text-sm text-muted-foreground">É assim que vamos cumprimentar você.</p></div><div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">SM</div></div><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Nome"><TextInput data-testid="input-settings-first-name" defaultValue="Sam" /></Field><Field label="Sobrenome"><TextInput data-testid="input-settings-last-name" defaultValue="Morgan" /></Field><Field label="E-mail"><TextInput data-testid="input-settings-email" type="email" defaultValue="sam@morgan.house" /></Field><Field label="Moeda principal"><select data-testid="select-settings-currency" className="w-full rounded-xl border border-input bg-card px-3.5 py-3 text-sm"><option>Real brasileiro (R$)</option><option>Dólar americano (US$)</option><option>Euro (€)</option></select></Field></div><div className="mt-9 border-t border-border pt-7"><h3 className="font-semibold">Aparência</h3><div className="mt-4 flex items-center justify-between rounded-2xl bg-muted/60 p-4"><div><p className="text-sm font-semibold">Leitura noturna</p><p className="mt-1 text-xs text-muted-foreground">Use uma paleta mais escura quando o sol se pôr.</p></div><button type="button" role="switch" aria-checked={dark} data-testid="button-toggle-theme" onClick={() => { setDark((value) => !value); document.documentElement.classList.toggle('dark'); }} className={`flex h-7 w-12 items-center rounded-full p-1 ${dark ? 'bg-primary justify-end' : 'bg-border justify-start'}`}><span className="h-5 w-5 rounded-full bg-card shadow-sm" /></button></div></div><div className="mt-8 flex items-center justify-end gap-3"><span className={`text-sm text-primary ${saved ? 'opacity-100' : 'opacity-0'}`}><Check className="mr-1 inline h-4 w-4" />Salvo</span><Button data-testid="button-save-settings" onClick={save}>Salvar alterações</Button></div></section></div></div>;
}

function LandingPage() {
  return <main className="noise min-h-[100dvh] bg-background text-foreground"><header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-10"><Link href="/" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><TrendingUp className="h-5 w-5" /></span><span className="font-display text-xl tracking-tight">Finch</span></Link><div className="flex items-center gap-3"><Link href="/sign-in" className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted">Entrar</Link><Link href="/sign-up" className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Criar conta</Link></div></header><section className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-24"><div><p className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">Clareza para cada escolha</p><h1 className="mt-5 max-w-3xl font-display text-5xl leading-[.98] tracking-tight sm:text-7xl">Seu dinheiro, com espaço para respirar.</h1><p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">Uma visão simples e humana das suas contas, metas e decisões financeiras — com seus dados protegidos por uma conta pessoal.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/sign-up" className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Começar agora</Link><Link href="/sign-in" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-bold">Já tenho uma conta</Link></div></div><div className="rounded-[2rem] border border-border bg-card p-5 shadow-[0_24px_80px_-32px_rgba(38,62,57,.35)] sm:p-7"><div className="rounded-[1.5rem] bg-primary p-6 text-primary-foreground sm:p-8"><div className="flex items-center justify-between"><span className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-sidebar-primary">Visão geral</span><span className="rounded-full bg-sidebar-primary/20 px-3 py-1 text-xs text-sidebar-primary">Seu espaço</span></div><p className="mt-10 text-sm text-primary-foreground/60">Patrimônio líquido</p><p className="mt-2 font-mono-ui text-4xl">R$ 84.260</p><div className="mt-9 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-primary-foreground/10 p-4"><p className="text-xs text-primary-foreground/60">Economia</p><p className="mt-2 text-2xl font-semibold">37%</p></div><div className="rounded-2xl bg-primary-foreground/10 p-4"><p className="text-xs text-primary-foreground/60">Saúde</p><p className="mt-2 text-2xl font-semibold">82</p></div></div></div><div className="grid grid-cols-3 gap-3 pt-5 text-center text-xs text-muted-foreground"><span>Contas</span><span>Metas</span><span>Orçamento</span></div></div></section></main>;
}

function SignInPage() {
  return <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8"><SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} /></div>;
}

function SignUpPage() {
  return <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8"><SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} /></div>;
}

function HomeRedirect() {
  return <><Show when="signed-in"><Redirect to="/app" /></Show><Show when="signed-out"><LandingPage /></Show></>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const previousUserId = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (previousUserId.current !== undefined && previousUserId.current !== userId) queryClient.clear();
      previousUserId.current = userId;
    });
    return unsubscribe;
  }, [addListener]);
  return null;
}

function UserPortal() {
  return <><Show when="signed-in"><ErrorBoundary><Shell><Switch><Route path="/app" component={Dashboard} /><Route path="/app/transactions" component={Transactions} /><Route path="/app/accounts" component={Accounts} /><Route path="/app/goals" component={Goals} /><Route path="/app/budget" component={Budget} /><Route path="/app/cards" component={Cards} /><Route path="/app/insights" component={Insights} /><Route path="/app/settings" component={Settings} /><Route path="/transactions" component={Transactions} /><Route path="/accounts" component={Accounts} /><Route path="/goals" component={Goals} /><Route path="/budget" component={Budget} /><Route path="/cards" component={Cards} /><Route path="/insights" component={Insights} /><Route path="/settings" component={Settings} /><Route component={NotFound} /></Switch></Shell></ErrorBoundary></Show><Show when="signed-out"><Redirect to="/" /></Show></>;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  const stripBase = (path: string) => basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
  return <ClerkProvider publishableKey={clerkPubKey} proxyUrl={clerkProxyUrl} appearance={clerkAppearance} signInUrl={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} localization={{ signIn: { start: { title: 'Bem-vindo de volta', subtitle: 'Entre para acessar sua conta' } }, signUp: { start: { title: 'Crie sua conta', subtitle: 'Comece a organizar sua vida financeira' } } }} routerPush={(to) => setLocation(stripBase(to))} routerReplace={(to) => setLocation(stripBase(to), { replace: true })}><QueryClientProvider client={queryClient}><ClerkQueryClientCacheInvalidator /><Switch><Route path="/" component={HomeRedirect} /><Route path="/sign-in/*?" component={SignInPage} /><Route path="/sign-up/*?" component={SignUpPage} /><Route path="/app/*?" component={UserPortal} /><Route path="/transactions" component={UserPortal} /><Route path="/accounts" component={UserPortal} /><Route path="/goals" component={UserPortal} /><Route path="/budget" component={UserPortal} /><Route path="/cards" component={UserPortal} /><Route path="/insights" component={UserPortal} /><Route path="/settings" component={UserPortal} /><Route component={NotFound} /></Switch></QueryClientProvider></ClerkProvider>;
}

function App() {
  return <WouterRouter base={basePath}><ClerkProviderWithRoutes /></WouterRouter>;
}

export default App;