import { stripTrailingSlash } from "@/lib/utils";
export const BASE_API_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_API_URL || ""
);
export const MAP_BOX_BASE_API_URL = stripTrailingSlash(
        process.env.NEXT_PUBLIC_MAPBOX_URL || ""
      );

export const MAP_BOX_SUGGESTIONS = `${MAP_BOX_BASE_API_URL}/search/searchbox/v1/suggest`;
export const MAP_BOX_SEARCH = `${MAP_BOX_BASE_API_URL}/search/searchbox/v1/retrieve`;
