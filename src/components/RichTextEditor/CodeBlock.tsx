import React from 'react'
import { styled } from '@mui/material/styles'

interface ICodeBlockProps {
    children: React.ReactNode
}

const StyledPre = styled('pre')(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(0, 0, 0, 0.05)',
    borderRadius: theme.shape.borderRadius,
    padding: '16px',
    margin: '16px 0',
    overflowX: 'auto',
    '& code': {
        fontFamily: 'monospace',
        fontSize: '0.9em',
        color: theme.palette.mode === 'dark' 
            ? theme.palette.primary.light 
            : theme.palette.primary.dark,
    },
}))

const CodeBlock: React.FC<ICodeBlockProps> = (props) => {
    return (
        <StyledPre>
            <code>{props.children}</code>
        </StyledPre>
    )
}

export default CodeBlock
