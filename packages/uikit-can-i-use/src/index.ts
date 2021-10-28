import React from 'react'
import ReactDOM from 'react-dom'

// Runtime API check.
export const CAN_USE_HOOKS = !!React.useState
export const CAN_USE_CONTEXT = !!React.createContext
export const CAN_USE_PORTAL = !!ReactDOM.createPortal
export const CAN_USE_FRAGMENT = !!React.Fragment
export const CAN_USE_SUSPENSE = !!React.Suspense
