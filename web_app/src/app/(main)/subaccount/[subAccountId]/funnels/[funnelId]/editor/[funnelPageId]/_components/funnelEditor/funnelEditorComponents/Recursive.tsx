import { EditorElement } from '@/providers/editor/EditorProvider'
import React from 'react'
import TextComponent from './TextComponent'
import Container from './Container'

type Props = {
    element: EditorElement
}

const Recursive = ({ element }: Props) => {

    switch (element.type) {
        case 'text':
            return <TextComponent element={element} />
        case '__body':
            return <Container element={element} />
        default:
            null
    }
}

export default Recursive