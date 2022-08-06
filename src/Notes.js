import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useEffect } from 'react'

const StyledNotesContainer = styled.div`
    margin-top: 60px;
`
const StyledNoteContainer = styled.div`
    background-color: #F9F5EB;
    border-radius: 4px;
    margin: 0;
    cursor: pointer;
    margin-bottom: 10px;
    &:hover {
        background-color: #EAE3D2;
    }
`
const StyledNoteSelectContainer = styled(StyledNoteContainer)`
    width: 90%;
    margin: 0;
    @media (max-width: 375px) {
        width: 85%
    }
    @media (max-width: 270px) {
        width: 80%
    }
`
const StyledCheckBox = styled.div`
    width: 20px;
    height: 20px;
    background: ${props => props.selected ? '#F9F5EB' : 'none'};
    border: 2px solid #F9F5EB;
    border-radius: 50px;
    cursor: pointer;
    margin: 0 auto;
`
const StyledWrapper = styled.div`
    width: 10%;
    @media (max-width: 375px) {
        width: 15%
    }
    @media (max-width: 270px) {
        width: 20%
    }
`
const StyledNoteContent = styled.p`
    font-weight: 500;
    font-size: .8rem;
    color: #202020;
    padding: 1em 2em;
    margin: 0;
`
const StyledFlex = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const StyledCreateButton = styled.button`
    width: ${props => props.width};
    padding: .5rem 0;
    font-family: inherit;
    background-color: #C4D7E0;
    color: #303030;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    &:hover {
        background-color: #B2C8DF;
    }
`
const StyledSelectButton = styled(StyledCreateButton)`
    width: 48%;

`
const StyledDeleteButton = styled(StyledCreateButton)`
    width: 100px;
    margin-top: .8rem;
    position: absolute;
    right: 2rem;
    @media (max-width: 375px) {
        right: 1rem;
    }
`
const StyledEmptyText = styled.p`
    color: #F9F5EB;
    text-align: center;
`

export default function Notes({ notes, dispatch }) {
    const { selectWindow, notesList } = notes
    const navigate = useNavigate()

    useEffect(() => {
        dispatch({ type: 'FETCHING DATA FROM STORAGE' })
    }, [dispatch])

    const notesHtml = notesList.map(note => (
        <Link 
            to={`/notes/note/${note.id}`} 
            key={note.id}
            style={{ textDecoration: 'none' }}
        >
            <StyledNoteContainer>
                <StyledNoteContent>
                    {
                        note.content.trim().length === 0 ? '( EMPTY NOTE )' : note.content
                    }
                </StyledNoteContent>
            </StyledNoteContainer>
        </Link>
    ))

    const selectWindowHtml = notesList.map(note => (
            <StyledFlex
                onClick={() => dispatch({ type: "SELECT NOTE", id: note.id })}
                key={note.id}
                style={{ marginBottom: '10px' }}
            >
                <StyledWrapper>
                    <StyledCheckBox selected={note.selected}></StyledCheckBox>
                </StyledWrapper>
                <StyledNoteSelectContainer>
                    <StyledNoteContent>
                        {
                            note.content.trim().length === 0 ? '( EMPTY NOTE )' : note.content
                        }
                    </StyledNoteContent>
                </StyledNoteSelectContainer>
            </StyledFlex>
        )
    )

    const createNewNote = () => {
        dispatch({ type: "CREATE NEW NOTE" })
        navigate(`/notes/note/new`)
    }

    return (
        <>
            <StyledFlex>
                <StyledCreateButton 
                    width={
                        notesList.length > 0 ? '48%' : '100%'
                    }
                    onClick={createNewNote}
                >
                    new note
                </StyledCreateButton>
                {
                    notesList.length > 0 && (
                        selectWindow ?
                        <StyledSelectButton onClick={() => dispatch({ type: "UNSELECT WINDOW" })}>unselect</StyledSelectButton>
                        :
                        <StyledSelectButton onClick={() => dispatch({ type: "SELECT WINDOW" })}>select</StyledSelectButton>
                    )
                }
            </StyledFlex>
            {
                selectWindow && (
                    notesList.filter(n => n.selected === true).length > 0 ?
                    <StyledDeleteButton onClick={() => dispatch({ type: "DELETE SELECTED NOTES" })}>Delete</StyledDeleteButton>
                    :
                    <StyledDeleteButton onClick={() => dispatch({ type: "DELETE ALL" })}>Delete All</StyledDeleteButton>
                )
            }
            <StyledNotesContainer>
                { selectWindow ? selectWindowHtml : notesHtml }
                { notesHtml.length === 0 && <StyledEmptyText>Add a new note</StyledEmptyText> }
            </StyledNotesContainer>
        </>
    )
}