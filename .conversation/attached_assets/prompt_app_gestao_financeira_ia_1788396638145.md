# Prompt Mestre — App de Gestão Financeira Doméstica com IA

## 1. Objetivo

Crie um aplicativo completo de **gestão financeira doméstica inteligente**, com aparência de produto SaaS/fintech premium, altamente parametrizável, responsivo, escalável e orientado por Inteligência Artificial.

O objetivo não é criar apenas um CRUD de receitas e despesas.

O produto deve funcionar como um **copiloto financeiro doméstico**, ajudando o usuário a:

- entender sua situação financeira;
- controlar receitas e despesas;
- planejar o orçamento;
- acompanhar cartões e parcelamentos;
- definir e atingir metas;
- acompanhar patrimônio;
- projetar fluxo de caixa;
- identificar problemas e oportunidades;
- simular decisões;
- receber recomendações personalizadas;
- conversar com uma IA que tenha contexto financeiro real;
- transformar recomendações em ações, sempre com confirmação quando houver alteração de dados.

### Princípio central

> O aplicativo não deve apenas dizer para onde o dinheiro foi. Deve ajudar o usuário a decidir para onde o dinheiro deveria ir.

---

# 2. Visão do produto

A evolução desejada é:

**Controle financeiro → Inteligência financeira → Copiloto financeiro → Agente financeiro doméstico**

O aplicativo deve começar simples e confiável, mas possuir arquitetura preparada desde o início para recursos avançados.

A IA deve ser uma camada sobre um **motor financeiro determinístico e confiável**.

Nunca utilizar um LLM para fazer sozinho cálculos financeiros básicos que podem ser realizados pelo backend.

---

# 3. Público-alvo

Atender:

- pessoas solteiras;
- casais;
- famílias;
- famílias com filhos;
- usuários iniciantes;
- usuários avançados;
- pessoas com renda fixa;
- pessoas com renda variável;
- autônomos;
- profissionais liberais.

Permitir diferentes níveis de complexidade.

### Modo iniciante

Mostrar somente os indicadores essenciais.

### Modo avançado

Liberar:

- fluxo de caixa detalhado;
- orçamento;
- patrimônio;
- investimentos;
- cenários;
- indicadores;
- regras;
- automações;
- configurações avançadas.

---

# 4. Princípios de produto

O produto deve seguir estes princípios:

1. **Dados financeiros precisam ser confiáveis.**
2. **Regras de negócio devem ficar no backend.**
3. **A IA deve utilizar ferramentas para consultar dados.**
4. **A IA nunca deve inventar dados.**
5. **Toda recomendação relevante deve ser explicável.**
6. **Alterações financeiras devem exigir confirmação quando apropriado.**
7. **Tudo que puder ser parametrizado não deve ser hardcoded.**
8. **Mobile-first.**
9. **Interface simples apesar da complexidade interna.**
10. **Arquitetura preparada para evolução.**

---

# 5. Experiência principal

Ao abrir o aplicativo, o usuário deve conseguir responder rapidamente:

### Quanto tenho?

### Quanto entra?

### Quanto sai?

### Quanto posso gastar?

### Estou melhorando?

### O que devo fazer agora?

O dashboard deve permitir compreender a situação financeira em aproximadamente 30 segundos.

---

# 6. Dashboard

Criar dashboard altamente configurável.

Permitir:

- adicionar widgets;
- remover widgets;
- reordenar widgets;
- alterar tamanho;
- escolher período;
- filtrar conta;
- filtrar cartão;
- personalizar visualização.

### Dashboard padrão

Mostrar:

- patrimônio líquido;
- saldo disponível;
- receitas do mês;
- despesas do mês;
- investimentos;
- faturas;
- orçamento;
- metas;
- próximos compromissos;
- insights da IA.

### Exemplo

**Patrimônio líquido**

R$ 128.450,32

**Evolução**

+8,4% nos últimos 12 meses

---

# 7. Financial Health Score

Criar indicador de saúde financeira de 0 a 100.

Exemplo:

**82/100 — Boa**

Considerar:

- relação receita/despesa;
- taxa de poupança;
- reserva de emergência;
- endividamento;
- utilização do crédito;
- regularidade financeira;
- evolução patrimonial;
- cumprimento de metas;
- despesas recorrentes;
- concentração de gastos.

Mostrar evolução:

> Seu score aumentou 6 pontos este mês.

Permitir abrir a composição do score e entender cada fator.

---

# 8. Receitas

Criar módulo completo.

Tipos:

- salário;
- freelance;
- dividendos;
- rendimentos;
- aluguel;
- benefícios;
- outras receitas.

Campos:

- nome;
- valor;
- tipo;
- categoria;
- conta;
- data;
- recorrência;
- observações;
- tags.

Tipos de ocorrência:

- fixa;
- variável;
- recorrente;
- eventual.

---

# 9. Despesas

Campos:

- descrição;
- valor;
- categoria;
- subcategoria;
- conta;
- cartão;
- data;
- forma de pagamento;
- recorrência;
- parcelamento;
- responsável;
- tags;
- observações.

Suportar:

- despesa única;
- despesa recorrente;
- assinatura;
- parcelamento;
- despesa compartilhada.

---

# 10. Categorias

Categorias nunca devem ficar fixas no código.

Permitir:

- criar;
- editar;
- excluir;
- reordenar;
- criar subcategorias;
- definir ícone;
- definir cor;
- definir classificação;
- criar regras automáticas.

Categorias iniciais:

- Moradia;
- Alimentação;
- Transporte;
- Saúde;
- Educação;
- Lazer;
- Compras;
- Assinaturas;
- Impostos;
- Investimentos;
- Família;
- Outros.

Tudo deve ser configurável.

---

# 11. Regras inteligentes

Criar mecanismo de classificação automática.

Exemplo:

Se descrição contém:

`Netflix`

Classificar como:

`Assinaturas > Streaming`

Outro:

`Uber`

Classificar como:

`Transporte > Aplicativos`

A IA deve poder sugerir regras.

O usuário deve conseguir aprovar, editar ou rejeitar a regra.

---

# 12. Contas

Suportar:

- conta corrente;
- poupança;
- carteira;
- conta digital;
- conta de investimento;
- outras contas.

Mostrar:

- saldo;
- entradas;
- saídas;
- evolução;
- movimentações.

Transferências entre contas não devem ser contabilizadas como receita ou despesa.

---

# 13. Cartões

Cadastrar:

- nome;
- instituição;
- limite;
- fechamento;
- vencimento;
- bandeira;
- titular;
- cor.

Dashboard:

- limite total;
- limite utilizado;
- limite disponível;
- fatura atual;
- próxima fatura;
- compras parceladas;
- evolução dos gastos.

Alertas:

> Você já utilizou 76% do limite.

---

# 14. Parcelamentos

Exemplo:

Compra: R$ 3.600

12 parcelas

R$ 300/mês

Mostrar:

- parcela atual;
- total de parcelas;
- parcelas restantes;
- total pago;
- total restante;
- impacto futuro no fluxo de caixa.

Parcelas futuras devem aparecer automaticamente nos períodos correspondentes.

---

# 15. Orçamento

Criar orçamento mensal.

Mostrar:

- planejado;
- realizado;
- diferença;
- percentual utilizado;
- projeção.

Exemplo:

| Categoria | Planejado | Realizado | Diferença |
|---|---:|---:|---:|
| Moradia | R$ 2.500 | R$ 2.450 | +R$ 50 |
| Alimentação | R$ 1.500 | R$ 1.720 | -R$ 220 |
| Lazer | R$ 800 | R$ 620 | +R$ 180 |

A IA deve sugerir ajustes.

---

# 16. Métodos de orçamento

Implementar:

- 50/30/20;
- 60/20/20;
- método personalizado.

O usuário deve poder criar sua própria distribuição.

---

# 17. Metas

Criar:

- reserva de emergência;
- viagem;
- carro;
- casa;
- aposentadoria;
- investimento;
- educação;
- meta personalizada.

Campos:

- nome;
- valor alvo;
- valor atual;
- prazo;
- valor mensal necessário;
- progresso;
- status.

A IA deve responder:

> Quanto preciso guardar por mês?

> Estou no ritmo?

> Quanto preciso investir para atingir a meta?

---

# 18. Fluxo de caixa

Mostrar:

Saldo inicial  
+ Receitas  
- Despesas  
= Saldo final

Permitir projeção:

- 7 dias;
- 30 dias;
- 3 meses;
- 6 meses;
- 12 meses.

Considerar:

- receitas recorrentes;
- despesas recorrentes;
- parcelamentos;
- assinaturas;
- contas futuras;
- metas.

---

# 19. Simulador

Criar simulador financeiro.

Exemplos:

- comprar um carro;
- financiar imóvel;
- aumentar investimentos;
- reduzir despesas;
- perder 20% da renda;
- aumentar renda;
- antecipar dívida;
- criar reserva;
- investir mensalmente.

Permitir cenários:

- conservador;
- base;
- otimista;
- personalizado.

---

# 20. Investimentos

Criar módulo preparado para:

- renda fixa;
- ações;
- FIIs;
- ETFs;
- fundos;
- criptomoedas;
- outros ativos.

Mostrar:

- patrimônio;
- rentabilidade;
- aportes;
- dividendos;
- distribuição por classe;
- evolução.

Preparar arquitetura para futuras APIs de mercado.

---

# 21. Patrimônio líquido

Calcular:

**Ativos - Passivos = Patrimônio líquido**

Ativos:

- dinheiro;
- investimentos;
- imóveis;
- veículos;
- outros.

Passivos:

- cartões;
- empréstimos;
- financiamentos;
- outras dívidas.

Mostrar evolução histórica.

---

# 22. Financial Intelligence

Criar área específica de inteligência financeira.

Exemplo:

> Seu mês está saudável, mas existem três pontos de atenção.

### 1. Alimentação

Gastos 18% acima da média.

### 2. Cartão

Utilização aumentou 24%.

### 3. Investimentos

Você investiu R$ 700 abaixo da sua média.

---

# 23. IA proativa

A IA deve detectar:

- anomalias;
- aumento de gastos;
- redução de renda;
- risco de déficit;
- excesso de orçamento;
- aumento de utilização do cartão;
- metas atrasadas;
- assinaturas;
- cobranças potencialmente duplicadas;
- oportunidades de economia;
- oportunidades de aporte.

Exemplo:

> Sua conta de energia está 37% acima da média dos últimos 6 meses.

---

# 24. IA explicável

Toda recomendação importante deve permitir:

**"Por que você está dizendo isso?"**

Exemplo:

> Recomendo reduzir seu orçamento de lazer em R$ 150.

Explicação:

> Nos últimos 3 meses você gastou em média R$ 1.050 com lazer, enquanto seu orçamento atual é R$ 900.

A IA deve mostrar os dados utilizados na análise.

---

# 25. Chat financeiro

Criar assistente conversacional.

Perguntas:

- Quanto posso gastar este mês?
- Quanto economizei?
- Quanto vou ter em dezembro?
- Posso comprar uma TV de R$ 5.000?
- Quanto gasto com alimentação?
- Qual categoria está acima do normal?
- Quanto preciso investir por mês?
- Quando alcançarei minha meta?
- Como reduzir minhas despesas?

---

# 26. IA com ferramentas

Não enviar indiscriminadamente todo o banco de dados para o LLM.

Criar camada de orquestração.

Fluxo:

User  
↓  
AI Assistant  
↓  
Intent Detection  
↓  
Financial Context  
↓  
Tools  
↓  
Financial Engine  
↓  
LLM  
↓  
Response

Criar ferramentas:

```text
get_account_balance()
get_monthly_income()
get_monthly_expenses()
get_budget_status()
get_cash_flow()
get_credit_card_invoice()
get_installments()
get_goals()
get_net_worth()
get_investments()
simulate_purchase()
simulate_investment()
create_transaction()
update_budget()
create_goal()
```

A IA deve utilizar essas ferramentas para obter dados reais.

---

# 27. Regra absoluta contra alucinação

A IA nunca deve inventar:

- saldo;
- receita;
- despesa;
- patrimônio;
- rentabilidade;
- dados de mercado;
- informações financeiras.

Se não houver dados suficientes:

> Não tenho dados suficientes para calcular isso.

---

# 28. Comandos por linguagem natural

Preparar suporte para:

> Registre R$ 150 no supermercado.

A IA deve interpretar:

- valor;
- estabelecimento;
- categoria;
- data;
- conta.

Antes de alterar:

> Vou registrar R$ 150 em Alimentação > Supermercado na conta Nubank hoje. Confirmar?

Botões:

- Confirmar
- Editar
- Cancelar

---

# 29. Análise comportamental

Detectar:

- aumento de despesas;
- compras recorrentes;
- gastos sazonais;
- compras impulsivas;
- dependência de cartão;
- crescimento de assinaturas;
- concentração de despesas;
- mudanças de padrão.

---

# 30. Sistema de recomendações

Classificar:

### Crítica

Ação imediata.

### Alta

Ação recomendada.

### Média

Atenção.

### Baixa

Oportunidade.

Exemplos:

🔴 Projeção de déficit de R$ 780.

🟠 Utilização do cartão acima do padrão.

🟢 Possibilidade de aumentar aporte em R$ 250.

---

# 31. Notificações

Criar:

- contas próximas do vencimento;
- faturas;
- orçamento excedido;
- gasto anormal;
- meta atrasada;
- saldo baixo;
- receita esperada;
- assinatura recorrente;
- possível duplicidade.

Não gerar excesso de notificações.

Implementar prioridade e agrupamento.

---

# 32. Finanças familiares

Criar conceito de `Household`.

Membros:

- administrador;
- cônjuge;
- dependentes;
- outros membros.

Suportar:

- contas individuais;
- contas compartilhadas;
- despesas individuais;
- despesas familiares.

Permitir alternar entre:

**Minhas finanças**

e

**Finanças da família**

---

# 33. Onboarding

Criar onboarding curto e inteligente.

Perguntas:

1. Qual sua renda?
2. Administra sozinho ou em família?
3. Quais contas possui?
4. Possui cartões?
5. Possui dívidas?
6. Possui investimentos?
7. Quais são seus objetivos?
8. Qual método de orçamento deseja utilizar?

Depois:

> Estamos preparando seu mapa financeiro.

Criar dashboard inicial automaticamente.

---

# 34. Importação

Preparar arquitetura para:

- CSV;
- OFX;
- Excel;
- Open Finance;
- APIs bancárias futuras.

A IA deve auxiliar na classificação das transações importadas.

---

# 35. Relatórios

Criar:

- receitas;
- despesas;
- fluxo de caixa;
- orçamento;
- cartões;
- patrimônio;
- investimentos;
- metas;
- evolução mensal;
- comparação anual.

Exportar:

- PDF;
- Excel;
- CSV.

---

# 36. Busca global

Permitir buscar:

- transações;
- categorias;
- contas;
- cartões;
- metas;
- relatórios;
- insights.

Preparar futuramente comandos naturais.

---

# 37. UX/UI

Criar interface:

- premium;
- minimalista;
- moderna;
- elegante;
- rápida;
- acessível;
- responsiva;
- mobile-first.

Referências conceituais:

- Nubank;
- Revolut;
- Monzo;
- N26;
- Apple;
- Linear;
- Notion;
- Stripe.

Não copiar nenhuma interface.

Criar identidade própria.

---

# 38. Design System

Criar tokens para:

- cores;
- tipografia;
- espaçamento;
- radius;
- sombras;
- ícones;
- componentes;
- estados.

Componentes:

- buttons;
- inputs;
- cards;
- modal;
- dropdown;
- tabs;
- tables;
- charts;
- toast;
- skeleton;
- empty state;
- error state.

Nenhum valor visual importante deve ficar espalhado pelo código.

---

# 39. Temas

Suportar:

- light;
- dark;
- system.

Preparar temas customizados.

---

# 40. Navegação

Desktop:

Sidebar.

Itens:

- Dashboard
- Transações
- Contas
- Cartões
- Orçamento
- Metas
- Patrimônio
- Investimentos
- Relatórios
- Financial AI
- Configurações

Mobile:

Bottom navigation para as funções principais.

---

# 41. Responsividade

Suportar:

- smartphone;
- tablet;
- notebook;
- desktop;
- monitores grandes.

Não simplesmente reduzir a interface desktop.

Projetar experiência mobile específica.

---

# 42. Microinterações

Utilizar:

- transições;
- skeleton loading;
- feedback;
- progress bars;
- animações de gráficos;
- confirmação visual;
- mudanças de saldo.

Animações devem ser sutis e não comprometer performance.

---

# 43. Modelo de dados

Entidades principais:

```text
User
Household
Member
Account
Transaction
Category
Subcategory
CreditCard
CreditCardInvoice
Installment
RecurringTransaction
Budget
BudgetCategory
Goal
Asset
Liability
Investment
Portfolio
Notification
FinancialInsight
AIConversation
AIMessage
Rule
Tag
Scenario
FinancialSnapshot
AuditLog
```

Criar relacionamentos adequados e constraints de integridade.

---

# 44. Arquitetura

Separar:

```text
Frontend
Backend
Database
Financial Engine
AI Layer
Authentication
Notification Service
Analytics
Integration Layer
```

A camada de IA deve ser desacoplada.

Criar abstração de LLM para permitir trocar:

- OpenAI;
- Anthropic;
- Google;
- modelos locais;
- outros provedores.

---

# 45. Stack sugerida

Frontend:

- React
- TypeScript
- Next.js ou Vite
- Tailwind CSS
- shadcn/ui
- Recharts ou equivalente

Backend:

- Python
- FastAPI

Database:

- PostgreSQL

ORM:

- SQLAlchemy

Authentication:

- JWT + refresh tokens

Infraestrutura:

- preparada para cloud;
- CI/CD;
- observabilidade;
- backups.

---

# 46. Qualidade

Aplicar:

- TypeScript strict;
- tipagem forte;
- SOLID;
- separação de responsabilidades;
- services;
- repositories;
- DTOs;
- validators;
- error handling;
- logging;
- migrations;
- configuração por ambiente.

Evitar:

- código duplicado;
- componentes gigantes;
- regra de negócio na UI;
- valores hardcoded;
- categorias hardcoded;
- dependência direta de um LLM.

---

# 47. Segurança

Implementar:

- autenticação;
- autorização;
- RBAC;
- proteção de dados;
- criptografia;
- sessões seguras;
- rate limiting;
- auditoria;
- backups;
- recuperação de conta;
- proteção contra acesso indevido.

Seguir LGPD e boas práticas de segurança.

---

# 48. Testes

Criar:

- unit tests;
- integration tests;
- API tests;
- component tests;
- E2E tests.

Priorizar testes para:

- saldo;
- transferências;
- parcelamentos;
- faturas;
- orçamento;
- fluxo de caixa;
- metas;
- patrimônio;
- simulações;
- permissões.

---

# 49. Dados seed

Criar ambiente demo com dados fictícios realistas.

Exemplo:

Usuário:

Max

Receita:

R$ 12.000

Contas:

- Nubank
- Itaú
- Carteira

Cartões:

- Nubank
- Visa

Metas:

- Reserva de emergência
- Viagem
- Carro

Criar histórico de vários meses para tornar gráficos e análises úteis.

---

# 50. EVOLUÇÃO DO DESENVOLVIMENTO

Esta seção é obrigatória.

O aplicativo deve ser desenvolvido incrementalmente.

**Não implementar todos os módulos simultaneamente.**

Cada fase deve produzir uma versão funcional.

---

## FASE 0 — Discovery e arquitetura

### Objetivo

Definir as bases antes de escrever grande quantidade de código.

### Entregáveis

- visão do produto;
- personas;
- casos de uso;
- mapa de funcionalidades;
- arquitetura;
- modelo de dados;
- Design System inicial;
- decisões tecnológicas;
- estratégia de IA;
- estratégia de segurança;
- estratégia de testes.

### Regra

Não iniciar desenvolvimento de funcionalidades complexas antes de validar a arquitetura.

---

# FASE 1 — Foundation

### Objetivo

Criar a fundação técnica.

Implementar:

- projeto frontend;
- projeto backend;
- PostgreSQL;
- migrations;
- autenticação;
- usuários;
- Household;
- membros;
- layout;
- navegação;
- Design System;
- temas;
- responsividade;
- tratamento global de erros.

### Resultado

Usuário consegue:

1. criar conta;
2. fazer login;
3. criar família;
4. acessar dashboard vazio;
5. configurar perfil.

---

# FASE 2 — Financial Core

### Objetivo

Criar o motor financeiro básico.

Implementar:

- contas;
- categorias;
- subcategorias;
- receitas;
- despesas;
- transferências;
- tags;
- filtros;
- busca;
- histórico.

### Resultado

O sistema já deve ser utilizável sem IA.

### Critério de conclusão

Os cálculos de saldo devem ser confiáveis e cobertos por testes.

---

# FASE 3 — Crédito e recorrência

### Implementar

- cartões;
- limite;
- fechamento;
- vencimento;
- faturas;
- parcelamentos;
- despesas recorrentes;
- assinaturas.

### Resultado

O usuário consegue controlar completamente seu cartão.

---

# FASE 4 — Planejamento financeiro

### Implementar

- orçamento;
- 50/30/20;
- orçamento personalizado;
- metas;
- fluxo de caixa;
- projeções;
- calendário financeiro.

### Resultado

O aplicativo deixa de ser apenas um controlador e começa a atuar como ferramenta de planejamento.

---

# FASE 5 — Dashboard inteligente

### Implementar

- patrimônio líquido;
- indicadores;
- gráficos;
- evolução mensal;
- comparação de períodos;
- Financial Health Score;
- widgets configuráveis.

### Resultado

O usuário consegue entender sua situação financeira rapidamente.

---

# FASE 6 — Analytics e inteligência financeira

### Implementar

Motor analítico independente do LLM.

Criar:

- detecção de anomalias;
- médias históricas;
- tendências;
- sazonalidade;
- projeção;
- comportamento;
- categorias problemáticas;
- indicadores.

### Resultado

O sistema consegue gerar insights financeiros de forma determinística.

---

# FASE 7 — IA assistiva

### Implementar

- chat;
- contexto financeiro;
- perguntas sobre dados;
- explicações;
- geração de insights;
- resumo financeiro.

Exemplos:

> Como está minha situação financeira?

> Onde estou gastando demais?

> Quanto posso gastar este mês?

### Regra

A IA deve consultar o Financial Engine.

Não acessar diretamente tabelas indiscriminadamente.

---

# FASE 8 — IA Agentic

Esta é uma evolução crítica.

Transformar a IA de assistente em agente capaz de executar tarefas.

Implementar:

- tool calling;
- criação de transações;
- alteração de orçamento;
- criação de metas;
- categorização;
- criação de regras;
- simulações;
- planejamento.

Fluxo:

```text
Usuário
↓
Intent
↓
Planejamento
↓
Tool
↓
Validação
↓
Confirmação
↓
Execução
↓
Auditoria
↓
Resposta
```

### Regra de segurança

Toda ação com impacto financeiro deve possuir confirmação quando houver risco de alteração indesejada.

---

# FASE 9 — Financial Copilot

Criar experiência realmente proativa.

A IA passa a acompanhar:

- orçamento;
- fluxo de caixa;
- metas;
- cartões;
- comportamento;
- patrimônio.

Exemplo:

> Seu mês está caminhando para um déficit de R$ 620. Existem duas ações que podem evitar isso.

Mostrar ações:

**Reduzir lazer em R$ 250**

**Reduzir compras em R$ 370**

Permitir executar diretamente após confirmação.

---

# FASE 10 — Simulações inteligentes

Permitir perguntar:

> Posso comprar um carro de R$ 90 mil?

A IA deve consultar o motor financeiro e calcular:

- impacto no fluxo;
- parcela;
- entrada;
- comprometimento da renda;
- impacto no orçamento;
- patrimônio;
- cenários.

Nunca responder apenas com opinião.

---

# FASE 11 — Patrimônio e investimentos

Implementar:

- ativos;
- passivos;
- investimentos;
- carteira;
- rentabilidade;
- dividendos;
- evolução patrimonial.

Preparar integração com dados externos.

---

# FASE 12 — Importação e automação

Implementar:

- CSV;
- OFX;
- Excel;
- categorização automática;
- regras;
- importação inteligente;
- deduplicação.

Depois preparar:

- Open Finance;
- integrações bancárias;
- sincronização automática.

---

# FASE 13 — Plataforma familiar

Expandir:

- múltiplos usuários;
- permissões;
- despesas compartilhadas;
- contas compartilhadas;
- responsabilidades;
- visões individuais;
- visão familiar.

---

# FASE 14 — Produto comercial

Preparar:

- onboarding premium;
- planos;
- feature flags;
- analytics de produto;
- métricas;
- billing;
- limites por plano;
- observabilidade;
- suporte;
- documentação.

---

# FASE 15 — Escala

Preparar:

- cache;
- filas;
- jobs assíncronos;
- processamento de eventos;
- observabilidade;
- métricas;
- logs centralizados;
- tracing;
- escalabilidade horizontal;
- backups;
- disaster recovery.

---

# 51. Priorização do desenvolvimento

Utilizar esta classificação:

### P0 — Essencial

Sem isso o produto não funciona.

### P1 — Alta prioridade

Entrega grande valor ao usuário.

### P2 — Evolução

Melhora significativamente a experiência.

### P3 — Futuro

Funcionalidade avançada.

Priorizar sempre:

**Confiabilidade > Usabilidade > Inteligência > Complexidade**

---

# 52. Definition of Done

Nenhuma funcionalidade deve ser considerada concluída apenas porque "a tela funciona".

Uma feature só está pronta quando:

- frontend implementado;
- backend implementado;
- banco implementado;
- validações implementadas;
- tratamento de erros;
- loading;
- empty state;
- responsividade;
- acessibilidade básica;
- testes;
- logs quando necessários;
- segurança;
- documentação;
- integração com o restante do sistema.

---

# 53. Desenvolvimento orientado a incrementos

Para cada funcionalidade:

1. definir objetivo;
2. definir regra de negócio;
3. definir modelo de dados;
4. criar migration;
5. criar backend;
6. criar testes;
7. criar API;
8. criar UI;
9. integrar;
10. testar fluxo completo;
11. revisar UX;
12. documentar;
13. somente então avançar.

Não construir dezenas de telas sem conectar ao backend.

---

# 54. Estratégia para IA

Separar claramente:

### Financial Engine

Responsável por:

- cálculos;
- saldos;
- projeções;
- orçamento;
- regras;
- validações.

### AI Layer

Responsável por:

- interpretação;
- linguagem natural;
- explicação;
- recomendação;
- priorização;
- interação.

### Tools

Responsáveis por conectar a IA ao sistema.

Essa separação é obrigatória.

---

# 55. Observabilidade da IA

Registrar:

- intenção;
- tool utilizada;
- parâmetros;
- resultado;
- tempo;
- erros;
- confirmação do usuário.

Não armazenar dados sensíveis desnecessariamente.

Criar métricas:

- taxa de sucesso;
- falhas;
- custo;
- latência;
- rejeição de recomendações;
- ações executadas;
- precisão das classificações.

---

# 56. Evolução futura da IA

Preparar arquitetura para:

### Nível 1

Chat financeiro.

### Nível 2

Insights automáticos.

### Nível 3

Tool calling.

### Nível 4

Agente financeiro.

### Nível 5

Agente financeiro proativo.

### Nível 6

Orquestração de múltiplos agentes.

Exemplo:

```text
Financial Agent
├── Budget Agent
├── Debt Agent
├── Goal Agent
├── Investment Agent
└── Cash Flow Agent
```

Não implementar múltiplos agentes prematuramente.

Só evoluir quando houver necessidade real.

---

# 57. Roadmap resumido

```text
FASE 0
Discovery + Arquitetura
        ↓
FASE 1
Foundation
        ↓
FASE 2
Financial Core
        ↓
FASE 3
Cartões + Parcelamentos
        ↓
FASE 4
Orçamento + Metas + Fluxo
        ↓
FASE 5
Dashboard + Health Score
        ↓
FASE 6
Analytics
        ↓
FASE 7
IA Assistiva
        ↓
FASE 8
IA Agentic
        ↓
FASE 9
Financial Copilot
        ↓
FASE 10
Simulações
        ↓
FASE 11
Patrimônio + Investimentos
        ↓
FASE 12
Importação + Open Finance
        ↓
FASE 13
Família
        ↓
FASE 14
Produto Comercial
        ↓
FASE 15
Escala
```

---

# 58. Regra para ferramentas de desenvolvimento com IA

Se este prompt for utilizado em uma ferramenta de geração de código por IA:

**Não gerar todo o projeto de uma única vez.**

A IA deve trabalhar por fases.

Antes de cada fase:

1. analisar o estado atual;
2. identificar o que já existe;
3. não recriar funcionalidades existentes;
4. preservar compatibilidade;
5. verificar arquitetura;
6. implementar apenas o escopo da fase;
7. executar testes;
8. corrigir regressões;
9. atualizar documentação;
10. apresentar resumo das alterações.

Nunca sobrescrever código existente sem necessidade.

---

# 59. Prompt operacional para cada sprint

Para cada sprint, seguir:

```text
Analise o estado atual do projeto.

Não recrie funcionalidades que já existem.

Identifique a arquitetura utilizada e siga os padrões existentes.

Implemente somente as funcionalidades definidas para esta etapa.

Antes de codificar:
- analise os modelos existentes;
- analise APIs existentes;
- analise componentes existentes;
- analise regras de negócio;
- identifique possíveis impactos.

Depois:
- implemente;
- teste;
- corrija;
- valide responsividade;
- valide segurança;
- valide integração;
- atualize documentação.

Não introduza dependências sem justificar.

Não coloque regras financeiras no frontend.

Não coloque dados fictícios no código de produção.

Não utilize valores hardcoded quando eles puderem ser parametrizados.

Ao final, apresente:
1. funcionalidades implementadas;
2. arquivos criados;
3. arquivos alterados;
4. migrations;
5. APIs;
6. testes;
7. problemas encontrados;
8. próximos passos.
```

---

# 60. Resultado final esperado

O produto final deve parecer uma fintech moderna, mas com identidade própria.

A experiência deve transmitir:

- confiança;
- inteligência;
- simplicidade;
- controle;
- segurança;
- modernidade.

O usuário não deve sentir que está preenchendo uma planilha.

Ele deve sentir que possui um **assistente financeiro pessoal que entende sua vida financeira**.

O produto final deve evoluir de:

> "Onde foi parar meu dinheiro?"

para:

> "O que está acontecendo com minhas finanças?"

e finalmente para:

> "O que devo fazer agora?"

Esse é o objetivo central do aplicativo.
