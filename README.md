# Night Owl Store - High-Performance Transational E-commerce

![Next.js](https://img.shields.io/badge/Next.js-14-blue?style=flat-square)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
![Zustand](https://img.shields.io/badge/Zustand-v5-purple?style=flat-square)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com/)
![Tests](https://img.shields.io/badge/tests-Jest%20%7C%20Playwright-green?style=flat-square)
![CI](https://img.shields.io/github/actions/workflow/status/franferrazdev/live-coding-bug-quiz/ci.yml?style=flat-square&label=CI%2FCD)

## 🇧🇷 Versão em Português

Plataforma completa de e-commerce transacional de alta performance desenvolvida com Next.js 16, React 19 e Tailwind CSS v4. O projeto adota princípios rigorosos de Clean Architecture, gerenciamento de estado atomizado com Zustand, proteção de rotas privadas via Edge Middlewares e integração assíncrona com o gateway de pagamentos Stripe Sandbox, utilizando persistência relacional no PostgreSQL via Prisma ORM.

## 🔗 Demonstração em Tempo Real / Live Demo

👉 **Acesse o sistema no ar:** [Night Owl E-commerce](https://night-owl-ecommerce.vercel.app/)

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para clonar e rodar a plataforma de e-commerce em sua máquina de desenvolvimento:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/franferrazdev/night-owl-ecommerce.git
   cd night-owl-ecommerce
   ```

2. **Instale as dependências:**

   ```bash
   pnpm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example` e insira suas credenciais secretas do Stripe Sandbox e as strings de conexão do banco de dados (Supabase/PostgreSQL).

4. **Sincronize e Configure o Banco de Dados:**
   Execute as migrações do Prisma para estruturar as tabelas relacionais de histórico de pedidos no seu banco de dados:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Inicie o servidor de desenvolvimento:**

   ```bash
   pnpm dev
   ```

   Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

6. **Execução de Testes Automatizados:**
   - **Testes Unitários e de Integração (Jest):** `pnpm test`

---

### 📸 Galeria de Telas e Demonstrações Animadas (UI/UX)

As demonstrações e capturas abaixo ilustram o ecossistema completo em tempo de execução:

#### 1. Catálogo Principal, Vitrine Global e Sliders Interativos

https://github.com/user-attachments/assets/bed9feff-40ff-43e8-8ee2-8edf53db3b6b

#### 2. Carrinho Lateral Atomizado (Zustand Core Store)

![Gerenciamento de Fluxo do Carrinho](public/readme-gallery/02-cart-drawer.png)

#### 3. Página do Formulário de Pedidos (Checkout Dinâmico)

![Estrutura de Faturamento de Pedidos](public/readme-gallery/03-order-page.png)

#### 4. Gateway de Pagamento Seguro Hospedado (Stripe Sandbox)

![Ambiente Criptografado Adquirente Stripe](public/readme-gallery/04-stripe-checkout.png)

#### 5. Configuração de Sucesso Transacional e Automação de Rastreamento

https://github.com/user-attachments/assets/a33c0642-7fef-49ae-9a2b-95b16bfe03f0

#### 6. Histórico de Pedidos e Área do Cliente

![Histórico Logístico Atômico no Perfil](public/readme-gallery/06-profile-history.png)

## 🌌 Funcionalidades Adicionadas

- **🤖 Máquina de Estados Logística (Sandbox)**: Simulação de barramento logístico automatizado em background que responde reativamente a portões de UX (_UX Gates_) destravando botões sequenciais e formulários locais de avaliação na página de sucesso.
- **📋 Histórico Atômico de Compras (Perfil)**: Painel de perfil integrado ao Supabase via Prisma que carrega dinamicamente fotos (thumbnails), contadores de quantidade e links cruzados estáveis para as páginas internas do catálogo.
- **🔒 Trava Antirrepetição de Rastreamento**: Protocolo baseado em chaves de sessão que bloqueia a reexecução de timers e revalida de forma rígida o cache do servidor ao navegar de volta para o perfil.

## 🧪 Ambiente de Homologação (Guia de Testes para Recrutadores)

Para validar o fluxo de faturamento Full-Stack sem a necessidade de inserir dados reais, utilize as credenciais de simulação fornecidas pela Stripe diretamente na janela criptografada do checkout seguro:

- **Número do Cartão:** `4242 4242 4242 4242`
- **Validade (MM/AA):** Qualquer data futura (Ex.: `12/31`)
- **CVC / CVV:** Qualquer combinação de 3 dígitos (Ex.: `123`)
- **Preenchimento de E-mail:** Injetado automaticamente de forma dinâmica com base no perfil logado.
- **Carteiras Digitais:** O gateway está homologado para aceitar aprovação rápida com 1 clique via Apple Pay e Google Pay.

## 🛠️ Tecnologias e Infraestrutura

- **Framework:** Next.js 16 (App Router) com React 19 (Server e Client Components)
- **Estilização:** Tailwind CSS v4 com suporte nativo a temas dinâmicos (Light/Dark Mode)
- **Gerenciamento de Estado:** Zustand com persistência local em LocalStorage (Cart e Wishlist Stores)
- **Segurança e Criptografia:** Autenticação Client-side utilizando Web Crypto API (SHA-256 Hashes) e Edge Middlewares
- **Banco de Dados & ORM:** Prisma ORM integrado com PostgreSQL hospedado na AWS (via Supabase Connection Pooler)
- **Ícones:** Lucide React v1.47.0

### 📂 Arquitetura de Pastas (Clean Architecture)

```text
src/
├── app/    # Roteamento físico (Next.js App Router) e endpoints de API públicos
├── modules/
    ├── checkout/
        ├── domain/  #Entidades puras de negócios e casos de uso isolados
        ├── infra/  # Gateways (Stripe-Config) e ORM (Prisma-Client)
        ├── presentation/   # Componentes de interface do usuário, stores locais e estilos visuais
    ├── profile/
        ├── infra/  # Server Actions assíncronas para busca de faturamento
```

---

## 🧠 Desafios e Aprendizados

O desenvolvimento deste ecossistema completo de e-commerce transacional consolidou competências avançadas em arquitetura de software e segurança cibernética [1.16]:

- **Criptografia na Borda via Web Crypto API:** Implementar autenticação no Client-side utilizando hashes SHA-256 e acoplá-los a Edge Middlewares exigiu o domínio de manipulação de fluxos seguros de sessão, mitigando vulnerabilidades sem adicionar latência de rede na renderização [1.16].
- **Resiliência e Anti-Fraude no Stripe Sandbox:** Estruturar a validação de checkouts criptografados integrados ao gateway seguro demandou a criação de uma trava antirrepetição baseada em chaves de sessão temporárias [1.16]. Isso impede a duplicação de faturamentos e garante a consistência atômica dos pedidos mesmo em cenários de oscilação de rede [1.16].
- **Arquitetura Desacoplada com Zustand v5:** Gerenciar o estado dinâmico do carrinho de compras e da lista de desejos através de uma máquina de estados atômica persistida localmente (LocalStorage) eliminou gargalos de re-renderização comuns em contextos reativos, otimizando drasticamente os frames de animação do layout [1.16].

---

### 📝 Licença e Direitos Autorais

AMbiente Sandbox desenvolvido e homologado integralmente por **Francielle Ferraz**. Todos os direitos de propriedade intelectual reservados.

---

## 🇺🇸 English Version

A complete high-performance transactional e-commerce platform built with Next.js 16, React 19, and Tailwind CSS v4. The project strictly adopts Clean Architecture principles, atomized state management with Zustand, private route protection via Edge Middlewares, and dynamic integration with the Stripe Sandbox payment gateway, utilizing relational persistence on PostgreSQL via Prisma ORM.

## 🔗 Live Demo

👉 **Access the system online:** [Night Owl E-commerce](https://night-owl-ecommerce.vercel.app/)

## 🚀 How to Run Locally

Follow the standard setup to clone and run the e-commerce platform locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/franferrazdev/night-owl-ecommerce.git
   cd night-owl-ecommerce
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Set up your `.env` file using `.env.example` as a template, adding your Stripe Sandbox and Supabase/PostgreSQL credentials.

4. **Sync and Configure the Database:**
   Run Prisma migrations:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server:**

   ```bash
   pnpm dev
   ```

   Access [http://localhost:3000](http://localhost:3000) in your browser.

6. **Run Tests:**
   - **Jest:** `pnpm test`

---

### 📸 Interface Gallery and Animated Demonstrations (UI/UX)

The captures and video animations below illustrate the complete ecosystem at runtime:

#### 1. Main Catalog, Global Showcase, and Interactive Sliders

https://github.com/user-attachments/assets/bed9feff-40ff-43e8-8ee2-8edf53db3b6b

#### 2. Atomized Cart Drawer (Zustand Core Store)

![Cart Flow Management](public/readme-gallery/02-cart-drawer.png)

#### 3. Order Form Page (Dynamic Checkout)

![Order Billing Structure](public/readme-gallery/03-order-page.png)

#### 4. Hosted Secure Payment Gateway (Stripe Sandbox)

![Stripe Acquiring Encrypted Environment](public/readme-gallery/04-stripe-checkout.png)

#### 5. Transactional Success Confirmation and Tracking Automation

https://github.com/user-attachments/assets/a33c0642-7fef-49ae-9a2b-95b16bfe03f0

#### 6. Order History and Client Profile Area

![Atomic Logistic History on Profile](public/readme-gallery/06-profile-history.png)

## 🌌 Features Added

- **🤖 Logistical State Machine (Sandbox)**: Simulated automated background logistical pipeline responding reactively to UX Gates, onlocking sequential buttons and local feedback rating forms on the success page.
- **📋 Atomic Purchase History (Profile)**: Profile panel integrated with Supabase via Prisma that dynamically loads item thumbnail, quantity counters, and stable cross-links to catalog detail pages.
- **🔒 Anti-Repetition Tracking Lock**: Session-key protocol that blocks timer re-runs and tightly revalidates server cache when navigating back to the user account profile.

### 🧪 Sandbox Environment (Recruiter Testing Guide)

To validate the Full-Stack billing flow without inserting real data, use the global simulation credentials provided by Stripe directly inside the encrypted secure checkout window:

- **Card Number:** `4242 4242 4242 4242`
- **Expiration (MM/YY):** Any future date (e.g., `12/31`)
- **CVC / CVV:** Any 3-digit combination (e.g., `123`)
- **Email Autofill:** Automatically injected based on the logged-in user profile.
- **Digital Wallets:** Certified to accept quick 1-click approval via Apple Pay and Google Pay.

### 🛠️ Technologies & Infrastructure

- **Framework:** Next.js 16 (App Router) & React 19 (Server/Client Components)
- **Styling:** Tailwind CSS v4 with native dynamic themes support (Light/Dark Mode)
- **State Management:** Zustand with local storage persistence (Cart & Wishlist Stores)
- **Security:** Client-side authentication using Web Crypto API (SHA-256 Hashes) & Edge Middlewares
- **Database & ORM:** Prisma ORM integrated with PostgreSQL hosted on AWS (via Supabase Connection Pooler)
- **Hosting & Deployment:** Vercel Edge Network
- **Icons:** Lucide React v1.47.0

### 📂 Directory Structure (Clean Architecture)

```text
src/
├── app/                  # Physical routing and public API endpoints
├── modules/
    ├── checkout/
        ├── domain/       # Pure business entities and isolated use cases
        ├── infra/        # Infrastructure gateways (Stripe-Config) and ORM (Prisma-Client)
        ├── presentation/ # UI Components, local stores, and visual styles
    ├── profile/
        ├── infra/  # Asynchronous Server Actions for billing retrieval
```

---

## 🧠 Technical Challenges and Learnings

Building a high-performance transactional e-commerce platform solidified deep client-side security and micro-state management architectural principles [1.16]:

- **Edge Cryptography via Web Crypto API:** Engineering secure client-side authentication pipelines utilizing SHA-256 hashing modules forced a strict mastery of crypto session tokens tied directly to Next.js edge-level middlewares, securing path routing without degrading web vitals performance [1.16].
- **Transactional Safety with Stripe Sandbox:** Interfacing the secure hosted adquirente checkout structure required a specialized anti-repetition session-key protocol [1.16]. This layer locks double-execution billing traps and tightly guarantees database atomic relational integrity across continuous web requests [1.16].
- **Decoupled Architecture with Zustand v5:** Modeling the dynamic catalog basket and global wishlist states with standalone, persistent stores (bound to LocalStorage) decoupled rendering frames completely from higher-level component layouts, eliminating unexpected UI lag during heavy catalog filtering [1.16].

---

### 📝 License & Copyright

Sandbox environment developed and fully certified by **Francielle Ferraz**. All intellectual property rights reserved.
