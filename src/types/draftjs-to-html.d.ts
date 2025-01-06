declare module 'draftjs-to-html' {
  import { RawDraftContentState } from 'draft-js';
  export default function draftToHtml(content: RawDraftContentState): string;
} 