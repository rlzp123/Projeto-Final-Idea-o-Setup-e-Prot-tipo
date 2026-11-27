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
