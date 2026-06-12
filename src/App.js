import { useState } from 'react';

const icons = {
  timetable: (active, color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="8" y1="4" x2="8" y2="9"/>
      <line x1="16" y1="4" x2="16" y2="9"/>
      <line x1="7" y1="14" x2="17" y2="14"/>
      <line x1="7" y1="18" x2="13" y2="18"/>
    </svg>
  ),
  driving: (active, color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3v-5l2.5-5h11L19 12v5h-2"/>
      <circle cx="7.5" cy="17" r="1.5"/>
      <circle cx="16.5" cy="17" r="1.5"/>
      <line x1="9" y1="17" x2="15" y2="17"/>
      <line x1="3" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  task: (active, color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2"/>
      <line x1="8" y1="8" x2="16" y2="8"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
      <line x1="8" y1="16" x2="12" y2="16"/>
    </svg>
  ),
  settings: (active, color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
};

const COLORS = [
  { id: 'red',    hex: '#ef4444' },
  { id: 'orange', hex: '#f97316' },
  { id: 'yellow', hex: '#eab308' },
  { id: 'green',  hex: '#22c55e' },
  { id: 'blue',   hex: '#3b82f6' },
  { id: 'purple', hex: '#a855f7' },
];

const DAYS = ['月', '火', '水', '木', '金'];
const PERIODS = [
  { label: '1限', time: '9:00〜10:40' },
  { label: '2限', time: '10:55〜12:35' },
  { label: '3限', time: '13:25〜15:05' },
  { label: '4限', time: '15:20〜17:00' },
  { label: '5限', time: '17:15〜18:55' },
  { label: '6限', time: '19:05〜20:45' },
];

function formatDeadline(dt) {
  if (!dt) return '';
  const d = new Date(dt);
  const now = new Date();
  const diff = d - now;
  const days = Math.floor(diff / 86400000);
  if (diff < 0) return '期限切れ';
  if (days === 0) return '今日まで';
  if (days === 1) return '明日まで';
  return `${days}日後`;
}

function formatDrivingDate(dt) {
  if (!dt) return '';
  const d = new Date(dt);
  const now = new Date();
  const diff = d - now;
  const days = Math.floor(diff / 86400000);
  const dateStr = d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' });
  const timeStr = d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  let badge = '';
  if (diff < 0) badge = '終了';
  else if (days === 0) badge = '今日';
  else if (days === 1) badge = '明日';
  else badge = `${days}日後`;
  return { dateStr, timeStr, badge, isPast: diff < 0 };
}

function AddTaskModal({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [color, setColor] = useState(COLORS[4].id);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({ id: Date.now(), title: title.trim(), deadline: date ? `${date}T${time || '23:59'}` : null, color, done: false });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
      <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '17px', fontWeight: '600' }}>タスクを追加</span>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer', color: '#aaa' }}>✕</button>
        </div>
        <input placeholder="タスク名" value={title} onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e5e5', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' }} />
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e5e5e5', fontSize: '14px', outline: 'none' }} />
          <input type="time" value={time} onChange={e => setTime(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e5e5e5', fontSize: '14px', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          {COLORS.map(c => (
            <button key={c.id} onClick={() => setColor(c.id)} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: c.hex, border: color === c.id ? '3px solid #000' : '3px solid transparent', cursor: 'pointer', outline: 'none' }} />
          ))}
        </div>
        <button onClick={handleSubmit} style={{ width: '100%', padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>追加</button>
      </div>
    </div>
  );
}

function TaskPage({ tasks, onAdd, onToggle, onDelete, theme }) {
  const [showModal, setShowModal] = useState(false);
  const colorHex = (id) => COLORS.find(c => c.id === id)?.hex ?? '#aaa';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: 'calc(1em + 9px)', fontWeight: '600', margin: 0, letterSpacing: '-0.5px' }}>タスク</h2>
        <button onClick={() => setShowModal(true)} style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: theme.accent, color: theme.bg, border: 'none', fontSize: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      </div>
      {tasks.length === 0 && <p style={{ color: theme.muted, fontSize: 'inherit', textAlign: 'center', marginTop: '60px' }}>タスクがありません</p>}
      {tasks.map(task => (
        <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ width: '4px', height: '44px', borderRadius: '2px', backgroundColor: colorHex(task.color), flexShrink: 0 }} />
          <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onToggle(task.id)}>
            <div style={{ fontSize: 'inherit', fontWeight: '500', color: task.done ? theme.muted : theme.text, textDecoration: task.done ? 'line-through' : 'none' }}>{task.title}</div>
            {task.deadline && (
              <div style={{ fontSize: '12px', color: task.done ? theme.muted : theme.sub, marginTop: '2px' }}>
                {new Date(task.deadline).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}　{formatDeadline(task.deadline)}
              </div>
            )}
          </div>
          <button onClick={() => onDelete(task.id)} style={{ border: 'none', background: 'none', color: theme.muted, fontSize: '18px', cursor: 'pointer' }}>✕</button>
        </div>
      ))}
      {showModal && <AddTaskModal onAdd={onAdd} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function ClassModal({ day, period, existing, onSave, onDelete, onClose }) {
  const [name, setName] = useState(existing?.name || '');
  const [room, setRoom] = useState(existing?.room || '');
  const [color, setColor] = useState(existing?.color || COLORS[4].id);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), room: room.trim(), color });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
      <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '17px', fontWeight: '600' }}>{day}曜 {period.label}</span>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer', color: '#aaa' }}>✕</button>
        </div>
        <p style={{ fontSize: '12px', color: '#aaa', margin: '0 0 16px' }}>{period.time}</p>
        <input placeholder="授業名" value={name} onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e5e5', fontSize: '15px', marginBottom: '10px', boxSizing: 'border-box', outline: 'none' }} />
        <input placeholder="教室（例：A棟301）" value={room} onChange={e => setRoom(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e5e5', fontSize: '15px', marginBottom: '16px', boxSizing: 'border-box', outline: 'none' }} />
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          {COLORS.map(c => (
            <button key={c.id} onClick={() => setColor(c.id)} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: c.hex, border: color === c.id ? '3px solid #000' : '3px solid transparent', cursor: 'pointer', outline: 'none' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {existing && (
            <button onClick={() => { onDelete(); onClose(); }} style={{ flex: 1, padding: '14px', backgroundColor: '#f5f5f5', color: '#999', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>削除</button>
          )}
          <button onClick={handleSave} style={{ flex: 2, padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>保存</button>
        </div>
      </div>
    </div>
  );
}

function TimetablePage({ timetable, onUpdate, theme }) {
  const [modal, setModal] = useState(null);
  const colorHex = (id) => COLORS.find(c => c.id === id)?.hex ?? '#e5e5e5';
  const getClass = (day, period) => timetable[`${day}-${period}`];
  const today = ['日', '月', '火', '水', '木', '金', '土'][new Date().getDay()];

  return (
    <div>
      <h2 style={{ fontSize: 'calc(1em + 9px)', fontWeight: '600', margin: '0 0 16px', letterSpacing: '-0.5px' }}>時間割</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '36px', padding: '4px', fontSize: '11px', color: theme.sub, fontWeight: '400' }}></th>
              {DAYS.map(d => (
                <th key={d} style={{ padding: '4px 2px', fontSize: '13px', fontWeight: d === today ? '700' : '400', color: d === today ? theme.text : theme.sub, textAlign: 'center' }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((period, pi) => (
              <tr key={pi}>
                <td style={{ textAlign: 'center', fontSize: '10px', color: theme.sub, paddingRight: '4px', verticalAlign: 'middle', minWidth: '28px' }}>
                  <div style={{ fontWeight: '600', color: theme.text }}>{pi + 1}</div>
                  <div style={{ fontSize: '8px', color: theme.muted, marginTop: '2px', lineHeight: 1.3 }}>{period.time.replace('〜', '\n')}</div>
                </td>
                {DAYS.map((day, di) => {
                  const cls = getClass(di, pi);
                  return (
                    <td key={di} style={{ padding: '2px' }}>
                      <div onClick={() => setModal({ day, dayIndex: di, period, periodIndex: pi })}
                        style={{ height: '56px', borderRadius: '8px', cursor: 'pointer', backgroundColor: cls ? `${colorHex(cls.color)}22` : theme.surface, borderLeft: cls ? `3px solid ${colorHex(cls.color)}` : '3px solid transparent', padding: '4px 6px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {cls ? (
                          <>
                            <div style={{ fontSize: '10px', fontWeight: '600', color: theme.text, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{cls.name}</div>
                            {cls.room && <div style={{ fontSize: '9px', color: theme.sub, marginTop: '2px' }}>{cls.room}</div>}
                          </>
                        ) : (
                          <div style={{ fontSize: '16px', color: theme.muted, textAlign: 'center' }}>+</div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <ClassModal day={modal.day} period={modal.period} existing={getClass(modal.dayIndex, modal.periodIndex)}
          onSave={(cls) => onUpdate(modal.dayIndex, modal.periodIndex, cls)}
          onDelete={() => onUpdate(modal.dayIndex, modal.periodIndex, null)}
          onClose={() => setModal(null)} />
      )}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0', borderRadius: '10px', padding: '3px', marginBottom: '16px' }}>
      {['学科', '技能'].map(label => (
        <button key={label} onClick={() => onChange(label)} style={{
          flex: 1, padding: '8px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
          backgroundColor: value === label ? '#fff' : 'transparent',
          color: value === label ? '#000' : '#aaa',
          boxShadow: value === label ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.15s',
        }}>{label}</button>
      ))}
    </div>
  );
}

function AddDrivingModal({ onAdd, onClose }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [memo, setMemo] = useState('');
  const [type, setType] = useState('技能');

  const handleSubmit = () => {
    if (!date || !time) return;
    onAdd({ id: Date.now(), datetime: `${date}T${time}`, memo: memo.trim(), type });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
      <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '17px', fontWeight: '600' }}>教習を追加</span>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer', color: '#aaa' }}>✕</button>
        </div>
        <Toggle value={type} onChange={setType} />
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e5e5e5', fontSize: '14px', outline: 'none' }} />
          <input type="time" value={time} onChange={e => setTime(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e5e5e5', fontSize: '14px', outline: 'none' }} />
        </div>
        <input placeholder="メモ（例：第1段階 みきわめ）" value={memo} onChange={e => setMemo(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e5e5', fontSize: '15px', marginBottom: '24px', boxSizing: 'border-box', outline: 'none' }} />
        <button onClick={handleSubmit} style={{ width: '100%', padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>追加</button>
      </div>
    </div>
  );
}

function SettingsPage({ dark, setDark, fontSize, setFontSize, theme }) {
  const Row = ({ label, children }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${theme.border}` }}>
      <span style={{ fontSize: 'inherit', color: theme.text }}>{label}</span>
      {children}
    </div>
  );

  const Switch = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{ width: '48px', height: '28px', borderRadius: '14px', backgroundColor: value ? '#000' : '#ddd', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
      <div style={{ position: 'absolute', top: '3px', left: value ? '23px' : '3px', width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize: 'calc(1em + 9px)', fontWeight: '600', margin: '0 0 20px', letterSpacing: '-0.5px', color: theme.text }}>設定</h2>
      <p style={{ fontSize: '11px', color: theme.sub, margin: '0 0 4px', fontWeight: '600', letterSpacing: '0.05em' }}>外観</p>
      <Row label="ダークモード">
        <Switch value={dark} onChange={setDark} />
      </Row>
      <Row label="文字サイズ">
        <div style={{ display: 'flex', backgroundColor: theme.surface, borderRadius: '10px', padding: '3px', gap: '2px' }}>
          {[['small', '小'], ['medium', '中'], ['large', '大']].map(([val, label]) => (
            <button key={val} onClick={() => setFontSize(val)} style={{
              padding: '6px 14px', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
              backgroundColor: fontSize === val ? (dark ? '#fff' : '#000') : 'transparent',
              color: fontSize === val ? (dark ? '#000' : '#fff') : theme.sub,
              fontWeight: fontSize === val ? '600' : '400',
              transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>
      </Row>
    </div>
  );
}

function DrivingPage({ sessions, onAdd, onDelete, theme }) {
  const [showModal, setShowModal] = useState(false);

  const upcoming = sessions.filter(s => new Date(s.datetime) >= new Date()).sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  const past = sessions.filter(s => new Date(s.datetime) < new Date()).sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

  const SessionItem = ({ s }) => {
    const { dateStr, timeStr, badge, isPast } = formatDrivingDate(s.datetime);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: `1px solid ${theme.border}`, opacity: isPast ? 0.4 : 1 }}>
        <div style={{ width: '4px', height: '44px', borderRadius: '2px', backgroundColor: isPast ? theme.muted : theme.accent, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: 'inherit', fontWeight: '500', color: theme.text }}>{s.type}教習</span>
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', backgroundColor: isPast ? theme.surface : theme.accent, color: isPast ? theme.sub : theme.bg }}>{badge}</span>
          </div>
          <div style={{ fontSize: '12px', color: theme.sub, marginTop: '2px' }}>{dateStr}　{timeStr}</div>
          {s.memo && <div style={{ fontSize: '12px', color: theme.muted, marginTop: '2px' }}>{s.memo}</div>}
        </div>
        <button onClick={() => onDelete(s.id)} style={{ border: 'none', background: 'none', color: theme.muted, fontSize: '18px', cursor: 'pointer' }}>✕</button>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: 'calc(1em + 9px)', fontWeight: '600', margin: 0, letterSpacing: '-0.5px' }}>教習</h2>
        <button onClick={() => setShowModal(true)} style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: theme.accent, color: theme.bg, border: 'none', fontSize: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      </div>
      {sessions.length === 0 && <p style={{ color: theme.muted, fontSize: 'inherit', textAlign: 'center', marginTop: '60px' }}>教習の予定がありません</p>}
      {upcoming.length > 0 && (
        <>
          <p style={{ fontSize: '12px', color: theme.sub, margin: '0 0 4px', fontWeight: '600', letterSpacing: '0.05em' }}>予定</p>
          {upcoming.map(s => <SessionItem key={s.id} s={s} />)}
        </>
      )}
      {past.length > 0 && (
        <>
          <p style={{ fontSize: '12px', color: theme.sub, margin: '20px 0 4px', fontWeight: '600', letterSpacing: '0.05em' }}>過去</p>
          {past.map(s => <SessionItem key={s.id} s={s} />)}
        </>
      )}
      {showModal && <AddDrivingModal onAdd={onAdd} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function App() {
  const [page, setPage] = useState('task');
  const [tasks, setTasks] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [drivingSessions, setDrivingSessions] = useState([]);
  const [dark, setDark] = useState(false);
  const [fontSize, setFontSize] = useState('medium');

  const theme = {
    bg: dark ? '#111' : '#fff',
    surface: dark ? '#1e1e1e' : '#f7f7f7',
    border: dark ? '#2e2e2e' : '#e5e5e5',
    text: dark ? '#f0f0f0' : '#111',
    sub: dark ? '#888' : '#999',
    muted: dark ? '#555' : '#bbb',
    accent: dark ? '#fff' : '#000',
  };

  const fs = { small: 13, medium: 15, large: 17 }[fontSize];

  const addTask = (task) => setTasks(prev =>
    [...prev, task].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    })
  );
  const toggleDone = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const updateTimetable = (day, period, cls) => {
    const key = `${day}-${period}`;
    setTimetable(prev => { const next = { ...prev }; if (cls) next[key] = cls; else delete next[key]; return next; });
  };
  const addDriving = (s) => setDrivingSessions(prev => prev.concat(s));
  const deleteDriving = (id) => setDrivingSessions(prev => prev.filter(s => s.id !== id));

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', maxWidth: '480px', margin: '0 auto', backgroundColor: theme.bg, color: theme.text }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', paddingBottom: '90px', fontSize: `${fs}px` }}>
        {page === 'task'      && <TaskPage tasks={tasks} onAdd={addTask} onToggle={toggleDone} onDelete={deleteTask} theme={theme} />}
        {page === 'timetable' && <TimetablePage timetable={timetable} onUpdate={updateTimetable} theme={theme} />}
        {page === 'driving'   && <DrivingPage sessions={drivingSessions} onAdd={addDriving} onDelete={deleteDriving} theme={theme} />}
        {page === 'settings'  && <SettingsPage dark={dark} setDark={setDark} fontSize={fontSize} setFontSize={setFontSize} theme={theme} />}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', display: 'flex', borderTop: `1px solid ${theme.border}`, backgroundColor: theme.bg }}>
        {[
          { id: 'timetable', label: '時間割' },
          { id: 'driving',   label: '教習' },
          { id: 'task',      label: 'タスク' },
          { id: 'settings',  label: '設定' },
        ].map(item => {
          const active = page === item.id;
          const iconColor = active ? (dark ? '#ccc' : '#000') : '#aaa';
          return (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ flex: 1, padding: '12px 0 10px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              {icons[item.id](active, iconColor)}
              <span style={{ fontSize: '10px', color: iconColor, letterSpacing: '0.02em' }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default App; 