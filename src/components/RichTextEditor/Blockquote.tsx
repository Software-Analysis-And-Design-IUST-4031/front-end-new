import React from 'react'
import { styled } from '@mui/material/styles'

interface IBlockquoteProps {
    children: React.ReactNode
}

const StyledBlockquote = styled('blockquote')(({ theme }) => ({
    borderLeft: `3px solid ${theme.palette.divider}`,
    margin: '16px 0',
    padding: '0 0 0 16px',
    color: theme.palette.text.secondary,
    '& p': {
        fontSize: '1.1em',
        lineHeight: 1.6,
    },
}))

const Blockquote: React.FC<IBlockquoteProps> = (props) => {
    return <StyledBlockquote>{props.children}</StyledBlockquote>
}

export default Blockquote
