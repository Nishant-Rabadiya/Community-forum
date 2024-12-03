// lib/fontawesome.ts
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; // Disable automatic CSS injection

library.add(faCoffee); // Add the icons you want to use here
