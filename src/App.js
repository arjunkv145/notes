import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useReducer } from 'react'
import styled from 'styled-components'
import uuid from 'react-uuid'
import './App.css'
import Notes from './Notes'
import Note from './Note'

const initialNotes = {
  selectWindow: false,
  notesList: []
}

const reducer = (state, action) => {
  let notesListData, modifiedNotes
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
        notesListData = JSON.parse(localStorage.getItem('notes'))
        const id = uuid()
        const newNote = { id: id, content: "", selected: false }
        modifiedNotes = []
        if (notesListData === null) {
          modifiedNotes = [newNote]
          localStorage.setItem('notes', JSON.stringify(modifiedNotes))
        }
        else if (Array.isArray(notesListData)) {
          modifiedNotes = [newNote, ...notesListData]
          localStorage.setItem('notes', JSON.stringify(modifiedNotes))
        }
        return { ...state, notesList: modifiedNotes, selectWindow: false }

      case 'UPDATE CURRENT NOTE':
        notesListData = state.notesList.filter(n => n.id !== action.id)
        const currentNote = state.notesList.find(n => n.id === action.id)
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

  return (
    <Router>
      <StyledContainer>
        <StyledHeader>Notes</StyledHeader>
        <Routes>
          <Route path="/notes" element={<Notes notes={notes} dispatch={dispatch}/>} />
          <Route path="/notes/note/:id" element={<Note notes={notes} dispatch={dispatch}/>} />
        </Routes>
      </StyledContainer>
    </Router>
  );
}

export default App;
