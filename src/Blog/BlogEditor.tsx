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
import { EditorState, convertToRaw } from 'draft-js';
import { Editor as DraftEditor } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { css } from '@emotion/css';
import isHotkey from 'is-hotkey';

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
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

  const toggleMark = (format: string) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = contentState.getSelection();
    const newContentState = Modifier.applyMark(contentState, selectionState, {
      [format]: true,
    });
    setEditorState(newContentState);
  };

  // Custom components for the editor
  const ToolbarButton: React.FC<ToolbarButtonProps> = ({ format, icon, tooltip }) => {
    const isMarkActive = (format: string) => {
      const contentState = editorState.getCurrentContent();
      const selectionState = contentState.getSelection();
      const marks = contentState.getEditorState().getCurrentContent().getPlainText().marks;
      return marks && marks.has(format);
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
              const isActive = isMarkActive(format);
              const contentState = editorState.getCurrentContent();
              const selectionState = contentState.getSelection();
              const newContentState = Modifier.applyInlineStyle(contentState, selectionState, {
                [format]: isActive,
              });
              setEditorState(newContentState);
            }
          }}
          sx={{
            color: isMarkActive(format) ? 'primary.main' : 'text.secondary',
          }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
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

    const contentState = editorState.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));

    // TODO: Submit the question to your backend
    console.log({ title, content: rawContent, tags });
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
          '& .DraftEditor-root': {
            minHeight: '400px',
            border: '1px solid #e0e0e0',
            padding: '1rem',
            borderRadius: '4px',
            backgroundColor: '#fff',
          }
        }}>
          <DraftEditor
            editorState={editorState}
            onChange={setEditorState}
            placeholder="Write your question here..."
            // Add custom styling or toolbars as needed
          />
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
