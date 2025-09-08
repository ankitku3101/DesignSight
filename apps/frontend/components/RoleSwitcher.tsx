// components/RoleSwitcher.tsx
'use client';
type Roles = 'designer' | 'reviewer' | 'product_manager' | 'developer';
const roles: Roles[] = ['designer', 'reviewer', 'product_manager', 'developer'];

export default function RoleSwitcher({ value, onChange }: { value: string; onChange: (r: string) => void }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Role</span>
      <select value={value} onChange={e => onChange(e.target.value)} className="rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60">
        {roles.map(r => <option key={r}>{r}</option>)}
      </select>
    </div>
  );
}
