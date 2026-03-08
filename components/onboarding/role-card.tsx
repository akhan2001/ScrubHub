'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { RoleConfig } from '@/lib/roles';

interface RoleCardBaseProps {
  role: RoleConfig;
  isActive?: boolean;
  footer?: React.ReactNode;
}

interface RoleCardButtonProps extends RoleCardBaseProps {
  as: 'button';
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  href?: never;
}

interface RoleCardLinkProps extends RoleCardBaseProps {
  as: 'link';
  href: string;
  onClick?: never;
  disabled?: never;
  isLoading?: never;
}

interface RoleCardDivProps extends RoleCardBaseProps {
  as?: 'div';
  href?: never;
  onClick?: never;
  disabled?: never;
  isLoading?: never;
}

export type RoleCardProps = RoleCardButtonProps | RoleCardLinkProps | RoleCardDivProps;

function RoleCardContent({
  role,
  isActive,
  footer,
  isLoading,
}: RoleCardBaseProps & { isLoading?: boolean }) {
  const Icon = role.icon;
  return (
    <>
      <div
        className={cn(
          'mb-4 flex size-11 items-center justify-center rounded-lg transition-colors',
          role.iconBg
        )}
      >
        <Icon className={cn('size-5', role.iconColor)} />
      </div>

      <h2 className="text-base font-semibold text-foreground">{role.title}</h2>

      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {role.description}
      </p>

      {footer ?? (
        <div className="mt-auto pt-4">
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
              role.accent
            )}
          >
            {role.pricing}
          </span>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-card/80 backdrop-blur-[1px]">
          <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
        </div>
      )}
    </>
  );
}

export function RoleCard(props: RoleCardProps) {
  const { role, isActive = false, footer } = props;
  const Icon = role.icon;

  const isInteractive = props.as === 'button' || props.as === 'link';
  const baseClasses = cn(
    'group relative flex flex-col items-start rounded-xl border-2 bg-card p-5 text-left',
    'transition-all duration-200 ease-out',
    isInteractive && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5',
    'focus-visible:outline-none focus-visible:ring-2',
    role.ring,
    isActive ? `${role.border} shadow-md -translate-y-0.5` : 'border-border'
  );

  if (props.as === 'button') {
    return (
      <button
        type="button"
        disabled={props.disabled}
        onClick={props.onClick}
        className={cn(baseClasses, props.disabled && 'pointer-events-none')}
      >
        <RoleCardContent
          role={role}
          isActive={isActive}
          footer={footer}
          isLoading={props.isLoading}
        />
      </button>
    );
  }

  if (props.as === 'link') {
    return (
      <Link href={props.href} className={baseClasses}>
        <RoleCardContent role={role} isActive={isActive} footer={footer} />
      </Link>
    );
  }

  return (
    <div className={baseClasses}>
      <RoleCardContent role={role} isActive={isActive} footer={footer} />
    </div>
  );
}
