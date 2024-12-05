import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  Chip,
  Autocomplete,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Code,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
} from '@mui/icons-material';
import {
  createEditor,
  Descendant,
  Element as SlateElement,
  Editor,
  Transforms,
  BaseEditor,
  Text,
} from 'slate';
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  ReactEditor,
} from 'slate-react';
import { withHistory, HistoryEditor } from 'slate-history';
import { css } from '@emotion/css';
import isHotkey from 'is-hotkey';

// Custom types for Slate
type CustomElement = {
  type: 'paragraph' | 'code' | 'quote' | 'bulleted-list' | 'numbered-list' | 'list-item';
  children: CustomText[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
} as const;

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

interface ToolbarButtonProps {
  format: string;
  icon: React.ReactElement;
  tooltip: string;
}

const BlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState('');
  const editor = withHistory(withReact(createEditor()));

  // Initialize editor value
  const [value, setValue] = useState<Descendant[]>(initialValue);

  // Save content to localStorage whenever it changes
  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
    localStorage.setItem('content', JSON.stringify(newValue));
  };

  const toggleMark = (format: string) => {
    const marks = Editor.marks(editor) ?? {};
    const isActive = marks[format as keyof Omit<CustomText, 'text'>] === true;
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  // Custom components for the editor
  const ToolbarButton: React.FC<ToolbarButtonProps> = ({ format, icon, tooltip }) => {
    const editor = useSlate();

    const isBlockActive = (format: string) => {
      const [match] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
      }) ?? [false];
      return !!match;
    };

    const isMarkActive = (format: string) => {
      const marks = Editor.marks(editor) ?? {};
      return marks[format as keyof Omit<CustomText, 'text'>] === true;
    };

    return (
      <Tooltip title={tooltip}>
        <IconButton
          size="small"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            if (['bold', 'italic', 'underline', 'code'].includes(format)) {
              toggleMark(format);
            } else {
              const isActive = isBlockActive(format);
              Transforms.setNodes(
                editor,
                { type: isActive ? 'paragraph' : format as CustomElement['type'] },
                { match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
              );
            }
          }}
          sx={{
            color: (isBlockActive(format) || isMarkActive(format)) ? 'primary.main' : 'text.secondary',
          }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  };

  const renderElement = (props: any) => {
    const { attributes, children, element } = props;
    switch (element.type) {
      case 'code':
        return (
          <pre {...attributes} style={{ 
            backgroundColor: '#f6f8fa',
            padding: '1rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}>
            <code>{children}</code>
          </pre>
        );
      case 'quote':
        return (
          <blockquote
            {...attributes}
            style={{
              borderLeft: '4px solid #ddd',
              marginLeft: 0,
              marginRight: 0,
              paddingLeft: '1rem',
              color: '#666',
            }}
          >
            {children}
          </blockquote>
        );
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      default:
        return <p {...attributes}>{children}</p>;
    }
  };

  const renderLeaf = (props: any) => {
    const { attributes, children, leaf } = props;
    let result = children;

    if (leaf.bold) {
      result = <strong>{result}</strong>;
    }
    if (leaf.italic) {
      result = <em>{result}</em>;
    }
    if (leaf.underline) {
      result = <u>{result}</u>;
    }
    if (leaf.code) {
      result = <code style={{ backgroundColor: '#f6f8fa', padding: '0.2em 0.4em', borderRadius: '3px' }}>{result}</code>;
    }

    return <span {...attributes}>{result}</span>;
  };

  const suggestedTags = [
    'javascript', 'react', 'node.js', 'python', 'java', 'css', 'html', 'typescript',
    'angular', 'vue.js', 'mongodb', 'sql', 'docker', 'kubernetes', 'aws', 'azure'
  ];

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (tags.length === 0) {
      setError('Please add at least one tag');
      return;
    }

    // TODO: Submit the question to your backend
    console.log({ title, content: value, tags });
    navigate('/blog');
  };

  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard this question?')) {
      navigate('/blog');
    }
  };

  const customStyles = `
    .ql-editor {
      min-height: 400px !important;
    }
    .ql-editor img {
      max-width: 250px !important;
      max-height: 200px !important;
      width: auto !important;
      height: auto !important;
      display: block;
      margin: 20px auto;
      position: relative;
      z-index: 1;
      object-fit: contain;
    }
    .ql-editor img:hover {
      cursor: pointer;
      opacity: 0.95;
    }
    .ql-editor p {
      position: relative;
      z-index: 2;
      margin: 1em 0;
      min-height: 1.5em;
    }
    .ql-editor * {
      pointer-events: auto;
    }
    .ql-container {
      overflow: visible;
    }
  `;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Ask a Question
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Writing a good question
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Steps to write a good question:
          <ul>
            <li>Summarize your problem in a one-line title</li>
            <li>Describe your problem in detail</li>
            <li>Describe what you've tried and what you expected to happen</li>
            <li>Add "tags" which help surface your question to members of the community</li>
            <li>Review your question and post it to the site</li>
          </ul>
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Title
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Be specific and imagine you're asking a question to another person.
        </Typography>
        <TextField
          fullWidth
          placeholder="e.g. How to implement JWT authentication in React?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Typography variant="h6" gutterBottom>
          Body
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Include all the information someone would need to answer your question.
        </Typography>
        
        <Box sx={{ 
          mt: 2,
          '& .ql-editor': {
            minHeight: '400px',
            '& img': {
              maxWidth: '100%',
              height: 'auto !important',
              display: 'block',
              margin: '1rem 0',
              clear: 'both',
            },
            '& p': {
              marginBottom: '1rem',
              position: 'relative',
              zIndex: 1
            }
          },
          '& .ql-container': {
            fontSize: '1rem',
            position: 'relative',
            zIndex: 1
          },
          '& .ql-toolbar': {
            position: 'sticky',
            top: 0,
            zIndex: 2,
            backgroundColor: 'white',
            borderColor: 'divider'
          }
        }}>
          <Paper 
            variant="outlined" 
            sx={{ 
              minHeight: '300px',
              backgroundColor: '#fff',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'text.secondary',
              },
              '&:focus-within': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <style>{customStyles}</style>
              <Slate 
                editor={editor} 
                initialValue={value}
                onChange={handleChange}
              >
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  placeholder="Write your question here..."
                  spellCheck
                  onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                    for (const hotkey in HOTKEYS) {
                      if (isHotkey(hotkey, event)) {
                        event.preventDefault();
                        const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
                        toggleMark(mark);
                      }
                    }
                  }}
                  style={{
                    minHeight: '300px',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    padding: '1rem',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    backgroundColor: '#ffffff',
                    cursor: 'text'
                  }}
                />
              </Slate>
            </Box>
          </Paper>
        </Box>

        <Typography variant="h6" gutterBottom>
          Tags
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Add up to 5 tags to describe what your question is about.
        </Typography>
        <Autocomplete
          multiple
          options={suggestedTags}
          value={tags}
          onChange={(_, newValue) => setTags(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                label={option}
                sx={{
                  bgcolor: '#e1ecf4',
                  color: '#39739d',
                  '&:hover': { bgcolor: '#d0e3f1' },
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="e.g. (react typescript authentication)"
            />
          )}
          sx={{ mb: 3 }}
        />
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleDiscard}
        >
          Discard
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: '#0a95ff',
            '&:hover': { bgcolor: '#0074cc' },
            color: 'white',
          }}
        >
          Post your question
        </Button>
      </Box>
    </Container>
  );
};

export default BlogEditor;
