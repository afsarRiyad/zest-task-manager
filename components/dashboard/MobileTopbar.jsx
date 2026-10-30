'use client';

import Logo from '@/components/Logo';
import Icon from '@/components/Icon';
import ProfileMenu from '@/components/dashboard/ProfileMenu';

export default function MobileTopbar({ user, onOpenInsights, onSettings, onSignOut }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 backdrop-blur-2xl lg:hidden">
      <div className="mx-auto flex h-16 max-w-[860px] items-center justify-between px-4 sm:px-6">
        <Logo size="md" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenInsights}
            aria-label="Open your rhythm"
            className="icon-btn"
          >
            <Icon name="panelRight" size={18} />
          </button>

          <ProfileMenu
            user={user}
            onSettings={onSettings}
            onSignOut={onSignOut}
            compact
            placement="bottom"
          />
        </div>
      </div>
    </header>
  );
}
