import { useReducer, useEffect } from 'react'
import styled from 'styled-components'
import uuid from 'react-uuid'
import './App.css'
import Notes from './Notes'
import Note from './Note'

const initialNotes = {
  selectWindow: false,
  notesList: [],
  page: 'Home',
  editNoteId: ''
}

const reducer = (state, action) => {
  let notesListData, modifiedNotes, currentNote
  switch (action.type) {
      case 'FETCHING DATA FROM STORAGE':
          notesListData = JSON.parse(localStorage.getItem('notes'))
          return Array.isArray(notesListData) ? { ...state, notesList: notesListData } : state

      case 'SELECT WINDOW':
          return {
            ...state,
            selectWindow: true,
          }

      case 'UNSELECT WINDOW':
          return {
            ...state,
            selectWindow: false,
            notesList: state.notesList.map(n => ({ ...n, selected: false }))
          }

      case 'SELECT NOTE':
          return {
            ...state,
            notesList: state.notesList.map(n => {
              if(n.id === action.id) {
                return { ...n, selected: !n.selected }
              }
              else {
                return n
              }
            })
          }

      case 'DELETE SELECTED NOTES':
        modifiedNotes = state.notesList.filter(n => n.selected === false)
        localStorage.setItem('notes', JSON.stringify(modifiedNotes))
        return { ...state, selectWindow: false, notesList: modifiedNotes }

      case 'DELETE ALL':
        modifiedNotes = []
        localStorage.setItem('notes', JSON.stringify(modifiedNotes))
        return { ...state, selectWindow: false, notesList: modifiedNotes }

      case 'CREATE NEW NOTE':
        const id = uuid()
        const newNote = { id: id, content: "", selected: false }
        modifiedNotes = [newNote, ...state.notesList]
        localStorage.setItem('notes', JSON.stringify(modifiedNotes))

        return {
          ...state,
          notesList: modifiedNotes,
          selectWindow: false,
          page: 'Edit',
          editNoteId: id
        }

      case 'OPEN NOTE':
        return { ...state, page: 'Edit', editNoteId: action.id }

      case 'GO TO HOME':
        currentNote = state.notesList.find(n => n.id === state.editNoteId)
        if (currentNote.content.trim().length === 0) {
          modifiedNotes = state.notesList.filter(n => n.id !== state.editNoteId)
          localStorage.setItem('notes', JSON.stringify(modifiedNotes))
          return { ...state, page: 'Home', editNoteId: '', notesList: modifiedNotes }
        }
        return { ...state, page: 'Home', editNoteId: '' }

      case 'UPDATE CURRENT NOTE':
        notesListData = state.notesList.filter(n => n.id !== action.id)
        currentNote = state.notesList.find(n => n.id === action.id)
        const value = action.event.target.value
        const updatedNote = [{ ...currentNote, content: value }]
        modifiedNotes = [...updatedNote, ...notesListData]
        localStorage.setItem('notes', JSON.stringify(modifiedNotes))
        return { ...state, notesList: modifiedNotes }

      default:
          return state
  }
}

const StyledContainer = styled.div`
  background-color: #6E85B7;
  border-radius: 4px;
  width: 100%;
  max-width: 600px;
  margin: 50px auto;
  padding: 1rem 2rem;
  position: relative;
  @media (max-width: 600px) {
    margin-top: 0;
  }
  @media (max-width: 375px) {
    padding: 1rem 1rem;
  }
`
const StyledHeader = styled.h1`
  margin-top: 0px;
  color: #F9F5EB;
  border-bottom: 1px solid #F9F5EB;
`

function App() {
  const [notes, dispatch] = useReducer(reducer, initialNotes)

  useEffect(() => {
    dispatch({ type: 'FETCHING DATA FROM STORAGE' })
  }, [dispatch])

  return (
    <StyledContainer>
      <StyledHeader>Notes</StyledHeader>
      {
        notes.page === 'Home' && <Notes notes={notes} dispatch={dispatch}/>
      }
      {
        notes.page === 'Edit' && <Note notes={notes} dispatch={dispatch}/>
      }
    </StyledContainer>
  );
}

export default App;
