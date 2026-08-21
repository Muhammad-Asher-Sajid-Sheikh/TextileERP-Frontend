import React, { useState, useCallback } from 'react';
import api from '../services/api';
import seededOrders from '../assets/seededOrders.json';
import {
  Factory, Package, Layers, Droplets, Palette,
  Scissors, ShieldCheck, Ship, ChevronRight, ChevronDown,
  CheckCircle2, AlertCircle, Clock, Loader2, XCircle,
  RefreshCw, ArrowRight, Info, FileText, User, Zap,
  Beaker, TestTube, Sparkles, Hammer, ClipboardCheck,
  Send, Check
} from 'lucide-react';

// ─── Status colours ───────────────────────────────────────────────────────────
const STATUS_META = {
  AUTHORIZED:                   { color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  label: 'Authorized',                  icon: <Zap size={13}/> },
  MATERIAL_ALLOCATED:           { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  label: 'Material Allocated',           icon: <Package size={13}/> },
  WET_PROCESSING_INPROGRESS:    { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',   label: 'Wet Processing',               icon: <Droplets size={13}/> },
  SURFACE_DECORATION_INPROGRESS:{ color: '#a855f7', bg: 'rgba(168,85,247,0.12)', label: 'Surface Decoration',           icon: <Palette size={13}/> },
  ASSEMBLY_INPROGRESS:          { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Assembly In-Progress',          icon: <Scissors size={13}/> },
  QC_VERIFICATION_INPROGRESS:   { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', label: 'QC Verification',              icon: <ShieldCheck size={13}/> },
  PS_SAMPLE_PENDING:            { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'PS Sample Pending',             icon: <Clock size={13}/> },
  PS_APPROVED:                  { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'PS Approved',                  icon: <CheckCircle2 size={13}/> },
  EXPORT_READY:                 { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Export Ready',                  icon: <Ship size={13}/> },
  FAILED:                       { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  label: 'Failed',                       icon: <XCircle size={13}/> },
};

const STATUS_ORDER = [
  'AUTHORIZED', 'MATERIAL_ALLOCATED', 'WET_PROCESSING_INPROGRESS',
  'SURFACE_DECORATION_INPROGRESS', 'ASSEMBLY_INPROGRESS', 'QC_VERIFICATION_INPROGRESS',
  'PS_SAMPLE_PENDING', 'PS_APPROVED', 'EXPORT_READY',
];

const ASSEMBLY_PHASES = [
  'PHASE1_CUTTING', 'PHASE2_STITCHING', 'PHASE3_INITIAL_CHECK',
  'PHASE4_FOLDING', 'PHASE5_FINAL_CHECK', 'PHASE6_PACKING',
];
const PHASE_LABELS = {
  PHASE1_CUTTING: 'Cutting', PHASE2_STITCHING: 'Stitching',
  PHASE3_INITIAL_CHECK: 'Initial Check', PHASE4_FOLDING: 'Folding',
  PHASE5_FINAL_CHECK: 'Final Check', PHASE6_PACKING: 'Packing',
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
const useFormState = (defaults) => {
  const [form, setForm] = useState(defaults);
  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));
  const reset = () => setForm(defaults);
  return [form, set, reset, setForm];
};

const GateResult = ({ result, error }) => {
  if (!result && !error) return null;
  if (error) return (
    <div className="prod-alert prod-alert-error">
      <AlertCircle size={16} className="prod-alert-icon" />
      <div><strong>Error:</strong> {error}</div>
    </div>
  );
  return (
    <div className="prod-alert prod-alert-success">
      <CheckCircle2 size={16} className="prod-alert-icon" />
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '12px' }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
};

const Field = ({ label, id, type = 'text', value, onChange, placeholder, disabled, step, min, max, options }) => (
  <div className="prod-field">
    <label className="prod-label" htmlFor={id}>{label}</label>
    {options ? (
      <select id={id} className="prod-input prod-select" value={value} onChange={e => onChange(e.target.value)} disabled={disabled}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    ) : (
      <input
        id={id} type={type} className="prod-input"
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        step={step} min={min} max={max}
        style={{ paddingLeft: '14px' }}
      />
    )}
  </div>
);

const SubmitBtn = ({ loading, label, icon }) => (
  <button type="submit" className="prod-btn prod-btn-primary" disabled={loading}>
    {loading ? <Loader2 size={15} className="spin" /> : (icon || <ArrowRight size={15} />)}
    {loading ? 'Processing...' : label}
  </button>
);

// ─── Gate Components ──────────────────────────────────────────────────────────

// GATE 1 – Material Allocation
const Gate1MaterialAllocation = ({ order, inventory }) => {
  const [tab, setTab] = useState('requisition');
  const [reqForm, setReq, resetReq] = useFormState({ materialId: '', volume: '', unit: 'Kg' });
  const [relForm, setRel, resetRel] = useFormState({ requisitionId: '', signature: '', approvedBy: '' });
  const [disForm, setDis, resetDis] = useFormState({ requisitionId: '', dispatchedVolume: '', dispatchedBy: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const call = async (fn) => {
    setLoading(true); setResult(null); setError(null);
    try { const r = await fn(); setResult(r.data); }
    catch (e) { setError(e.response?.data?.message || e.message); }
    finally { setLoading(false); }
  };

  const inventoryOptions = inventory.map(i => ({
    value: i.id,
    label: `${i.masterSampleCode} — ${i.description} (${i.physicalVolume} ${i.volumeUnit})`
  }));

  return (
    <div>
      <div className="prod-tab-bar">
        {['requisition', 'release', 'dispatch'].map(t => (
          <button key={t} className={`prod-tab ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setResult(null); setError(null); }}>
            {t === 'requisition' ? '① Create Requisition' : t === 'release' ? '② Release Requisition' : '③ Dispatch Material'}
          </button>
        ))}
      </div>

      {tab === 'requisition' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/material-allocation/requisition', { orderTokenId: order.id, requestedMaterialId: reqForm.materialId, requestedVolume: parseFloat(reqForm.volume), volumeUnit: reqForm.unit })); }}>
          <div className="prod-form-grid">
            <Field label="Material" id="req-mat" options={inventoryOptions} value={reqForm.materialId} onChange={v => setReq('materialId', v)} disabled={loading} />
            <Field label="Volume" id="req-vol" type="number" step="0.01" value={reqForm.volume} onChange={v => setReq('volume', v)} placeholder="e.g. 50" disabled={loading} />
            <Field label="Unit" id="req-unit" options={[{value:'Kg',label:'Kg'},{value:'Meters',label:'Meters'},{value:'Pieces',label:'Pieces'}]} value={reqForm.unit} onChange={v => setReq('unit', v)} disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Create Requisition" icon={<FileText size={15}/>} />
        </form>
      )}

      {tab === 'release' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/material-allocation/requisition/release', { requisitionId: relForm.requisitionId, approvalSignature: relForm.signature, approvedBy: relForm.approvedBy })); }}>
          <div className="prod-form-grid">
            <Field label="Requisition ID" id="rel-rid" value={relForm.requisitionId} onChange={v => setRel('requisitionId', v)} placeholder="UUID of requisition" disabled={loading} />
            <Field label="Approval Signature" id="rel-sig" value={relForm.signature} onChange={v => setRel('signature', v)} placeholder="DIGITAL_SIGNATURE_BASE64" disabled={loading} />
            <Field label="Approved By (Email)" id="rel-by" type="email" value={relForm.approvedBy} onChange={v => setRel('approvedBy', v)} placeholder="supervisor@fabricsync.com" disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Release Requisition" icon={<Check size={15}/>} />
        </form>
      )}

      {tab === 'dispatch' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/material-allocation/dispatch', { requisitionId: disForm.requisitionId, dispatchedVolume: parseFloat(disForm.dispatchedVolume), dispatchedBy: disForm.dispatchedBy })); }}>
          <div className="prod-form-grid">
            <Field label="Requisition ID" id="dis-rid" value={disForm.requisitionId} onChange={v => setDis('requisitionId', v)} placeholder="UUID of released requisition" disabled={loading} />
            <Field label="Dispatched Volume" id="dis-vol" type="number" step="0.01" value={disForm.dispatchedVolume} onChange={v => setDis('dispatchedVolume', v)} placeholder="e.g. 50" disabled={loading} />
            <Field label="Dispatched By (Email)" id="dis-by" type="email" value={disForm.dispatchedBy} onChange={v => setDis('dispatchedBy', v)} placeholder="warehouse_operator@fabricsync.com" disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Dispatch to Floor" icon={<Send size={15}/>} />
        </form>
      )}

      <GateResult result={result} error={error} />
    </div>
  );
};

// GATE 2 – Yarn & Fabric
const Gate2YarnFabric = ({ order }) => {
  const [tab, setTab] = useState('twisting');
  const [twistInitForm, setTwistInit] = useFormState({ twistingLogDetails: 'Standard high-strength double twist execution' });
  const [twistCompForm, setTwistComp] = useFormState({ twistingCompletedAt: '' });
  const [wvForm, setWv] = useFormState({ vendorId: '', yarnType: '', totalYardage: '', requiredYarnWeight: '' });
  const [foForm, setFo] = useFormState({ vendorId: '', rollPieceCount: '', totalMassWeight: '', fabricDensityGsm: '', totalLength: '', poYieldTargetWeight: '', returnedAt: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const call = async (fn) => {
    setLoading(true); setResult(null); setError(null);
    try { const r = await fn(); setResult(r.data); }
    catch (e) { setError(e.response?.data?.message || e.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="prod-tab-bar">
        {['twisting', 'weaving', 'fabricOutput'].map(t => (
          <button key={t} className={`prod-tab ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setResult(null); setError(null); }}>
            {t === 'twisting' ? '① Yarn Twisting' : t === 'weaving' ? '② Weaving Dispatch' : '③ Log Raw Fabric Output'}
          </button>
        ))}
      </div>

      {tab === 'twisting' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/yarn-fabric/twisting/initiate', { orderTokenId: order.id, twistingLogDetails: twistInitForm.twistingLogDetails })); }}>
            <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)', fontSize: '14px' }}>A. Initiate Yarn Twisting</h4>
            <div className="prod-form-grid">
              <Field label="Twisting Log Details" id="tw-details" value={twistInitForm.twistingLogDetails} onChange={v => setTwistInit('twistingLogDetails', v)} placeholder="e.g. Standard twist specifications" disabled={loading} />
            </div>
            <SubmitBtn loading={loading} label="Initiate Yarn Twisting" icon={<Send size={15}/>} />
          </form>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '10px 0' }} />

          <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/yarn-fabric/twisting/complete', { orderTokenId: order.id, twistingCompletedAt: twistCompForm.twistingCompletedAt })); }}>
            <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-primary)', fontSize: '14px' }}>B. Complete Yarn Twisting</h4>
            <div className="prod-form-grid">
              <Field label="Completed At" id="tw-comp" type="datetime-local" value={twistCompForm.twistingCompletedAt} onChange={v => setTwistComp('twistingCompletedAt', v)} disabled={loading} />
            </div>
            <SubmitBtn loading={loading} label="Complete Yarn Twisting" icon={<Check size={15}/>} />
          </form>
        </div>
      )}

      {tab === 'weaving' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/yarn-fabric/weaving/dispatch', { orderTokenId: order.id, vendorId: wvForm.vendorId, yarnType: wvForm.yarnType, totalYardage: parseFloat(wvForm.totalYardage), requiredYarnWeight: parseFloat(wvForm.requiredYarnWeight) })); }}>
          <div className="prod-form-grid">
            <Field label="Vendor ID" id="wv-vid" value={wvForm.vendorId} onChange={v => setWv('vendorId', v)} placeholder="e.g. VND-WEAVE-1" disabled={loading} />
            <Field label="Yarn Type" id="wv-yt" value={wvForm.yarnType} onChange={v => setWv('yarnType', v)} placeholder="e.g. Cotton Blend" disabled={loading} />
            <Field label="Total Yardage" id="wv-ty" type="number" step="0.01" value={wvForm.totalYardage} onChange={v => setWv('totalYardage', v)} placeholder="e.g. 5000" disabled={loading} />
            <Field label="Required Yarn Weight (kg)" id="wv-ryw" type="number" step="0.01" value={wvForm.requiredYarnWeight} onChange={v => setWv('requiredYarnWeight', v)} placeholder="e.g. 50" disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Dispatch to Weaving" icon={<Send size={15}/>} />
        </form>
      )}

      {tab === 'fabricOutput' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/yarn-fabric/fabric-output/log', { orderTokenId: order.id, vendorId: foForm.vendorId, rollPieceCount: parseInt(foForm.rollPieceCount), totalMassWeight: parseFloat(foForm.totalMassWeight), fabricDensityGsm: parseFloat(foForm.fabricDensityGsm), totalLength: parseFloat(foForm.totalLength), poYieldTargetWeight: parseFloat(foForm.poYieldTargetWeight), returnedAt: foForm.returnedAt })); }}>
          <div className="prod-form-grid">
            <Field label="Vendor ID" id="fo-vid" value={foForm.vendorId} onChange={v => setFo('vendorId', v)} placeholder="e.g. VND-WEAVE-1" disabled={loading} />
            <Field label="Roll Piece Count" id="fo-rpc" type="number" value={foForm.rollPieceCount} onChange={v => setFo('rollPieceCount', v)} placeholder="e.g. 12" disabled={loading} />
            <Field label="Total Mass Weight (kg)" id="fo-tmw" type="number" step="0.01" value={foForm.totalMassWeight} onChange={v => setFo('totalMassWeight', v)} placeholder="e.g. 48.50" disabled={loading} />
            <Field label="Fabric Density (GSM)" id="fo-gsm" type="number" step="0.01" min="10" max="1000" value={foForm.fabricDensityGsm} onChange={v => setFo('fabricDensityGsm', v)} placeholder="e.g. 200" disabled={loading} />
            <Field label="Total Length (m)" id="fo-tl" type="number" step="0.01" value={foForm.totalLength} onChange={v => setFo('totalLength', v)} placeholder="e.g. 4950" disabled={loading} />
            <Field label="PO Yield Target Weight (kg)" id="fo-pyt" type="number" step="0.01" value={foForm.poYieldTargetWeight} onChange={v => setFo('poYieldTargetWeight', v)} placeholder="e.g. 48.00" disabled={loading} />
            <Field label="Returned At (ISO)" id="fo-ra" type="datetime-local" value={foForm.returnedAt} onChange={v => setFo('returnedAt', v)} disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Log Fabric Output" icon={<Layers size={15}/>} />
        </form>
      )}

      <GateResult result={result} error={error} />
    </div>
  );
};

// GATE 3 – Wet Processing
const Gate3WetProcessing = ({ order }) => {
  const [tab, setTab] = useState('dispatch');
  const [dpForm, setDp] = useFormState({ millId: '', inputTotalWeight: '' });
  const [qtForm, setQt] = useFormState({ wetProcessingLogId: '', testType: 'COLOR_FASTNESS', result: 'PASSED', testedBy: '' });
  const [cpForm, setCp] = useFormState({ outputTotalWeight: '', returnedAt: '', returnedFrom: '' });
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null);
  const [error, setError] = useState(null);

  const call = async (fn) => {
    setLoading(true); setRes(null); setError(null);
    try { const r = await fn(); setRes(r.data); }
    catch (e) { setError(e.response?.data?.message || e.message); }
    finally { setLoading(false); }
  };

  const weightLossPct = cpForm.inputRef && cpForm.outputTotalWeight
    ? (((parseFloat(cpForm.inputRef) - parseFloat(cpForm.outputTotalWeight)) / parseFloat(cpForm.inputRef)) * 100).toFixed(2)
    : null;

  return (
    <div>
      <div className="prod-tab-bar">
        {['dispatch','qualityTest','complete'].map(t => (
          <button key={t} className={`prod-tab ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setRes(null); setError(null); }}>
            {t === 'dispatch' ? '① Dispatch to Dyehouse' : t === 'qualityTest' ? '② Log Quality Tests' : '③ Complete & Validate'}
          </button>
        ))}
      </div>

      {tab === 'dispatch' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/wet-processing/dispatch', { orderTokenId: order.id, millId: dpForm.millId, inputTotalWeight: parseFloat(dpForm.inputTotalWeight) })); }}>
          <div className="prod-form-grid">
            <Field label="Mill / Dyehouse ID" id="dp-mid" value={dpForm.millId} onChange={v => setDp('millId', v)} placeholder="e.g. dyehouse-bengal-001" disabled={loading} />
            <Field label="Input Total Weight (kg)" id="dp-itw" type="number" step="0.01" value={dpForm.inputTotalWeight} onChange={v => setDp('inputTotalWeight', v)} placeholder="e.g. 48.50" disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Dispatch to Dyehouse" icon={<Droplets size={15}/>} />
        </form>
      )}

      {tab === 'qualityTest' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/wet-processing/quality-test/log', { wetProcessingLogId: qtForm.wetProcessingLogId, testType: qtForm.testType, result: qtForm.result, testedBy: qtForm.testedBy })); }}>
          <div className="prod-form-grid">
            <Field label="Wet Processing Log ID" id="qt-lid" value={qtForm.wetProcessingLogId} onChange={v => setQt('wetProcessingLogId', v)} placeholder="UUID from dispatch response" disabled={loading} />
            <Field label="Test Type" id="qt-tt" options={[{value:'COLOR_FASTNESS',label:'Color Fastness'},{value:'SHRINKING',label:'Shrinking'},{value:'GASOLINE_SMELL',label:'Gasoline Smell'}]} value={qtForm.testType} onChange={v => setQt('testType', v)} disabled={loading} />
            <Field label="Result" id="qt-res" options={[{value:'PASSED',label:'Passed'},{value:'FAILED',label:'Failed'}]} value={qtForm.result} onChange={v => setQt('result', v)} disabled={loading} />
            <Field label="Tested By (Email)" id="qt-by" type="email" value={qtForm.testedBy} onChange={v => setQt('testedBy', v)} placeholder="lab_tech@fabricsync.com" disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Log Quality Test" icon={<TestTube size={15}/>} />
        </form>
      )}

      {tab === 'complete' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/wet-processing/complete', { orderTokenId: order.id, outputTotalWeight: parseFloat(cpForm.outputTotalWeight), returnedAt: cpForm.returnedAt, returnedFrom: cpForm.returnedFrom })); }}>
          <div className="prod-alert prod-alert-info" style={{ marginBottom: '16px' }}>
            <Info size={15} className="prod-alert-icon" />
            <span>Acceptable weight loss: <strong>9–11%</strong>. Values outside this range will trigger a <strong>ClaimDispute</strong> and mark the order as <strong>FAILED</strong>.</span>
          </div>
          <div className="prod-form-grid">
            <Field label="Output Total Weight (kg)" id="cp-otw" type="number" step="0.01" value={cpForm.outputTotalWeight} onChange={v => setCp('outputTotalWeight', v)} placeholder="e.g. 43.65" disabled={loading} />
            <Field label="Returned At (ISO)" id="cp-ra" type="datetime-local" value={cpForm.returnedAt} onChange={v => setCp('returnedAt', v)} disabled={loading} />
            <Field label="Returned From (Mill ID)" id="cp-rf" value={cpForm.returnedFrom} onChange={v => setCp('returnedFrom', v)} placeholder="e.g. dyehouse-bengal-001" disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Complete Wet Processing" icon={<CheckCircle2 size={15}/>} />
        </form>
      )}

      <GateResult result={res} error={error} />
    </div>
  );
};

// GATE 4 – Surface Decoration
const Gate4Decoration = ({ order }) => {
  const [tab, setTab] = useState('printDispatch');
  const [pdForm, setPd] = useFormState({ vendorId: '', rollsSent: '' });
  const [pcForm, setPc] = useFormState({ rollsReturned: '', specAuditNotes: '', specAuditBy: '' });
  const [embInitForm, setEmbInit] = useFormState({ totalPiecesCut: '1000', piecesPreStitched: '1000', preStitchBy: 'pre_stitch_supervisor@fabricsync.com' });
  const [embDispForm, setEmbDisp] = useFormState({ vendorId: '', piecesSent: '1000' });
  const [embCompForm, setEmbComp] = useFormState({ piecesReturned: '1000', returnedAt: '' });
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null);
  const [error, setError] = useState(null);

  const call = async (fn) => {
    setLoading(true); setRes(null); setError(null);
    try { const r = await fn(); setRes(r.data); }
    catch (e) { setError(e.response?.data?.message || e.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="prod-tab-bar" style={{ flexWrap: 'wrap' }}>
        {['printDispatch','printComplete', 'embroideryInit', 'embroideryDispatch', 'embroideryComplete'].map(t => (
          <button key={t} className={`prod-tab ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setRes(null); setError(null); }}>
            {t === 'printDispatch' ? '① Dispatch for Printing' :
             t === 'printComplete' ? '② Complete Printing' :
             t === 'embroideryInit' ? '③ Initiate Embroidery' :
             t === 'embroideryDispatch' ? '④ Dispatch for Embroidery' :
             '⑤ Complete Embroidery'}
          </button>
        ))}
      </div>

      {tab === 'printDispatch' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/decoration/printing/dispatch', { orderTokenId: order.id, vendorId: pdForm.vendorId, rollsSent: parseInt(pdForm.rollsSent) })); }}>
          <div className="prod-form-grid">
            <Field label="Vendor ID" id="pd-vid" value={pdForm.vendorId} onChange={v => setPd('vendorId', v)} placeholder="e.g. VND-PRINT-1" disabled={loading} />
            <Field label="Rolls Sent" id="pd-rs" type="number" value={pdForm.rollsSent} onChange={v => setPd('rollsSent', v)} placeholder="e.g. 12" disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Dispatch for Printing" icon={<Send size={15}/>} />
        </form>
      )}

      {tab === 'printComplete' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/decoration/printing/complete', { orderTokenId: order.id, rollsReturned: parseInt(pcForm.rollsReturned), specAuditNotes: pcForm.specAuditNotes, specAuditBy: pcForm.specAuditBy })); }}>
          <div className="prod-form-grid">
            <Field label="Rolls Returned" id="pc-rr" type="number" value={pcForm.rollsReturned} onChange={v => setPc('rollsReturned', v)} placeholder="e.g. 12" disabled={loading} />
            <Field label="Spec Audit Notes" id="pc-san" value={pcForm.specAuditNotes} onChange={v => setPc('specAuditNotes', v)} placeholder="All prints match specifications..." disabled={loading} />
            <Field label="Audited By (Email)" id="pc-sab" type="email" value={pcForm.specAuditBy} onChange={v => setPc('specAuditBy', v)} placeholder="qa_inspector@fabricsync.com" disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Complete Printing" icon={<CheckCircle2 size={15}/>} />
        </form>
      )}

      {tab === 'embroideryInit' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/decoration/embroidery/initiate', { orderTokenId: order.id, totalPiecesCut: parseInt(embInitForm.totalPiecesCut), piecesPreStitched: parseInt(embInitForm.piecesPreStitched), preStitchBy: embInitForm.preStitchBy })); }}>
          <div className="prod-form-grid">
            <Field label="Total Pieces Cut" id="emb-cut" type="number" value={embInitForm.totalPiecesCut} onChange={v => setEmbInit('totalPiecesCut', v)} placeholder="e.g. 1000" disabled={loading} />
            <Field label="Pieces Pre-Stitched" id="emb-prestitch" type="number" value={embInitForm.piecesPreStitched} onChange={v => setEmbInit('piecesPreStitched', v)} placeholder="e.g. 1000" disabled={loading} />
            <Field label="Pre-Stitched By (Email)" id="emb-by" value={embInitForm.preStitchBy} onChange={v => setEmbInit('preStitchBy', v)} placeholder="e.g. operator@fabricsync.com" disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Initiate Embroidery Slicing" icon={<Send size={15}/>} />
        </form>
      )}

      {tab === 'embroideryDispatch' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/decoration/embroidery/dispatch', { orderTokenId: order.id, vendorId: embDispForm.vendorId, piecesSent: parseInt(embDispForm.piecesSent) })); }}>
          <div className="prod-form-grid">
            <Field label="Vendor ID" id="emb-vid" value={embDispForm.vendorId} onChange={v => setEmbDisp('vendorId', v)} placeholder="e.g. VND-EMB-1" disabled={loading} />
            <Field label="Pieces Sent" id="emb-sent" type="number" value={embDispForm.piecesSent} onChange={v => setEmbDisp('piecesSent', v)} placeholder="e.g. 1000" disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Dispatch to Embroidery Vendor" icon={<Send size={15}/>} />
        </form>
      )}

      {tab === 'embroideryComplete' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/decoration/embroidery/complete', { orderTokenId: order.id, piecesReturned: parseInt(embCompForm.piecesReturned), returnedAt: embCompForm.returnedAt })); }}>
          <div className="prod-form-grid">
            <Field label="Pieces Returned" id="emb-ret" type="number" value={embCompForm.piecesReturned} onChange={v => setEmbComp('piecesReturned', v)} placeholder="e.g. 1000" disabled={loading} />
            <Field label="Returned At (ISO)" id="emb-ret-at" type="datetime-local" value={embCompForm.returnedAt} onChange={v => setEmbComp('returnedAt', v)} disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Complete Embroidery" icon={<CheckCircle2 size={15}/>} />
        </form>
      )}

      <GateResult result={res} error={error} />
    </div>
  );
};

// GATE 5 – Assembly Line
const Gate5Assembly = ({ order }) => {
  const [tab, setTab] = useState('jobCard');
  const [jcForm, setJc] = useFormState({ workerId: '', workerName: '', basePieceRate: '' });
  const [plForm, setPl] = useFormState({ jobCardId: '', phase: 'PHASE1_CUTTING', piecesProcessed: '', startedAt: '' });
  const [pcForm, setPc] = useFormState({ jobCardId: '', phase: 'PHASE1_CUTTING', completedAt: '' });
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null);
  const [error, setError] = useState(null);

  const call = async (fn) => {
    setLoading(true); setRes(null); setError(null);
    try { const r = await fn(); setRes(r.data); }
    catch (e) { setError(e.response?.data?.message || e.message); }
    finally { setLoading(false); }
  };

  const phaseOptions = ASSEMBLY_PHASES.map(p => ({ value: p, label: PHASE_LABELS[p] }));

  // Wage preview
  const wagePreview = plForm.piecesProcessed && jcForm.basePieceRate
    ? (parseFloat(plForm.piecesProcessed) * parseFloat(jcForm.basePieceRate)).toFixed(2)
    : null;

  return (
    <div>
      <div className="prod-tab-bar">
        {['jobCard','phaseLog','phaseComplete'].map(t => (
          <button key={t} className={`prod-tab ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setRes(null); setError(null); }}>
            {t === 'jobCard' ? '① Create Job Card' : t === 'phaseLog' ? '② Log Phase Start' : '③ Complete Phase'}
          </button>
        ))}
      </div>

      {/* Assembly pipeline visual */}
      <div className="phase-pipeline">
        {ASSEMBLY_PHASES.map((p, i) => (
          <div key={p} className="phase-step">
            <div className="phase-bubble">{i + 1}</div>
            <span className="phase-label">{PHASE_LABELS[p]}</span>
            {i < ASSEMBLY_PHASES.length - 1 && <ChevronRight size={14} className="phase-arrow" />}
          </div>
        ))}
      </div>

      {tab === 'jobCard' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/assembly/job-card/create', { orderTokenId: order.id, workerId: jcForm.workerId, workerName: jcForm.workerName, basePieceRate: parseFloat(jcForm.basePieceRate) })); }}>
          <div className="prod-form-grid">
            <Field label="Worker ID" id="jc-wid" value={jcForm.workerId} onChange={v => setJc('workerId', v)} placeholder="e.g. WRK-101" disabled={loading} />
            <Field label="Worker Name" id="jc-wn" value={jcForm.workerName} onChange={v => setJc('workerName', v)} placeholder="e.g. Worker 1" disabled={loading} />
            <Field label="Base Piece Rate (PKR)" id="jc-bpr" type="number" step="0.01" value={jcForm.basePieceRate} onChange={v => setJc('basePieceRate', v)} placeholder="e.g. 5.50" disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Create Job Card" icon={<FileText size={15}/>} />
        </form>
      )}

      {tab === 'phaseLog' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/assembly/phase/log', { jobCardId: plForm.jobCardId, phase: plForm.phase, piecesProcessed: parseInt(plForm.piecesProcessed), startedAt: plForm.startedAt })); }}>
          <div className="prod-form-grid">
            <Field label="Job Card ID" id="pl-jcid" value={plForm.jobCardId} onChange={v => setPl('jobCardId', v)} placeholder="UUID from job card response" disabled={loading} />
            <Field label="Phase" id="pl-phase" options={phaseOptions} value={plForm.phase} onChange={v => setPl('phase', v)} disabled={loading} />
            <Field label="Pieces Processed" id="pl-pp" type="number" value={plForm.piecesProcessed} onChange={v => setPl('piecesProcessed', v)} placeholder="e.g. 120" disabled={loading} />
            <Field label="Started At (ISO)" id="pl-sa" type="datetime-local" value={plForm.startedAt} onChange={v => setPl('startedAt', v)} disabled={loading} />
          </div>
          {wagePreview && (
            <div className="prod-alert prod-alert-info" style={{ marginBottom: '12px', fontSize: '13px' }}>
              <Zap size={14} className="prod-alert-icon"/>
              Estimated wage for this phase: <strong>PKR {wagePreview}</strong>
            </div>
          )}
          <SubmitBtn loading={loading} label="Log Phase Start" icon={<Hammer size={15}/>} />
        </form>
      )}

      {tab === 'phaseComplete' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/assembly/phase/complete', { jobCardId: pcForm.jobCardId, phase: pcForm.phase, completedAt: pcForm.completedAt })); }}>
          <div className="prod-form-grid">
            <Field label="Job Card ID" id="pc-jcid" value={pcForm.jobCardId} onChange={v => setPc('jobCardId', v)} placeholder="UUID from job card response" disabled={loading} />
            <Field label="Phase" id="pc-phase" options={phaseOptions} value={pcForm.phase} onChange={v => setPc('phase', v)} disabled={loading} />
            <Field label="Completed At (ISO)" id="pc-ca" type="datetime-local" value={pcForm.completedAt} onChange={v => setPc('completedAt', v)} disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Complete Phase & Update Wages" icon={<CheckCircle2 size={15}/>} />
        </form>
      )}

      <GateResult result={res} error={error} />
    </div>
  );
};

// GATE 6 – QC & Pre-Shipping
const Gate6QC = ({ order }) => {
  const [tab, setTab] = useState('startInspection');
  const [siForm, setSi] = useFormState({ totalCargoUnits: '' });
  const [alForm, setAl] = useFormState({ qcInspectionId: '', auditType: 'STRUCTURAL', passed: 'true', findings: '' });
  const [cqForm, setCq] = useFormState({ qcInspectionId: '', inspectedBy: '' });
  const [psForm, setPs] = useFormState({ psLogId: '', sentTo: '', sentAt: '' });
  const [apForm, setAp] = useFormState({ psLogId: '', customerApprovedBy: '', approvedAt: '' });
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null);
  const [error, setError] = useState(null);

  const call = async (fn) => {
    setLoading(true); setRes(null); setError(null);
    try { const r = await fn(); setRes(r.data); }
    catch (e) { setError(e.response?.data?.message || e.message); }
    finally { setLoading(false); }
  };

  const sampleUnits = siForm.totalCargoUnits ? Math.ceil(parseFloat(siForm.totalCargoUnits) * 0.1) : null;

  const tabs = [
    { id: 'startInspection', label: '① Start Inspection' },
    { id: 'auditLog',        label: '② Log Audit' },
    { id: 'completeQC',      label: '③ Complete QC' },
    { id: 'sendSample',      label: '④ Send PS Sample' },
    { id: 'approveSample',   label: '⑤ Approve/Reject Sample' },
    { id: 'exportValidate',  label: '⑥ Export Readiness' },
  ];

  return (
    <div>
      <div className="prod-tab-bar" style={{ flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} className={`prod-tab ${tab === t.id ? 'active' : ''}`} onClick={() => { setTab(t.id); setRes(null); setError(null); }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'startInspection' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/qc/inspection/start', { orderTokenId: order.id, totalCargoUnits: parseInt(siForm.totalCargoUnits) })); }}>
          <div className="prod-form-grid">
            <Field label="Total Cargo Units" id="si-tcu" type="number" value={siForm.totalCargoUnits} onChange={v => setSi('totalCargoUnits', v)} placeholder="e.g. 1000" disabled={loading} />
          </div>
          {sampleUnits && (
            <div className="prod-alert prod-alert-info" style={{ marginBottom: '12px', fontSize: '13px' }}>
              <Sparkles size={14} className="prod-alert-icon" />
              10% Pre-Shipping Sample = <strong>{sampleUnits} units</strong>
            </div>
          )}
          <SubmitBtn loading={loading} label="Start QC Inspection" icon={<ShieldCheck size={15}/>} />
        </form>
      )}

      {tab === 'auditLog' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/qc/audit/log', { qcInspectionId: alForm.qcInspectionId, auditType: alForm.auditType, passed: alForm.passed === 'true', findings: alForm.findings })); }}>
          <div className="prod-form-grid">
            <Field label="QC Inspection ID" id="al-qid" value={alForm.qcInspectionId} onChange={v => setAl('qcInspectionId', v)} placeholder="UUID from start inspection" disabled={loading} />
            <Field label="Audit Type" id="al-at" options={[{value:'STRUCTURAL',label:'Structural'},{value:'AESTHETIC',label:'Aesthetic'},{value:'ASEPTIC',label:'Aseptic'}]} value={alForm.auditType} onChange={v => setAl('auditType', v)} disabled={loading} />
            <Field label="Result" id="al-pass" options={[{value:'true',label:'Passed'},{value:'false',label:'Failed'}]} value={alForm.passed} onChange={v => setAl('passed', v)} disabled={loading} />
            <Field label="Findings / Notes" id="al-fn" value={alForm.findings} onChange={v => setAl('findings', v)} placeholder="All seams intact, no tears detected" disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Log Audit Entry" icon={<ClipboardCheck size={15}/>} />
        </form>
      )}

      {tab === 'completeQC' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/qc/inspection/complete', { qcInspectionId: cqForm.qcInspectionId, inspectedBy: cqForm.inspectedBy })); }}>
          <div className="prod-form-grid">
            <Field label="QC Inspection ID" id="cq-qid" value={cqForm.qcInspectionId} onChange={v => setCq('qcInspectionId', v)} placeholder="UUID from start inspection" disabled={loading} />
            <Field label="Inspected By (Email)" id="cq-ib" type="email" value={cqForm.inspectedBy} onChange={v => setCq('inspectedBy', v)} placeholder="qc_manager@fabricsync.com" disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Complete QC Inspection" icon={<ShieldCheck size={15}/>} />
        </form>
      )}

      {tab === 'sendSample' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/ps/sample/send-to-customer', { psLogId: psForm.psLogId, sentTo: psForm.sentTo, sentAt: psForm.sentAt })); }}>
          <div className="prod-form-grid">
            <Field label="PS Log ID" id="ps-lid" value={psForm.psLogId} onChange={v => setPs('psLogId', v)} placeholder="UUID from QC complete response" disabled={loading} />
            <Field label="Sent To (Customer Email)" id="ps-st" type="email" value={psForm.sentTo} onChange={v => setPs('sentTo', v)} placeholder="customer@retailchain.com" disabled={loading} />
            <Field label="Sent At (ISO)" id="ps-sa" type="datetime-local" value={psForm.sentAt} onChange={v => setPs('sentAt', v)} disabled={loading} />
          </div>
          <SubmitBtn loading={loading} label="Send Pre-Shipping Sample" icon={<Send size={15}/>} />
        </form>
      )}

      {tab === 'approveSample' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/ps/sample/approve', { psLogId: apForm.psLogId, customerApprovedBy: apForm.customerApprovedBy, approvedAt: apForm.approvedAt })); }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#10b981', fontSize: '14px' }}>Option A: Approve Sample (Move to Export Ready)</h4>
            <div className="prod-form-grid">
              <Field label="PS Log ID" id="ap-lid" value={apForm.psLogId} onChange={v => setAp('psLogId', v)} placeholder="UUID of pre-shipping log" disabled={loading} />
              <Field label="Customer Approved By (Email)" id="ap-cab" type="email" value={apForm.customerApprovedBy} onChange={v => setAp('customerApprovedBy', v)} placeholder="customer@retailchain.com" disabled={loading} />
              <Field label="Approved At (ISO)" id="ap-aa" type="datetime-local" value={apForm.approvedAt} onChange={v => setAp('approvedAt', v)} disabled={loading} />
            </div>
            <SubmitBtn loading={loading} label="Record Customer Approval" icon={<CheckCircle2 size={15}/>} />
          </form>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '5px 0' }} />

          <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/ps/sample/reject', { psLogId: apForm.psLogId })); }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#ef4444', fontSize: '14px' }}>Option B: Reject Sample (Trigger Rework / Rollback Status)</h4>
            <div className="prod-form-grid">
              <Field label="PS Log ID" id="rej-lid" value={apForm.psLogId} onChange={v => setAp('psLogId', v)} placeholder="UUID of pre-shipping log" disabled={loading} />
            </div>
            <button type="submit" className="prod-btn" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }} disabled={loading}>
              {loading ? <Loader2 size={15} className="spin" /> : <XCircle size={15} />}
              Reject Pre-Shipping Sample & Initiate Rework
            </button>
          </form>
        </div>
      )}

      {tab === 'exportValidate' && (
        <form onSubmit={e => { e.preventDefault(); call(() => api.post('/api/production/export/validate-readiness', { orderTokenId: order.id })); }}>
          <div className="prod-alert prod-alert-info" style={{ marginBottom: '16px' }}>
            <Ship size={15} className="prod-alert-icon" />
            This will validate that order <strong>{order.orderNumber}</strong> meets all export compliance requirements.
          </div>
          <SubmitBtn loading={loading} label="Validate Export Readiness" icon={<Ship size={15}/>} />
        </form>
      )}

      <GateResult result={res} error={error} />
    </div>
  );
};

// ─── Gate Config ──────────────────────────────────────────────────────────────
const GATES = [
  {
    id: 'material', label: 'Material Allocation', icon: <Package size={16}/>,
    color: '#6366f1',
    statuses: ['AUTHORIZED'],
    component: Gate1MaterialAllocation,
  },
  {
    id: 'yarn', label: 'Yarn & Fabric', icon: <Layers size={16}/>,
    color: '#10b981',
    statuses: ['MATERIAL_ALLOCATED'],
    component: Gate2YarnFabric,
  },
  {
    id: 'wet', label: 'Wet Processing', icon: <Droplets size={16}/>,
    color: '#06b6d4',
    statuses: ['WET_PROCESSING_INPROGRESS'],
    component: Gate3WetProcessing,
  },
  {
    id: 'decoration', label: 'Surface Decoration', icon: <Palette size={16}/>,
    color: '#a855f7',
    statuses: ['SURFACE_DECORATION_INPROGRESS'],
    component: Gate4Decoration,
  },
  {
    id: 'assembly', label: 'Assembly Line', icon: <Scissors size={16}/>,
    color: '#f59e0b',
    statuses: ['ASSEMBLY_INPROGRESS'],
    component: Gate5Assembly,
  },
  {
    id: 'qc', label: 'QC & Pre-Shipping', icon: <ShieldCheck size={16}/>,
    color: '#3b82f6',
    statuses: ['QC_VERIFICATION_INPROGRESS', 'PS_SAMPLE_PENDING', 'PS_APPROVED', 'EXPORT_READY'],
    component: Gate6QC,
  },
];

// ─── Pipeline Stepper ─────────────────────────────────────────────────────────
const PipelineStepper = ({ currentStatus }) => {
  const steps = STATUS_ORDER.filter(s => s !== 'PS_APPROVED');
  const currentIdx = steps.indexOf(currentStatus);

  return (
    <div className="pipeline-stepper">
      {steps.map((s, i) => {
        const meta = STATUS_META[s];
        const done = i < currentIdx;
        const active = i === currentIdx;
        const failed = currentStatus === 'FAILED';
        return (
          <React.Fragment key={s}>
            <div className={`pipeline-step ${done ? 'done' : ''} ${active ? 'active' : ''} ${failed && active ? 'failed' : ''}`}>
              <div className="pipeline-dot">
                {done ? <Check size={10}/> : failed && active ? <XCircle size={10}/> : <span>{i + 1}</span>}
              </div>
              <span className="pipeline-step-label">{meta?.label || s}</span>
            </div>
            {i < steps.length - 1 && <div className={`pipeline-connector ${i < currentIdx ? 'done' : ''}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export const ProductionDashboard = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeGate, setActiveGate] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);

  const orders = seededOrders.orders;
  const inventory = seededOrders.inventory;

  const handleSelectOrder = useCallback((order) => {
    setSelectedOrder(order);
    setOrderStatus(order.status);
    setActiveGate(null);
  }, []);

  const GateComp = activeGate ? GATES.find(g => g.id === activeGate)?.component : null;

  const isGateAccessible = (gate) => {
    if (!orderStatus) return false;
    if (orderStatus === 'FAILED') return false;
    // Gates are always accessible for all statuses to allow admin ops
    return true;
  };

  return (
    <div className="prod-dashboard">
      {/* ── Order Selector ─────────────────────────────────────── */}
      <section className="prod-section">
        <div className="prod-section-header">
          <Factory size={18} className="prod-section-icon" />
          <h2 className="prod-section-title">Production Control Center</h2>
          <span className="prod-section-subtitle">Select an order to manage its pipeline</span>
        </div>

        <div className="order-grid">
          {orders.map(order => {
            const meta = STATUS_META[order.status] || {};
            const isSelected = selectedOrder?.id === order.id;
            return (
              <button
                key={order.id}
                className={`order-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectOrder(order)}
              >
                <div className="order-card-top">
                  <span className="order-number">{order.orderNumber}</span>
                  <span className="order-status-badge" style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.color}33` }}>
                    {meta.icon} {meta.label || order.status}
                  </span>
                </div>
                <div className="order-card-bottom">
                  <span className="order-id-label">ID: {order.id.slice(0, 18)}…</span>
                  {isSelected && <span className="order-selected-chip"><Check size={11}/> Selected</span>}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Active Order Panel ─────────────────────────────────── */}
      {selectedOrder && (
        <>
          {/* Pipeline Progress */}
          <section className="prod-section">
            <div className="prod-section-header">
              <ChevronRight size={18} className="prod-section-icon" />
              <h2 className="prod-section-title">Pipeline Progress — {selectedOrder.orderNumber}</h2>
            </div>
            <PipelineStepper currentStatus={orderStatus} />
          </section>

          {/* Gate Selection */}
          <section className="prod-section">
            <div className="prod-section-header">
              <Zap size={18} className="prod-section-icon" />
              <h2 className="prod-section-title">Pipeline Gate Controls</h2>
              <span className="prod-section-subtitle">All gates are accessible for administrative operations</span>
            </div>

            <div className="gate-grid">
              {GATES.map(gate => {
                const isActive = activeGate === gate.id;
                const isCurrent = gate.statuses.includes(orderStatus);
                return (
                  <button
                    key={gate.id}
                    className={`gate-card ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                    onClick={() => setActiveGate(isActive ? null : gate.id)}
                    style={{ '--gate-color': gate.color }}
                  >
                    <div className="gate-card-icon" style={{ color: gate.color, background: `${gate.color}18` }}>
                      {gate.icon}
                    </div>
                    <span className="gate-card-label">{gate.label}</span>
                    {isCurrent && <span className="gate-current-chip">Active</span>}
                    <div className="gate-chevron">
                      {isActive ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Gate Form Panel */}
            {activeGate && GateComp && (
              <div className="gate-form-panel">
                <div className="gate-form-header" style={{ '--gate-color': GATES.find(g => g.id === activeGate)?.color }}>
                  <div className="gate-form-header-icon">
                    {GATES.find(g => g.id === activeGate)?.icon}
                  </div>
                  <h3 className="gate-form-title">{GATES.find(g => g.id === activeGate)?.label}</h3>
                  <div className="gate-form-order-badge">
                    <Factory size={12}/> {selectedOrder.orderNumber}
                  </div>
                </div>
                <div className="gate-form-body">
                  <GateComp order={selectedOrder} inventory={inventory} />
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {!selectedOrder && (
        <div className="prod-empty">
          <div className="prod-empty-icon"><Factory size={40}/></div>
          <p className="prod-empty-text">Select an order from above to start managing its production pipeline</p>
        </div>
      )}
    </div>
  );
};
