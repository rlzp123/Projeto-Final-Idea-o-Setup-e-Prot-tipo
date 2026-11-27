# VistoriaImóvel Locação — MVP Aluno 31

Aplicativo híbrido para documentar o estado de conservação de imóveis durante vistorias de entrada e saída. O usuário registra cômodos, informa o estado de conservação, adiciona observações e fotografa o ambiente com a câmera do dispositivo.

## Problema real
Inquilinos e proprietários precisam documentar, de forma organizada, o estado de paredes, portas, janelas e instalações na entrega das chaves. O aplicativo centraliza os registros por cômodo e permite associar fotografias às observações.

## Objetivo do MVP
Entregar um fluxo funcional com autenticação, CRUD de registros de vistoria e uso da câmera nativa.

## Telas principais
1. **Login / Cadastro:** autenticação por e-mail e senha com Supabase Auth.
2. **Relatório por Cômodo:** listagem, filtros, indicadores e ações de consulta, edição e exclusão.
3. **Fotografar Cômodo:** formulário de cômodo, estado de conservação, observações e captura de foto com `@capacitor/camera`.

## Tecnologias
- React + Vite
- Tailwind CSS 4
- Capacitor 7
- Supabase Auth + PostgreSQL + RLS
- `@capacitor/camera`
- `lucide-react`

## Requisitos
- Node.js 20.19+ ou 22.12+
- npm
- Conta Supabase
- Android Studio para gerar/abrir o projeto Android (opcional para testar no navegador)

## Instalação
```bash
npm install
```

Crie um arquivo `.env` na raiz, copiando `.env.example`, e preencha:
```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA_OU_PUBLISHABLE
```

> Use somente a chave pública/publishable no frontend. Nunca coloque `service_role` ou secret key no aplicativo.

## Banco de dados
No SQL Editor do Supabase, execute o conteúdo de:
`supabase/migrations/001_itens_vistoria_imovel.sql`

A migration cria a tabela `itens_vistoria_imovel`, habilita RLS e limita leitura, criação, edição e exclusão aos registros pertencentes ao usuário autenticado.

## Executar no navegador
```bash
npm run dev
```

## Preparar Android com Capacitor
```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Depois de alterar o frontend:
```bash
npm run cap:sync
```

## Permissão de câmera
O plugin `@capacitor/camera` solicita acesso à câmera no momento da captura. Teste preferencialmente em dispositivo Android ou emulador compatível. A implementação utiliza `CameraResultType.DataUrl` e armazena o conteúdo no campo `foto_base64`, conforme o SQL sugerido no card da atividade.

## Estrutura
```text
mvp-aluno31-vistoriaimovel/
├── public/
├── src/
│   ├── components/Brand.jsx
│   ├── lib/camera.js
│   ├── lib/supabase.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── supabase/migrations/001_itens_vistoria_imovel.sql
├── .env.example
├── capacitor.config.json
├── index.html
├── package.json
└── README.md
```

## Escopo e limitações do MVP
- Login e cadastro por e-mail/senha.
- CRUD básico de itens de vistoria.
- Registro de cômodo, estado, observação e fotografia.
- Cada usuário acessa somente seus próprios registros via RLS.
- O campo `foto_base64` atende ao modelo mínimo proposto na atividade. Para uma versão de produção, recomenda-se migrar as imagens para Supabase Storage e salvar na tabela apenas o caminho do arquivo.
- Não inclui ainda assinatura digital, exportação PDF, comparação entre vistoria de entrada/saída ou compartilhamento público do relatório.

## Fluxo resumido
Login/Cadastro → Relatório por Cômodo → Novo/Editar cômodo → Capturar foto → Salvar → Relatório atualizado.

## Repositório
Nome solicitado pela atividade: `mvp-aluno31-vistoriaimovel`  
Visibilidade: Público  
Primeiro commit sugerido: `feat: iniciar MVP VistoriaImóvel Aluno 31`
