# 📝 Requisitos do Sistema · E-commerce Transacional (Night Owl)

Este documento descreve as regras de negócio, fluxos transacionais e os mecanismos de segurança contra fraudes e cobranças duplicadas que governam o ecossistema.

---

## 🎨 Indentidade Visual e Atmosfera Magnética

### 1. Estética | Midnight Noir Premium

- **Paleta de Cores:** A interface deve adotar um tema predominantemente escuro envolvente. A cor de fundo será baseada em tons de azul da meia-noite profundo (`Midnight Blue/Dark Slate`), criando uma atmosfera misteriosa e luxuosa.
- **Pontos de Destaque (Focal Points):** Os botões de ação principal (como "Adicionar ao Carrinho" e "Finalizar Compra") e os estados reativos de clique usarão tons de azul-ciano elétrico ou roxo místico em neón de alto contraste, guiando o olhar do usuário e gerando alta atração visual.

### 2. Ergonomia Visual e Conforto Ocular (Anti-Fatigue Design)

- **Mitigação de Contraste Extremo:** Fica estritamente proibido o uso de preto absoluto (#000000) para fundos e branco puro (#FFFFFF) para textos longos.
- **Implementação Ergonômica:** A interface utilizará fundos em azul-escuro amaciado com saturação controlada, combinados com tipografia em tons de cinza-claro azulado (Off-White). Essa fiação de cores reduz a fadiga ocular em ambientes de baixa luminosidade, otimizando o tempo de permanência do usuário na plataforma.

---

## 🛑 Regras de Negócio e Segurança Financeira (Checkout Domain)

### 1. Bloqueio de Cliques Múltiplos (Idempotência Financeira)

- **Camada de Apresentação (Presentation Layer):** O botão de checkout integrado ao Zustand deve aplicar uma trava de estado `disabled` imediatamente após o primeiro evento de clique. A interface deve exibir um feedback visual de carregamento ("Processando...") para mitigar a ansiedade do usuário sob conexões de alta latência, impedindo cliques duplicados por erro do cliente.
- **Camada de Infraestrutura (Stripe SDK Core):** Toda criação de sessão de checkout para a API do Stripe deve obrigatoriamente enviar um cabeçalho `Idempotency-Key` único, derivado do hash estrutural do carrinho (`cart-store` ID). Caso uma requisição duplicada atinja os servidores do Stripe por oscilação de rede, a API interceptará o evento e evitará uma cobrança dupla.

### 2. Validação Rígida de Preços contra Fraudes

- **Governança de Catálogo:** O microsserviço no Next.js consultará os preços oficiais direto na base de dados (Prisma) ou na API de origem para remontar o cálculo do preço final no servidor. O sistema rejeitará qualquer tentativa de injeção de preços customizados pelo client-side.

---

# 📝 System Requirements · Transactional E-commerce (Night Owl) - English Version

This document outlines the business rules, transactional flows, and security mechanisms against fraude and duplicate charges that govern the ecosystem.

---

## 🎨 Visual Identity and Magnetic Atmosphere

### 1. Aesthetic | Midnight Noir Premium

- **Color Palette:** The interface must adopt an immersive, predominantly dark theme. The background color will be based on deep midnight blue tones (`Midnight Blue/Dark Slate`), creating a mysterious and luxurius atmosphere.
- **Focal Points:** Primary action buttons (such as "Add to Cart" and "Checkout") and reactive click states will use high-contrast electric cyan or mystical neon purple tones, guiding the user-s gaze and generating strong visual appeal.

### 2. Visual Ergonomics and Eye Confort (Anti-Fatigue Design)

- **Extreme Contrast Mitigation:** The use of absolute black (#000000) for backgrounds and pure white (#FFFFFF) for long-form text is strictly prohibited.
- **Ergonomic Implementation:** The interface will employ softened dark blue backgrounds with controlled saturation, paired with typography in bluish light-gray tones (Off-White). This color scheme reduces eye strain in low-light environments, optimizing the time users spend on the platform.

---

## 🛑 Business Rules and Financial Security (Checkout Domain)

### 1. Multiple Click Prevention (Financial Idempotency)

- **Presentation Layer:** The checkout button (integrated with Zustand) must apply a `disabled` state lock immediately after the initial click event. The interface must display visual loading feedback ("Processing...") to mitigate user anxiety during high-latency connections, preventing duplicate clicks caused by customer error.
- **Infrastructure Layer (Stripe SDK Core):** Every checkout session creation for the Stripe API must include a unique `Idempotency-Key` header, derived from the cart's structural hash (`cart-store` ID). If a duplicate request reaches Stripe's servers due to network instability, the API will intercept the event and prevent a double charge.

### 2. Strict Price Validation to Prevent Fraud

- **Catalog Governance:** The Next.js microservice will query official prices directly from the database (Prisma) or the souce API to recalculate the final price on the server. The system will reject any attempt to inject custom prices from the client side.
