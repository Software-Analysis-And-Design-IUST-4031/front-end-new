import React, { useState, useEffect, useCallback } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  DraftHandleValue,
  convertToRaw,
  convertFromRaw,
  ContentState,
  DraftStyleMap,
  Modifier,
  CompositeDecorator,
  ContentBlock,
} from 'draft-js';
import { Box, useTheme } from '@mui/material';
import Toolbar from './Toolbar';

interface Props {
  value?: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

const styleMap: DraftStyleMap = {
  'STRIKETHROUGH': {
    textDecoration: 'line-through',
  },
  'HIGHLIGHT': {
    backgroundColor: 'yellow',
  },
};

// Find and decorate links
const findLinkEntities = (contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: (props: any) => {
      const { url } = props.contentState.getEntity(props.entityKey).getData();
      return (
        <a href={url} style={{ color: 'blue', textDecoration: 'underline' }}>
          {props.children}
        </a>
      );
    },
  },
]);

const MUIRichTextEditor: React.FC<Props> = ({ value, onChange, readOnly = false }) => {
  const theme = useTheme();
  const [editorState, setEditorState] = useState(() => {
    if (value && value.trim() !== '') {
      try {
        const contentState = convertFromRaw(JSON.parse(value));
        return EditorState.createWithContent(contentState, decorator);
      } catch (error) {
        console.error('Error parsing editor content:', error);
        return EditorState.createEmpty(decorator);
      }
    }
    return EditorState.createEmpty(decorator);
  });

  const [showURLInput, setShowURLInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [urlType, setUrlType] = useState<'link' | null>(null);

  useEffect(() => {
    if (value && value.trim() !== '') {
      try {
        const contentState = convertFromRaw(JSON.parse(value));
        setEditorState(EditorState.createWithContent(contentState, decorator));
      } catch (error) {
        console.error('Error parsing editor content:', error);
      }
    }
  }, [value]);

  const handleEditorChange = useCallback((state: EditorState) => {
    setEditorState(state);
    if (onChange) {
      const content = state.getCurrentContent();
      const rawContent = convertToRaw(content);
      onChange(JSON.stringify(rawContent));
    }
  }, [onChange]);

  const handleKeyCommand = useCallback((command: string, state: EditorState): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }, [handleEditorChange]);

  const handleClearFormatting = useCallback(() => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const styles = editorState.getCurrentInlineStyle();

    let newContentState = contentState;

    // Remove inline styles
    styles.forEach((style) => {
      newContentState = Modifier.removeInlineStyle(
        newContentState,
        selection,
        style || ''
      );
    });

    // Remove block styling
    const blockType = RichUtils.getCurrentBlockType(editorState);
    if (blockType !== 'unstyled') {
      newContentState = Modifier.setBlockType(
        newContentState,
        selection,
        'unstyled'
      );
    }

    // Remove entities (links)
    newContentState = Modifier.applyEntity(
      newContentState,
      selection,
      null
    );

    handleEditorChange(
      EditorState.push(
        editorState,
        newContentState,
        'change-block-type'
      )
    );
  }, [editorState, handleEditorChange]);

  const handleToolbarClick = useCallback((style: string, type: string) => {
    if (type === 'inline') {
      handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
    } else if (type === 'block') {
      handleEditorChange(RichUtils.toggleBlockType(editorState, style));
    } else if (type === 'link') {
      const selection = editorState.getSelection();
      if (!selection.isCollapsed()) {
        setUrlType('link');
        setShowURLInput(true);
      }
    } else if (type === 'clear') {
      handleClearFormatting();
    }
  }, [editorState, handleEditorChange, handleClearFormatting]);

  const confirmLink = useCallback(() => {
    if (!urlValue.trim()) return;

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url: urlValue }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    handleEditorChange(RichUtils.toggleLink(
      newEditorState,
      newEditorState.getSelection(),
      entityKey
    ));
    setShowURLInput(false);
    setUrlValue('');
    setUrlType(null);
  }, [editorState, urlValue, handleEditorChange]);

  const mapKeyToEditorCommand = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const newEditorState = RichUtils.onTab(e, editorState, 4);
      if (newEditorState !== editorState) {
        handleEditorChange(newEditorState);
      }
      return null;
    }
    return getDefaultKeyBinding(e);
  }, [editorState, handleEditorChange]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ position: 'relative', border: `1px solid ${theme.palette.divider}`, borderRadius: 1, mb: 2 }}>
        <Toolbar
          id="rich-editor"
          editorState={editorState}
          onClick={handleToolbarClick}
          controls={[
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
            'clear'
          ]}
          isActive={true}
        />
        {showURLInput && (
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <input
              type="text"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  confirmLink();
                }
              }}
              placeholder="Enter URL and press Enter"
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '4px',
              }}
              autoFocus
            />
          </Box>
        )}
      </Box>
      <Box
        sx={{
          position: 'relative',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          p: 2,
          minHeight: '200px',
          direction: 'ltr',
          textAlign: 'left',
          '& .DraftEditor-root': {
            height: '100%',
            direction: 'ltr',
          },
          '& .public-DraftEditor-content': {
            minHeight: '200px',
            direction: 'ltr',
            unicodeBidi: 'isolate',
          },
          '& .DraftEditor-editorContainer': {
            direction: 'ltr',
          }
        }}
      >
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          spellCheck={true}
          readOnly={readOnly}
          customStyleMap={styleMap}
          textDirectionality="LTR"
          textAlignment="left"
        />
      </Box>
    </Box>
  );
};

export default MUIRichTextEditor;