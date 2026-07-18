'use client';

import { ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROLES, type Role } from 'designsight-shared';

const ROLE_LABEL: Record<Role, string> = {
  designer: 'Designer',
  reviewer: 'Reviewer',
  product_manager: 'Product Manager',
  developer: 'Developer',
};

interface RoleSwitcherProps {
  value: Role;
  onChange: (role: Role) => void;
}

export function RoleSwitcher({ value, onChange }: RoleSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <User className="size-3.5" />
          {ROLE_LABEL[value]}
          <ChevronDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {ROLES.map((role) => (
          <DropdownMenuItem key={role} onSelect={() => onChange(role)}>
            {ROLE_LABEL[role]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
