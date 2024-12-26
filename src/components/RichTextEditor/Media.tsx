import React from 'react'
import { styled } from '@mui/material/styles'

interface IMediaProps {
    block: any
    contentState: any
    blockProps: {
        onClick?: (block: any) => void
        readOnly: boolean
    }
}

const StyledImage = styled('img')(({ theme }) => ({
    maxWidth: '100%',
    height: 'auto',
    cursor: 'pointer',
    '&:hover': {
        opacity: 0.8,
    },
}))

const StyledVideo = styled('video')(({ theme }) => ({
    maxWidth: '100%',
    height: 'auto',
}))

const StyledAudio = styled('audio')(({ theme }) => ({
    width: '100%',
}))

const Media: React.FC<IMediaProps> = (props) => {
    const entity = props.contentState.getEntity(props.block.getEntityAt(0))
    const { src } = entity.getData()
    const type = entity.getType()

    let media
    const onClick = () => {
        if (!props.blockProps.onClick) return
        props.blockProps.onClick(props.block)
    }

    if (type === 'image') {
        media = <StyledImage src={src} alt="" onClick={onClick} />
    } else if (type === 'video') {
        media = <StyledVideo src={src} controls />
    } else if (type === 'audio') {
        media = <StyledAudio src={src} controls />
    }

    return media
}

export default Media
