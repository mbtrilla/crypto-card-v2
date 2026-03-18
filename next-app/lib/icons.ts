/**
 * Font Awesome icon library — tree-shaken.
 * Only the icons imported here end up in the bundle (~2-3 KB total)
 * instead of the full 60 KB+ CDN stylesheet + web-fonts.
 *
 * Usage: import this module once in the root layout, then use
 * <FontAwesomeIcon icon={faChevronDown} /> in any component.
 */
import { library } from '@fortawesome/fontawesome-svg-core';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Prevent FA from auto-injecting CSS (we import it above as a module)
config.autoAddCss = false;

import {
  faSearch,
  faChevronDown,
  faGhost,
  faFlagUsa,
  faEarthEurope,
  faEarthAsia,
  faEarthOceania,
  faEarthAmericas,
  faCreditCard,
  faCircleDot,
  faKey,
  faPercent,
  faSterlingSign,
  faLeaf,
  faMagnifyingGlass,
  faScaleBalanced,
  faShieldHalved,
  faArrowLeft,
  faArrowRight,
  faExternalLink,
  faMoneyBillTransfer,
  faStar,
  faCoins,
  faCircleCheck,
  faCircleXmark,
  faTriangleExclamation,
  faClipboardList,
  faCircleQuestion,
  faPlus,
  faMinus,
  faCheck,
  faLink,
  faBullseye,
  faClipboardCheck,
  faDatabase,
  faRotate,
  faCircleInfo,
  faUsers,
  faEnvelope,
  faEnvelopeOpenText,
  faCalculator,
  faEarthAfrica,
  faMosque,
  faMobileScreen,
  faIdCard,
  faHandHoldingDollar,
} from '@fortawesome/free-solid-svg-icons';

import {
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';

library.add(
  faSearch,
  faChevronDown,
  faGhost,
  faFlagUsa,
  faEarthEurope,
  faEarthAsia,
  faEarthOceania,
  faEarthAmericas,
  faCreditCard,
  faCircleDot,
  faKey,
  faPercent,
  faSterlingSign,
  faLeaf,
  faMagnifyingGlass,
  faScaleBalanced,
  faShieldHalved,
  faArrowLeft,
  faArrowRight,
  faExternalLink,
  faMoneyBillTransfer,
  faStar,
  faCoins,
  faCircleCheck,
  faCircleXmark,
  faTriangleExclamation,
  faClipboardList,
  faCircleQuestion,
  faPlus,
  faMinus,
  faCheck,
  faLink,
  faBullseye,
  faClipboardCheck,
  faDatabase,
  faRotate,
  faCircleInfo,
  faUsers,
  faEnvelope,
  faEnvelopeOpenText,
  faCalculator,
  faEarthAfrica,
  faMosque,
  faMobileScreen,
  faIdCard,
  faHandHoldingDollar,
  faLinkedin,
);
