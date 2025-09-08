// components/RoleSwitcher.tsx
'use client';
type Roles = 'designer' | 'reviewer' | 'product_manager' | 'developer';
const roles: Roles[] = ['designer', 'reviewer', 'product_manager', 'developer'];

export default function RoleSwitcher({ value, onChange }: { value: string; onChange: (r: string) => void }) {
  return (
    <div className="mb-3">
      <label className="mr-2">Role: </label>
      <select value={value} onChange={e => onChange(e.target.value)} className="border px-2 py-1 rounded">
        {roles.map(r => <option key={r}>{r}</option>)}
      </select>
    </div>
  );
}
