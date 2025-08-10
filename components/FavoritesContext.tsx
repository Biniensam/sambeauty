'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

interface FavoriteItem {
  id: string
  name: string
  brand: string
  price: number
  image: string
}

interface FavoritesState {
  items: FavoriteItem[]
}

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: FavoriteItem }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'CLEAR_FAVORITES' }

const initialState: FavoritesState = {
  items: [],
}

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        return state // Item already exists
      }
      return { ...state, items: [...state.items, action.payload] }
    }
    
    case 'REMOVE_FAVORITE': {
      return { ...state, items: state.items.filter(item => item.id !== action.payload) }
    }
    
    case 'CLEAR_FAVORITES':
      return { ...state, items: [] }
    
    default:
      return state
  }
}

interface FavoritesContextType {
  state: FavoritesState
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (id: string) => void
  clearFavorites: () => void
  isFavorite: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState)

  const addFavorite = (item: FavoriteItem) => {
    dispatch({ type: 'ADD_FAVORITE', payload: item })
  }

  const removeFavorite = (id: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id })
  }

  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' })
  }

  const isFavorite = (id: string) => {
    return state.items.some(item => item.id === id)
  }

  return (
    <FavoritesContext.Provider value={{ state, addFavorite, removeFavorite, clearFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
} 