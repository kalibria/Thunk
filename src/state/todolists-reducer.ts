import {v1} from 'uuid';
import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {useEffect} from "react";
import {Dispatch} from "redux";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    todoList: TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | ReturnType<typeof setTodoListAC>

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET-TODOLIST':{
            return action.todos.map(tl => ({...tl, filter:"all"}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{...action.todoList, filter: "all"}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state]
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (todoList: TodolistType): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', todoList}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}

export type SetTodoListType = {
    type: 'SET-TODOLIST',
    todos:TodolistType[]
}

export const setTodoListAC = (todos: TodolistType[]) => {
    return {type: 'SET-TODOLIST', todos} as const
}

export const getTodoTC =() => (dispatch: Dispatch) =>{
        todolistsAPI.getTodolists()
            .then((res)=>{
                dispatch(setTodoListAC(res.data))
            })
}

export const addTodoTC =(title: string) => (dispatch: Dispatch) =>{
    todolistsAPI.createTodolist(title)
        .then((res)=>{
            dispatch(addTodolistAC(res.data.data.item))
        })
}

export const deleteTodoTC =(todoListId: string) => (dispatch: Dispatch) =>{
    todolistsAPI.deleteTodolist(todoListId)
        .then((res)=>{
            dispatch(removeTodolistAC(todoListId))
        })
}

export const updateTodoTC =(todoListId: string, title: string) => (dispatch: Dispatch) =>{
    todolistsAPI.updateTodolist(todoListId, title)
        .then((res)=>{
            dispatch(changeTodolistTitleAC(todoListId, title))
        })
}



