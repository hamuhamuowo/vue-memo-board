import { supabase } from './supabase'

// 보드 불러오기
export const fetchBoards = async () => {
  const { data, error } = await supabase.from('boards').select('*')
  if (error) console.error(error)
  return data || []
}

// 디폴트 보드 추가
export const createDefaultBoard = async () => {
  const defaultBoard = { title: '기본 보드', id: 0 }
  const { data, error } = await supabase.from('boards').insert([defaultBoard]).select()
  if (error) console.error(error)
  return data ? data[0] : null
}

// 보드 추가
export const addBoard = async (title) => {
  const { data, error } = await supabase.from('boards').insert([{ title }]).select()
  if (error) console.error(error)
  return data ? data[0] : null
}

// 보드 삭제
export const deleteBoard = async (boardId) => {
  const { error } = await supabase.from('boards').delete().match({ id: boardId })
  if (error) console.error(error)
}

// 메모 불러오기
export const fetchNotes = async (boardId) => {
  const { data, error } = await supabase.from('notes').select('*').eq('board_id', boardId)
  if (error) console.error(error)
  console.log(data)
  return data || []
}

// 메모 추가
export const addNote = async (boardId, content) => {
  const { data, error } = await supabase
    .from('notes')
    .insert([{ board_id: boardId, content }])
    .select()
  if (error) console.error(error)
  return data ? data[0] : null
}

// 메모 삭제
export const deleteNote = async (noteId) => {
  const { error } = await supabase.from('notes').delete().match({ id: noteId })
  if (error) console.error(error)
}
