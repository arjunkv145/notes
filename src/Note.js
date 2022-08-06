import { useRef, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
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
    const { id } = useParams()
    const input = useRef(null)
    const { notesList } = notes
    let textArea

    useEffect(() => {
        if (textArea.content === '') {
            input.current.focus()
        }
    })

    if (id === 'new') {
        textArea = notesList[0]
    } else {
        textArea = notesList.find(n => n.id === id)
    }

    const changeHeight = e => {
        e.target.style.height = 'inherit'
        e.target.style.height = `${e.target.scrollHeight}px`
    }

    return (
        <div>
            <Link to='/notes'>
                <StyledBackButton>Go back</StyledBackButton>
            </Link>
            <StyledTextArea
                value={textArea.content} 
                ref={input}
                onChange={e => dispatch({ type: "UPDATE CURRENT NOTE", id: textArea.id, event: e })} 
                onKeyDown={e => changeHeight(e)}
            />
        </div>
    )
}