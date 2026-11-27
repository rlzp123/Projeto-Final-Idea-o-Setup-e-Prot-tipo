import { Building2, ShieldCheck } from 'lucide-react'

export default function Brand({ compact = false }) {
  return <div className="brand">
    <div className="brand-mark"><Building2 size={22} strokeWidth={2.2} /></div>
    <div><strong>Vistoria<span>Imóvel</span></strong>{!compact && <small><ShieldCheck size={12}/> REGISTROS COM CONFIANÇA</small>}</div>
  </div>
}