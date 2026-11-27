-- Tabela principal do MVP VistoriaImóvel Locação
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.itens_vistoria_imovel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comodo TEXT NOT NULL,
  estado_conservacao TEXT NOT NULL CHECK (estado_conservacao IN ('Ótimo', 'Bom', 'Regular', 'Ruim')),
  observacao TEXT,
  foto_base64 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.itens_vistoria_imovel ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.itens_vistoria_imovel TO authenticated;

CREATE POLICY "Usuários visualizam seus próprios registros"
ON public.itens_vistoria_imovel FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Usuários criam seus próprios registros"
ON public.itens_vistoria_imovel FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Usuários atualizam seus próprios registros"
ON public.itens_vistoria_imovel FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Usuários excluem seus próprios registros"
ON public.itens_vistoria_imovel FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS idx_itens_vistoria_user_created
ON public.itens_vistoria_imovel (user_id, created_at DESC);