import React, { ReactElement } from 'react'
import { Paper, List, ListItem } from '@mui/material'
import { styled } from '@mui/material/styles'

interface TAutocompleteItem {
    keys: string[]
    value: string
    content: string | ReactElement
}

interface TAutocompleteProps {
    items: TAutocompleteItem[]
    top: number
    left: number
    selectedIndex: number
    onClick: (index: number) => void
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    minWidth: '200px',
    position: 'absolute',
    zIndex: theme.zIndex.modal,
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '&.selected': {
        backgroundColor: theme.palette.action.selected,
    },
}))

const Autocomplete = (props: TAutocompleteProps) => {
    if (!props.items.length) {
        return null
    }

    return (
        <StyledPaper
            style={{
                top: props.top,
                left: props.left,
            }}
        >
            <List>
                {props.items.map((item, index) => (
                    <StyledListItem
                        key={index}
                        className={index === props.selectedIndex ? 'selected' : ''}
                        onClick={() => props.onClick(index)}
                    >
                        {item.content}
                    </StyledListItem>
                ))}
            </List>
        </StyledPaper>
    )
}

export default Autocomplete
