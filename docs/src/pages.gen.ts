// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';

// prettier-ignore
import type { getConfig as File_ExamplesUseFetch_getConfig } from './pages/examples/use-fetch';
// prettier-ignore
import type { getConfig as File_Index_getConfig } from './pages/index';
// prettier-ignore
import type { getConfig as File_UtilsUtil_getConfig } from './pages/utils/[util]';

// prettier-ignore
type Page =
| ({ path: '/examples/use-fetch' } & GetConfigResponse<typeof File_ExamplesUseFetch_getConfig>)
| { path: '/examples/use-position'; render: 'dynamic' }
| ({ path: '/' } & GetConfigResponse<typeof File_Index_getConfig>)
| ({ path: '/utils/[util]' } & GetConfigResponse<typeof File_UtilsUtil_getConfig>);

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
