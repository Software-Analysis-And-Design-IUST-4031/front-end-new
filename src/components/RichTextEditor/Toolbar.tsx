import React from 'react';
import { EditorState } from 'draft-js';
import { Box, IconButton, Tooltip } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughIcon from '@mui/icons-material/StrikethroughS';
import HighlightIcon from '@mui/icons-material/Highlight';
import TitleIcon from '@mui/icons-material/Title';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CodeIcon from '@mui/icons-material/Code';
import FormatClearIcon from '@mui/icons-material/FormatClear';

export type TToolbarButtonSize = 'small' | 'medium' | 'large';

export interface TToolbarComponentProps {
  id: string;
  editorId: string;
  onClick?: (style: string, type: string) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  size?: TToolbarButtonSize;
  inlineMode?: boolean;
  active?: boolean;
}

export type TToolbarControl =
  | 'title'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'highlight'
  | 'link'
  | 'numberList'
  | 'bulletList'
  | 'quote'
  | 'code'
  | 'clear';

export interface TCustomControl {
  id: string;
  name: string;
  icon?: React.ComponentType;
  type: string;
  component?: React.ComponentType<any>;
  atomicComponent?: React.ComponentType<any>;
}

interface Props {
  id: string;
  editorState: EditorState;
  onClick: (style: string, type: string) => void;
  controls?: TToolbarControl[];
  isActive: boolean;
}

const CONTROLS = {
  title: {
    icon: TitleIcon,
    type: 'block',
    style: 'header-two',
    tooltip: 'Title',
  },
  bold: {
    icon: FormatBoldIcon,
    type: 'inline',
    style: 'BOLD',
    tooltip: 'Bold',
  },
  italic: {
    icon: FormatItalicIcon,
    type: 'inline',
    style: 'ITALIC',
    tooltip: 'Italic',
  },
  underline: {
    icon: FormatUnderlinedIcon,
    type: 'inline',
    style: 'UNDERLINE',
    tooltip: 'Underline',
  },
  strikethrough: {
    icon: StrikethroughIcon,
    type: 'inline',
    style: 'STRIKETHROUGH',
    tooltip: 'Strikethrough',
  },
  highlight: {
    icon: HighlightIcon,
    type: 'inline',
    style: 'HIGHLIGHT',
    tooltip: 'Highlight',
  },
  link: {
    icon: InsertLinkIcon,
    type: 'link',
    style: 'link',
    tooltip: 'Insert Link',
  },
  numberList: {
    icon: FormatListNumberedIcon,
    type: 'block',
    style: 'ordered-list-item',
    tooltip: 'Numbered List',
  },
  bulletList: {
    icon: FormatListBulletedIcon,
    type: 'block',
    style: 'unordered-list-item',
    tooltip: 'Bullet List',
  },
  quote: {
    icon: FormatQuoteIcon,
    type: 'block',
    style: 'blockquote',
    tooltip: 'Quote',
  },
  code: {
    icon: CodeIcon,
    type: 'block',
    style: 'code-block',
    tooltip: 'Code Block',
  },
  clear: {
    icon: FormatClearIcon,
    type: 'clear',
    style: 'clear',
    tooltip: 'Clear Formatting',
  },
};

const DEFAULT_CONTROLS: TToolbarControl[] = [
  'title',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'highlight',
  'link',
  'numberList',
  'bulletList',
  'quote',
  'code',
  'clear',
];

const Toolbar: React.FC<Props> = ({
  id,
  editorState,
  onClick,
  controls = DEFAULT_CONTROLS,
  isActive,
}) => {
  const currentStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const isBlockActive = (blockStyle: string) => blockType === blockStyle;
  const isInlineActive = (inlineStyle: string) => currentStyle.has(inlineStyle);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.5,
        p: 1,
        backgroundColor: 'background.paper',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {controls.map((controlName) => {
        const control = CONTROLS[controlName];
        const Icon = control.icon;
        const active =
          control.type === 'block'
            ? isBlockActive(control.style)
            : control.type === 'inline'
            ? isInlineActive(control.style)
            : false;

        return (
          <Tooltip key={controlName} title={control.tooltip}>
            <IconButton
              size="small"
              onClick={() => onClick(control.style, control.type)}
              disabled={!isActive}
              color={active ? 'primary' : 'default'}
              sx={{
                '&.Mui-disabled': {
                  color: 'text.disabled',
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Icon fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default Toolbar;
