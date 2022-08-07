import { useRef, useEffect } from 'react'
import styled from 'styled-components'

const StyledBackButton = styled.button`
    width: 100px;
    padding: .5rem 0;
    font-family: inherit;
    font-size: 1rem;
    background-color: #C4D7E0;
    color: #303030;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    &:hover {
        background-color: #B2C8DF;
    }
    @media (max-width: 375px) {
        font-size: .9rem;
    }
`

const StyledTextArea = styled.textarea`
    width: 100%;
    margin-top: 1em;
    padding: 1em;
    font-family: inherit;
    font-size: 1rem;
    background: none;
    color: #F9F5EB;
    border: none;
    resize: none;
    overflow: hidden;
    border-radius: 4px;
    &:focus {
        outline: none;
    }
`

export default function Note({ notes, dispatch }) {
    const input = useRef(null)
    const { notesList, editNoteId } = notes
    let textArea

    useEffect(() => {
        if (textArea.content === '') {
            input.current.focus()
        }
    })

    textArea = notesList.find(n => n.id === editNoteId)

    const changeHeight = e => {
        e.target.style.height = 'inherit'
        e.target.style.height = `${e.target.scrollHeight}px`
    }

    return (
        <div>
            <StyledBackButton onClick={() => dispatch({ type: 'GO TO HOME' })}>Go back</StyledBackButton>
            <StyledTextArea
                value={textArea.content} 
                ref={input}
                onChange={e => dispatch({ type: "UPDATE CURRENT NOTE", id: textArea.id, event: e })} 
                onKeyDown={e => changeHeight(e)}
            />
        </div>
    )
}