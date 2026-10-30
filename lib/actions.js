import { createAction } from '@reduxjs/toolkit';

// one action both slices answer so saved state can replace what's in memory
export const hydrate = createAction('app/hydrate');
