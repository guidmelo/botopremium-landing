# BotoPremium — Landing Page Premium

Landing page cinematográfica e ultra premium para captação de leads qualificados da BotoPremium, desenvolvida com Next.js 15, Three.js, Framer Motion e integração Google Sheets.

---

## Stack Tecnológica

| Tecnologia | Uso |
|---|---|
| Next.js 15 | Framework React com App Router |
| React 19 | Componentes e hooks |
| TypeScript | Tipagem estática |
| TailwindCSS | Estilização utility-first |
| Framer Motion | Animações declarativas |
| GSAP + ScrollTrigger | Animações de scroll premium |
| Lenis | Smooth scroll de alta qualidade |
| Three.js + R3F | Cena 3D (partículas hero) |
| Google Sheets API | Integração de leads server-side |

---

## Estrutura do Projeto

```
botopremium-landing/
├── app/
│   ├── layout.tsx          # Layout global + analytics + SEO
│   ├── page.tsx            # Página principal
│   ├── globals.css         # Sistema de design
│   └── api/leads/route.ts  # API segura para Google Sheets
├── sections/               # Hero, Authority, Procedures, Experience, Testimonials, LeadForm
├── components/             # UI + Layout components
├── hooks/                  # useSmoothScroll, useCounter, useMagneticEffect
├── animations/             # Sistema de variantes Framer Motion
├── lib/                    # Google Sheets integration
├── services/               # Serviço de envio de leads
├── utils/                  # Validação e sanitização
└── types/                  # Tipagem TypeScript global
```

---

## Configuração

### 1. Clonar e instalar

```bash
git clone https://github.com/seu-usuario/botopremium-landing.git
cd botopremium-landing
npm install
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### 3. Google Sheets

1. Ative a **Google Sheets API** no Google Cloud Console
2. Crie uma **Service Account** e baixe o JSON de credenciais
3. Compartilhe a planilha com o e-mail da Service Account (Editor)
4. A aba deve se chamar **"Leads"** com cabeçalhos:
   `Timestamp | Nome | WhatsApp | Bairro | Objetivo | Origem | Dispositivo | UTM Source | UTM Medium | UTM Campaign | Página`

### 4. Desenvolvimento

```bash
npm run dev
# Acesse http://localhost:3000
```

---

## Deploy na Vercel

```bash
npm i -g vercel
vercel
```

Ou importe o repositório no [dashboard da Vercel](https://vercel.com) e configure as variáveis de ambiente.

---

## Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| `obsidian` | `#050505` | Fundo principal |
| `graphite` | `#1A1A1A` | Fundo secundário |
| `champagne` | `#D6BE8A` | Cor primária |
| `gold` | `#C6A769` | Dourado |
| `warm-white` | `#F7F4EF` | Texto |

---

## Licença

Desenvolvido exclusivamente para BotoPremium. Todos os direitos reservados.
