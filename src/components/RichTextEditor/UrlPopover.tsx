import React, { useState } from 'react'
import {
    Popover,
    TextField,
    Button,
    Box,
} from '@mui/material'
import { styled } from '@mui/material/styles'

interface IUrlPopoverProps {
    anchor?: HTMLElement
    onSubmit: (url: string) => void
    onCancel: () => void
}

const StyledPopover = styled(Popover)(({ theme }) => ({
    '& .MuiPopover-paper': {
        padding: theme.spacing(2),
        minWidth: 300,
    },
}))

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
}))

const UrlPopover: React.FC<IUrlPopoverProps> = ({ anchor, onSubmit, onCancel }) => {
    const [url, setUrl] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(url)
        setUrl('')
    }

    return (
        <StyledPopover
            open={Boolean(anchor)}
            anchorEl={anchor}
            onClose={onCancel}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    variant="outlined"
                    size="small"
                    autoFocus
                />
                <StyledBox>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={!url}
                    >
                        Add
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setUrl('')
                            onCancel()
                        }}
                    >
                        Cancel
                    </Button>
                </StyledBox>
            </form>
        </StyledPopover>
    )
}

export default UrlPopover
