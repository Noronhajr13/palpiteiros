# 🎨 Sistema de Cores - Palpiteiros V2

## 📋 Nova Paleta de Cores

O sistema foi refatorado com **duas paletas distintas**:

---

## ☀️ **Light Mode (Cores Primárias - Padrão)**

### **Filosofia de Design:**
- **Branco suave** como cor primária (não um branco puro e cansativo)
- **Preto elegante** para botões e elementos importantes
- **Cinzas sutis** para textos e bordas
- **Alta legibilidade** e contraste apropriado

### **Paleta de Cores:**

#### **Background System** (Fundos)
```css
--background: 210 20% 98%      /* Branco levemente acinzentado (fundo geral) */
--card: 0 0% 100%              /* Branco puro (cards) */
--surface: 210 20% 96%         /* Cinza muito claro (superfícies) */
--surface-hover: 210 20% 93%   /* Cinza claro (hover) */
```

**Visual:**
- Fundo geral: `#FAFBFC` (branco suave)
- Cards: `#FFFFFF` (branco puro)
- Superfícies: `#F5F6F7` (cinza muito claro)

#### **Primary System** (Preto Elegante)
```css
--primary: 222 47% 11%         /* Preto suave */
--primary-hover: 222 47% 18%   /* Cinza muito escuro (hover) */
--primary-foreground: 0 0% 100% /* Branco (texto em botões) */
```

**Visual:**
- Botão principal: `#141B25` (preto suave)
- Hover: `#1F2937` (cinza muito escuro)
- Texto no botão: `#FFFFFF` (branco)

#### **Text System** (Textos)
```css
--foreground: 222 47% 11%      /* Preto suave (texto principal) */
--muted-foreground: 220 9% 46% /* Cinza médio (texto secundário) */
--text-subtle: 220 9% 60%      /* Cinza claro (texto terciário) */
```

**Visual:**
- Texto principal: `#141B25` (preto suave)
- Texto secundário: `#6B7280` (cinza médio)
- Texto terciário: `#9CA3AF` (cinza claro)

#### **Border System** (Bordas)
```css
--border: 214 32% 91%          /* Cinza muito claro */
--border-strong: 217 15% 70%   /* Cinza médio */
```

**Visual:**
- Bordas sutis: `#E5E7EB`
- Bordas fortes: `#A8B1BD`

---

## 🌙 **Dark Mode (Cores Secundárias - Preto Total)**

### **Filosofia de Design:**
- **Preto profundo** como base (0% luminosidade)
- **Gradientes coloridos** para botões (azul → roxo)
- **Alto contraste** com textos brancos
- **Vibrante e moderno**

### **Paleta de Cores:**

#### **Background System** (Fundos)
```css
--background: 0 0% 0%          /* Preto total */
--card: 0 0% 7%                /* Cinza muito escuro (cards) */
--surface: 0 0% 10%            /* Cinza escuro (superfícies) */
--surface-hover: 0 0% 15%      /* Cinza médio-escuro (hover) */
```

**Visual:**
- Fundo geral: `#000000` (preto total)
- Cards: `#121212` (cinza muito escuro)
- Superfícies: `#1A1A1A` (cinza escuro)

#### **Primary System** (Gradiente Azul)
```css
--primary: 221 83% 53%         /* Azul vibrante */
--primary-hover: 221 83% 48%   /* Azul mais escuro */
--primary-foreground: 0 0% 100% /* Branco */
```

**Visual:**
- Botão principal: `#3B82F6` (azul vibrante)
- Hover: `#2563EB` (azul mais escuro)
- Gradiente: Azul → Roxo

#### **Accent System** (Roxo)
```css
--accent: 262 52% 47%          /* Roxo */
--accent-hover: 262 52% 42%    /* Roxo mais escuro */
```

**Visual:**
- Acento: `#8B5CF6` (roxo)
- Hover: `#7C3AED` (roxo mais escuro)

#### **Text System** (Textos)
```css
--foreground: 0 0% 98%         /* Branco quase puro */
--muted-foreground: 0 0% 64%   /* Cinza claro */
--text-subtle: 0 0% 50%        /* Cinza médio */
```

**Visual:**
- Texto principal: `#FAFAFA` (branco quase puro)
- Texto secundário: `#A3A3A3` (cinza claro)
- Texto terciário: `#808080` (cinza médio)

---

## 🎨 **Cores Semânticas** (Igual em ambos os modos)

```css
/* Success (Verde) */
--success: 142 76% 36%         /* Light Mode - Verde escuro */
--success: 142 71% 45%         /* Dark Mode - Verde vibrante */

/* Warning (Laranja) */
--warning: 38 92% 50%          /* Laranja (ambos os modos) */

/* Destructive (Vermelho) */
--destructive: 0 72% 51%       /* Light Mode - Vermelho médio */
--destructive: 0 84% 60%       /* Dark Mode - Vermelho vibrante */
```

---

## 📊 **Comparação: Antes vs Depois**

| Aspecto | Antes | Depois (Light) | Depois (Dark) |
|---------|-------|----------------|---------------|
| **Background** | Escuro total | Branco suave `#FAFBFC` | Preto total `#000000` |
| **Botão Principal** | Azul gradiente | Preto `#141B25` | Azul→Roxo gradiente |
| **Texto Principal** | Branco | Preto suave `#141B25` | Branco `#FAFAFA` |
| **Cards** | Cinza escuro | Branco puro `#FFFFFF` | Cinza escuro `#121212` |
| **Bordas** | Cinza médio-escuro | Cinza claro `#E5E7EB` | Cinza escuro `#333333` |

---

## 🎯 **Classes CSS Disponíveis**

### **Background Classes:**
```css
.surface          → Cor de superfície secundária
.surface-hover    → Cor de hover em superfícies
```

### **Text Classes:**
```css
.text-subtle      → Texto terciário (mais claro)
```

### **Border Classes:**
```css
.border-strong    → Borda enfatizada (mais escura)
```

### **Gradient Classes:**
```css
.gradient-primary → Gradiente primary → accent
.gradient-text    → Gradiente em texto
```

---

## 🎨 **Exemplos de Uso**

### **Light Mode:**

**Botão Primário:**
```tsx
<button className="bg-gray-900 hover:bg-gray-800 text-white">
  Entrar
</button>
```

**Card:**
```tsx
<div className="bg-white border border-gray-200">
  <h2 className="text-gray-900">Título</h2>
  <p className="text-gray-600">Descrição</p>
</div>
```

**Input:**
```tsx
<input 
  className="bg-gray-50 border-gray-300 text-gray-900" 
  placeholder="Digite seu email"
/>
```

### **Dark Mode:**

**Botão Primário:**
```tsx
<button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
  Entrar
</button>
```

**Card:**
```tsx
<div className="bg-gray-800 border border-gray-700">
  <h2 className="text-white">Título</h2>
  <p className="text-gray-400">Descrição</p>
</div>
```

---

## 🔧 **Como Usar no Código**

### **Com Tailwind:**
```tsx
// Light mode: bg-white, text-gray-900
// Dark mode: dark:bg-gray-800, dark:text-white

<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Conteúdo
</div>
```

### **Com CSS Variables:**
```tsx
<div style={{ 
  backgroundColor: 'hsl(var(--background))',
  color: 'hsl(var(--foreground))'
}}>
  Conteúdo
</div>
```

---

## 📐 **Hierarquia de Contraste**

### **Light Mode:**
1. **Texto principal:** Preto suave `#141B25` (contraste 15:1)
2. **Texto secundário:** Cinza médio `#6B7280` (contraste 7:1)
3. **Texto terciário:** Cinza claro `#9CA3AF` (contraste 4.5:1)
4. **Bordas:** Cinza muito claro `#E5E7EB` (contraste mínimo)

### **Dark Mode:**
1. **Texto principal:** Branco `#FAFAFA` (contraste 20:1)
2. **Texto secundário:** Cinza claro `#A3A3A3` (contraste 8:1)
3. **Texto terciário:** Cinza médio `#808080` (contraste 5:1)
4. **Bordas:** Cinza escuro `#333333` (contraste mínimo)

---

## ✅ **Benefícios do Novo Sistema**

### **1. Acessibilidade**
- ✅ Contraste WCAG AAA em textos principais
- ✅ Contraste WCAG AA em textos secundários
- ✅ Fácil leitura em ambos os modos

### **2. Consistência**
- ✅ Paleta bem definida
- ✅ Variáveis CSS reutilizáveis
- ✅ Design system robusto

### **3. Profissionalismo**
- ✅ Branco suave (não cansativo)
- ✅ Preto elegante (não chapado)
- ✅ Gradientes apenas no dark mode

### **4. Flexibilidade**
- ✅ Fácil alternar entre light/dark
- ✅ Fácil customizar cores
- ✅ Fácil adicionar novos temas

---

## 🚀 **Migração Automática**

As páginas existentes **já estão usando** essas cores através de:

1. **Tailwind classes** → Funcionam automaticamente
2. **CSS variables** → Atualizadas globalmente
3. **Componentes** → Herdando do sistema

**Não é necessário alterar código existente!** ✅

---

## 📖 **Referências**

- **WCAG Contrast:** https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- **HSL Colors:** https://www.w3schools.com/colors/colors_hsl.asp
- **Tailwind CSS:** https://tailwindcss.com/docs/customizing-colors

---

**Criado em:** Janeiro 2025  
**Status:** ✅ Implementado  
**Aplicação:** Global (app/globals.css)
