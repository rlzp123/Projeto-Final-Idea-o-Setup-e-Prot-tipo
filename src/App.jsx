import { useEffect, useMemo, useState } from 'react'
import { Camera, Check, ChevronRight, ClipboardList, DoorOpen, FileText, Home, LogOut, Plus, ShieldCheck, Trash2, Upload, UserRound, X } from 'lucide-react'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import { captureRoomPhoto } from './lib/camera'
import Brand from './components/Brand'

const rooms = ['Sala', 'Cozinha', 'Quarto', 'Banheiro', 'Área de serviço', 'Varanda', 'Garagem', 'Outro']
const conditions = ['Ótimo', 'Bom', 'Regular', 'Ruim']

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authMode, setAuthMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [items, setItems] = useState([])
  const [screen, setScreen] = useState('list')
  const [editing, setEditing] = useState(null)
  const [room, setRoom] = useState('Sala')
  const [condition, setCondition] = useState('Bom')
  const [observation, setObservation] = useState('')
  const [photo, setPhoto] = useState('')
  const [filter, setFilter] = useState('Todos')

  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => { if (session?.user) loadItems() }, [session])

  async function loadItems() {
    const { data, error } = await supabase.from('itens_vistoria_imovel')
      .select('*').order('created_at', { ascending: false })
    if (error) setMessage(error.message)
    else setItems(data || [])
  }

  async function handleAuth(event) {
    event.preventDefault()
    if (!isSupabaseConfigured) {
      setMessage('Configure o arquivo .env com a URL e a chave pública do Supabase.')
      return
    }
    setBusy(true); setMessage('')
    const result = authMode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    setBusy(false)
    if (result.error) setMessage(result.error.message)
    else if (authMode === 'signup' && !result.data.session) setMessage('Cadastro realizado! Confirme seu e-mail para entrar.')
  }

  async function logout() {
    await supabase.auth.signOut()
    setItems([]); setScreen('list')
  }

  function openNew() {
    setEditing(null); setRoom('Sala'); setCondition('Bom'); setObservation(''); setPhoto('')
    setScreen('form')
  }

  function openEdit(item) {
    setEditing(item); setRoom(item.comodo); setCondition(item.estado_conservacao)
    setObservation(item.observacao || ''); setPhoto(item.foto_base64 || '')
    setScreen('form')
  }

  async function takePhoto() {
    try {
      const result = await captureRoomPhoto()
      setPhoto(result)
      setMessage('')
    } catch (error) {
      setMessage(error?.message || 'Não foi possível abrir a câmera.')
    }
  }

  async function saveItem(event) {
    event.preventDefault()
    if (!session?.user) return
    setBusy(true); setMessage('')
    const payload = {
      user_id: session.user.id,
      comodo: room,
      estado_conservacao: condition,
      observacao: observation.trim() || null,
      foto_base64: photo || null,
    }
    const result = editing
      ? await supabase.from('itens_vistoria_imovel').update(payload).eq('id', editing.id).select().single()
      : await supabase.from('itens_vistoria_imovel').insert(payload).select().single()
    setBusy(false)
    if (result.error) { setMessage(result.error.message); return }
    await loadItems(); setScreen('list'); setMessage('Registro salvo com sucesso.')
  }

  async function deleteItem(id) {
    if (!confirm('Deseja excluir este registro da vistoria?')) return
    const { error } = await supabase.from('itens_vistoria_imovel').delete().eq('id', id)
    if (error) setMessage(error.message)
    else { await loadItems(); setMessage('Registro excluído.') }
  }

  const filtered = useMemo(() => filter === 'Todos' ? items : items.filter(item => item.comodo === filter), [items, filter])
  const doneCount = items.length

  if (authLoading) return <div className="loading-screen"><div className="spinner"/><span>Preparando sua vistoria...</span></div>

  if (!session) return <main className="auth-page">
    <section className="auth-visual">
      <div className="auth-visual-content">
        <Brand />
        <div className="visual-copy">
          <span className="eyebrow">VISTORIAS MAIS SIMPLES</span>
          <h1>O cuidado com seu imóvel começa <em>nos detalhes.</em></h1>
          <p>Registre cada ambiente, documente o estado de conservação e mantenha tudo organizado em um só lugar.</p>
          <div className="trust-line"><ShieldCheck size={18}/> Seus registros ficam vinculados à sua conta.</div>
        </div>
        <div className="visual-footer">ORGANIZAÇÃO • TRANSPARÊNCIA • SEGURANÇA</div>
      </div>
    </section>
    <section className="auth-panel">
      <div className="auth-card">
        <div className="mobile-brand"><Brand compact /></div>
        <span className="eyebrow">BEM-VINDO(A)</span>
        <h2>{authMode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}</h2>
        <p className="muted">Entre para continuar sua vistoria imobiliária.</p>
        <form onSubmit={handleAuth} className="form-stack">
          <label>E-mail<input type="email" required placeholder="seuemail@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} /></label>
          <label>Senha<input type="password" minLength="6" required placeholder="Mínimo de 6 caracteres" value={password} onChange={e=>setPassword(e.target.value)} /></label>
          {message && <div className="notice">{message}</div>}
          <button className="primary-btn" disabled={busy}>{busy ? 'Aguarde...' : authMode === 'login' ? 'Entrar na plataforma' : 'Criar minha conta'} <ChevronRight size={17}/></button>
        </form>
        <p className="switch-auth">{authMode === 'login' ? 'Ainda não tem conta?' : 'Já possui uma conta?'} <button onClick={()=>{setAuthMode(authMode==='login'?'signup':'login');setMessage('')}}>{authMode === 'login' ? 'Cadastre-se' : 'Fazer login'}</button></p>
        {!isSupabaseConfigured && <div className="setup-hint">Modo de configuração: adicione as credenciais do Supabase no arquivo <code>.env</code> para habilitar o acesso.</div>}
      </div>
      <div className="auth-legal">© 2026 VistoriaImóvel · Plataforma de registro de vistorias</div>
    </section>
  </main>

  return <div className="app-shell">
    <header className="topbar">
      <Brand compact />
      <div className="topbar-right"><span className="user-pill"><UserRound size={15}/>{session.user.email}</span><button className="icon-btn" title="Sair" onClick={logout}><LogOut size={18}/></button></div>
    </header>
    <main className="workspace">
      <div className="page-heading">
        <div><span className="eyebrow">PAINEL DE VISTORIA</span><h1>{screen === 'form' ? (editing ? 'Editar registro' : 'Novo registro') : 'Relatório por cômodo'}</h1><p className="muted">{screen === 'form' ? 'Preencha os detalhes e adicione uma foto do ambiente.' : 'Acompanhe os ambientes documentados do imóvel.'}</p></div>
        {screen === 'list' && <button className="primary-btn add-btn" onClick={openNew}><Plus size={18}/> Novo cômodo</button>}
        {screen === 'form' && <button className="secondary-btn" onClick={()=>setScreen('list')}><X size={16}/> Cancelar</button>}
      </div>
      {message && <div className="notice global-notice"><span>{message}</span><button onClick={()=>setMessage('')}><X size={15}/></button></div>}
      {screen === 'list' ? <>
        <section className="summary-grid">
          <div className="summary-card featured"><div className="summary-icon"><ClipboardList size={20}/></div><div><span>Registros realizados</span><strong>{doneCount.toString().padStart(2,'0')}</strong></div><small>Ambientes documentados</small></div>
          <div className="summary-card"><div className="summary-icon soft"><Home size={20}/></div><div><span>Ambientes disponíveis</span><strong>{rooms.length.toString().padStart(2,'0')}</strong></div><small>Tipos de cômodos</small></div>
          <div className="summary-card"><div className="summary-icon soft"><Camera size={20}/></div><div><span>Com fotografia</span><strong>{items.filter(i=>i.foto_base64).length.toString().padStart(2,'0')}</strong></div><small>Registros com evidência visual</small></div>
        </section>
        <section className="list-section">
          <div className="section-head"><div><h2>Ambientes vistoriados</h2><p className="muted">Selecione um registro para consultar ou editar.</p></div><span className="count-label">{items.length} {items.length===1?'registro':'registros'}</span></div>
          <div className="filter-row"><button className={filter==='Todos'?'filter active':'filter'} onClick={()=>setFilter('Todos')}>Todos</button>{rooms.map(r=><button key={r} className={filter===r?'filter active':'filter'} onClick={()=>setFilter(r)}>{r}</button>)}</div>
          {filtered.length ? <div className="record-grid">{filtered.map(item=><article className="record-card" key={item.id}>
            <div className="record-photo">{item.foto_base64 ? <img src={item.foto_base64} alt={`Foto do cômodo ${item.comodo}`}/> : <div className="photo-placeholder"><Home size={27}/><span>Sem fotografia</span></div>}<span className={`status status-${item.estado_conservacao.toLowerCase()}`}>{item.estado_conservacao}</span></div>
            <div className="record-body"><div className="record-title"><div><span className="eyebrow">AMBIENTE</span><h3>{item.comodo}</h3></div><button className="delete-btn" title="Excluir" onClick={()=>deleteItem(item.id)}><Trash2 size={16}/></button></div><p>{item.observacao || 'Nenhuma observação adicionada.'}</p><button className="text-action" onClick={()=>openEdit(item)}>Ver detalhes <ChevronRight size={15}/></button></div>
          </article>)}</div> : <div className="empty-state"><div className="empty-icon"><DoorOpen size={28}/></div><h3>Nenhum ambiente por aqui</h3><p>Adicione o primeiro cômodo para começar a documentar o imóvel.</p><button className="primary-btn" onClick={openNew}><Plus size={17}/> Adicionar cômodo</button></div>}
        </section>
      </> : <section className="editor-layout">
        <form className="editor-card" onSubmit={saveItem}>
          <div className="editor-section-title"><div className="step-number">01</div><div><h2>Informações do ambiente</h2><p className="muted">Identifique o cômodo e avalie sua conservação.</p></div></div>
          <label>Cômodo<select value={room} onChange={e=>setRoom(e.target.value)}>{rooms.map(r=><option key={r}>{r}</option>)}</select></label>
          <label>Estado de conservação<div className="condition-grid">{conditions.map(c=><button type="button" key={c} onClick={()=>setCondition(c)} className={`condition-option ${condition===c?'selected':''}`}><span className={`condition-dot dot-${c.toLowerCase()}`}/>{c}{condition===c&&<Check size={15}/>}</button>)}</div></label>
          <label>Observações<textarea rows="4" placeholder="Ex.: parede sem manchas, porta funcionando normalmente..." value={observation} onChange={e=>setObservation(e.target.value)}/></label>
          <div className="editor-section-title photo-title"><div className="step-number">02</div><div><h2>Registro fotográfico</h2><p className="muted">Adicione uma imagem para documentar o estado atual.</p></div></div>
          <div className="camera-box">
            {photo ? <div className="captured-photo"><img src={photo} alt="Foto capturada do cômodo"/><button type="button" className="remove-photo" onClick={()=>setPhoto('')}><X size={15}/></button></div> : <div className="camera-empty"><div className="camera-icon"><Camera size={25}/></div><strong>Nenhuma foto adicionada</strong><span>Use a câmera do dispositivo para registrar o ambiente.</span></div>}
            <button type="button" className="secondary-btn camera-btn" onClick={takePhoto}><Camera size={17}/>{photo?'Tirar outra foto':'Abrir câmera'}</button>
          </div>
          <div className="editor-actions"><button type="button" className="secondary-btn" onClick={()=>setScreen('list')}>Voltar</button><button className="primary-btn" disabled={busy}><Check size={17}/>{busy?'Salvando...':'Salvar registro'}</button></div>
        </form>
        <aside className="tip-card"><div className="tip-icon"><ShieldCheck size={21}/></div><h3>Dica para uma boa vistoria</h3><p>Fotografe o ambiente com boa iluminação e registre detalhes importantes, como paredes, portas, janelas e instalações.</p><div className="tip-line"><Check size={15}/> Descreva danos já existentes</div><div className="tip-line"><Check size={15}/> Faça fotos nítidas e abrangentes</div><div className="tip-line"><Check size={15}/> Revise antes de salvar</div></aside>
      </section>}
    </main>
    <footer className="app-footer"><span>VistoriaImóvel</span><span>Registros organizados, decisões mais tranquilas.</span></footer>
  </div>
}