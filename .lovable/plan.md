

## Plano: Página de Segmentação (Funil) + Otimização de Rotas

### Estrutura do Funil

```text
/ (Splash de Segmentação)
├── "Galpão a partir de 1.000 m²" → /galpao-logistico?porte=medio
└── "Galpão a partir de 3.000 m²" → /galpao-logistico?porte=grande
    
/galpao-logistico (Landing Page focada em galpão logístico)
    → Hero segmentado pelo porte escolhido
    → Seções: Diferenciais, Soluções, Projetos, Depoimentos, Calculadora, Footer

/institucional (Site institucional completo - atual Index)
    → Link discreto na splash e no footer da landing

/simulador (Simulador 3D - mantém como está)
```

### Arquivos a Criar/Modificar

**1. `src/pages/Splash.tsx` (NOVO)** — Página de entrada do funil
- Tela cheia, fundo escuro com imagem de galpão, logo Almeida Engenharia
- Headline: "Qual o porte do galpão que você precisa?"
- Dois cards grandes lado a lado (responsivos, empilham no mobile):
  - **Card 1**: ícone de warehouse, "A partir de 1.000 m²", subtítulo "Operações médias e centros de distribuição", navega para `/galpao-logistico?porte=medio`
  - **Card 2**: ícone maior, "A partir de 3.000 m²", subtítulo "Grandes centros logísticos e industriais", navega para `/galpao-logistico?porte=grande`
- Link discreto no rodapé: "Conheça a Almeida Engenharia →" apontando para `/institucional`

**2. `src/pages/GalpaoLogistico.tsx` (NOVO)** — Landing page focada
- Lê query param `porte` (medio/grande) para personalizar conteúdo
- **Hero**: headline muda conforme porte selecionado
  - Médio: "Galpões Logísticos de 1.000 a 3.000 m² — Entrega em até 45 dias"
  - Grande: "Galpões Logísticos acima de 3.000 m² — Projetos de Grande Porte"
- Reutiliza componentes existentes: Differentials, Solutions (filtrado para logística), ProjectGallery, Testimonials
- Calculator com slider pré-configurado conforme porte (min 1000 ou 3000)
- Navbar simplificada com link "Sobre a Empresa" → `/institucional`
- CTA flutuante: "Falar com Engenheiro" (WhatsApp)

**3. `src/pages/Index.tsx`** — Redireciona para Splash
- Muda o conteúdo de Index para renderizar a Splash

**4. `src/pages/Institucional.tsx` (NOVO)** — Site institucional atual
- Move o conteúdo atual de Index (Navbar, Hero, About, Differentials, Solutions, etc.) para esta rota

**5. `src/App.tsx`** — Novas rotas
- `/` → Splash
- `/galpao-logistico` → GalpaoLogistico
- `/institucional` → Institucional
- `/simulador` → Simulator (mantém)

### Otimizações Adicionais

- **Calculator**: aceitar prop `minArea` para pré-configurar o slider (1000 ou 3000) conforme o porte
- **Navbar da landing**: versão simplificada com scroll-to interno + link para institucional
- **Footer**: adicionar link "Ver todos os serviços → /institucional"
- **Splash → localStorage**: salvar porte escolhido para usar no simulador como default

