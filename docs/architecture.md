# 🏗️ Arquitetura de Software · Night Owl E-Commerce

Este documento especifica a topologia arquitetural, divisões de contexto e o fluxo entre o client-side e as rotas seguras do servidor.

---

## 🗺️ Divisão de Fluxos e Fronteiras de Contexto

O ecossistema divide-se em duas grandes zonas com níveis de isolamento distintos:

### 1. Fluxo de Navegação Pública e Catálogo (Public Content Layer)

- **Consumo Assíncrono:** As páginas do catálogo de produtos buscam dados de forma reativa da API do DummyJSON.
- **Conforto e Performance:** A renderização utiliza componentes estilizados com a paleta ergonômica em tons de azul da meia-noite. Enquanto os dados são carregados, a interface exibe componentes do tipo `Skeleton` para evitar quebras visuais e saltos na tela.

### 2. Fluxo Seguro de Checkout e Transações (Protected Checkout Layer)

- **Persistência Local:** O carrinho de compras é gerenciado de forma global na camada `Presentation` via **Zustand**, utilizando o middleware `persist` sincronizado com o `LocalStorage` do navegador de forma higienizada.
- **Ponte Criptográfica (Stripe Bridge):** Ao acionar o checkout, a rota de API `/api/checkout` intercepta os dados, valida os valores de forma estrita no servidor via Prisma para coibir fraudes, e despacha o usuário para o ambiente seguro do Stripe com chaves de idempotência ativas.

### 3. Camada de Dados Transacionais e Pós-Compra (Prisma 7 & Supabase Infrastructure)

- **Integridade Referencial Histórica**: A tabela `OrderItem` (Itens do Pedido) armazena cópias estáticas e congeladas de propriedades voláteis (`price`, `title`, `thumbnail`). Isso impede que futuras alterações de preço ou imagem no catálogo principal alterem o histórico de compras retroativamente do cliente, garantindo auditoria limpa.
- **Server Actions Transacionais (`"use server"`)**: Toda a lógica de escrita e modificação de estados do banco (`createOrder`, `updateOrderStatus`) é executada exclusivamente na camada do servidor via Next.js Server Actions encapsulada em blocos `prisma.$transaction`.
- **Estratégia de Invalidação de Cache**: Utilização do método nativo `revalidatePath("/profile")` no servidor em conjunto com `route.refresh()` no cliente purgar o _Router Cache_ do Next.js App Router, forçando a UI a renderizar dados atualizados do PostgreSQL em tempo real e de forma segura.

---

# 🏗️ Software Architecture · Night Owl E-Commerce - English Version

This document outlines the architectural topology, context boundaries, and the data flow between the client-side and secure server router.

---

## 🗺️ Flow Segmentation and Contect Boundaries

The ecosystem is divided into two major zones with distinct levels of isolation:

### 1. Public Browsing and Catalog Flow (Public Context Layer)

- **Asynchronous Data Fetching:** Product catalog pages reactively fetch data from the DummyJSON API.
- **User Experience & Performance:** Rendering utilizes styled components featuring an ergonomic "midnignt blue" color palette. While data loads, the interface displays `Skeleton` components to prevent visual layouts shifts or "jank".

### 2. Secure Checkout and Transaction Flow (Protected Checkout Layer)

- **Local Persistence:** The shopping cart is managed globally within the `Presentation` layer using **Zustand**, leveraging the `persist` middleware to synchronize with the browser's `LocalStorage` is a sanitized manner.
- **Cryptographic Bridge (Stripe Bridge):** Upon initiating checkout, the `/api/checkout` API route intercepts the data, strictly validates values on the server via Prisma to prevent fraud, and redirects the user to the secure Stripe environment with active idempotency keys.

### 3. Transactional Data and Post-Purchase Layer (Prisma 7 & Supabase Infrastructure)

- **Historical Referential Integrity**: The `OrderItem` table stores static, frozen copies of volatile properties (`price`, `title`, `thumbnail`). This prevents future price or image changes in the main catalog from altering the customer's retroactive purchase history, ensuring clean audit logs.
- **Transactional Server Actions (`"use server"`)**: All database write and state modification logic (`createOrder`, `updateOrderStatus`) is executed exclusively on the server layer via Next.js Server Actions encapsulated within `prisma.$transaction` blocks.
- **Cache Revalidation Strategy**: Employs the native `revalidatePath("/profile")` method on the server along with client-side `router.refresh()` to purge the Next.js App Router _Router Cache_, forcing the UI to safely render updated PostgreSQL data in real time.
