import React, { FunctionComponent } from 'react'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { TToolbarComponentProps, TToolbarButtonSize } from './Toolbar'

interface IToolbarButtonProps {
    id?: string
    editorId?: string
    label: string
    style: string
    type: string
    active?: boolean
    icon?: JSX.Element
    onClick?: any
    inlineMode?: boolean
    disabled?: boolean
    size?: TToolbarButtonSize
    component?: FunctionComponent<TToolbarComponentProps>
}

const StyledIconButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
    backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
    '&:hover': {
        backgroundColor: isActive 
            ? theme.palette.action.selected 
            : theme.palette.action.hover,
    },
    '& svg': {
        fontSize: '1.25rem',
    },
}))

const ToolbarButton: FunctionComponent<IToolbarButtonProps> = (props) => {
    const size = !props.inlineMode ? (props.size || "medium") : "small"
    const toolbarId = props.inlineMode ? "-toolbar" : ""
    const editorId = props.editorId || "mui-rte"
    const elemId = editorId + "-" + (props.id || props.label) + "-button" + toolbarId
    const sharedProps = {
        id: elemId,
        onMouseDown: (e: React.MouseEvent) => {
            e.preventDefault()
            if (props.onClick) {
                props.onClick(props.style, props.type, elemId, props.inlineMode)
            }
        },
        disabled: props.disabled || false
    }

    if (props.icon) {
        return (
            <StyledIconButton
                {...sharedProps}
                aria-label={props.label}
                isActive={props.active}
                size={size}
            >
                {props.icon}
            </StyledIconButton>
        )
    }

    if (props.component) {
        const Component = props.component;
        const buttonId = props.id || props.label;
        const buttonEditorId = props.editorId || `mui-rte-${buttonId}`;
        return (
            <Component
                id={buttonId}
                editorId={buttonEditorId}
                onMouseDown={sharedProps.onMouseDown}
                active={props.active || false}
                disabled={props.disabled || false}
            />
        );
    }

    return null
}

export default ToolbarButton
