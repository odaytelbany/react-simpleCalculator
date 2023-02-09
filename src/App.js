import React, { useReducer } from 'react'
import DigitButton from './components/DigitButton'
import OperationButton from './components/OperationButton'
import "./style.css"

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate"
}

function reducer (state, {type, payload}) {
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite){
        return {
          ...state,
          currentOpereand: payload.digit,
          overwrite: false
        }
      }
      if ( (payload.digit === "." && state.currentOpereand.includes(".")) || (payload.digit === "." && state.currentOpereand === undefined)){
        return state
      }
      if (payload.digit === "0" && state.currentOpereand === "0"){
        return state
      }
      
      return {
        ...state,
        currentOpereand: `${state.currentOpereand || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOpereand === undefined && state.prevOpereand === undefined){
        return state
      }
      if (state.prevOpereand === null || state.prevOpereand === undefined){
        return {
          ...state,
          currentOpereand: null,
          prevOpereand: state.currentOpereand, 
          operation: payload.operation
        }
      }
      if (state.currentOpereand === null){
        return {
          ...state,
          operation: payload.operation
        }
      }
      return {
        ...state,
        currentOpereand: null,
        prevOpereand: evaluate(state),
        operation: payload.operation,
      }
    
    case ACTIONS.CLEAR: 
      return {}

    case ACTIONS.EVALUATE:
      if (
        state.operation == null || state.prevOpereand == null || state.currentOpereand == null
      ){return state}
      return {
        ...state,
        currentOpereand: evaluate(state),
        prevOpereand: null,
        operation: null,
        overwrite: true
      }
    case ACTIONS.DELETE_DIGIT:
      return {
        ...state,
        currentOpereand: state.currentOpereand.slice(0,-1),
      }
    default: 
      return state
  }
}

function evaluate({currentOpereand, prevOpereand, operation}){
  let prev = parseFloat(prevOpereand);
  let current = parseFloat(currentOpereand);
  let result;
  if (isNaN(prev) || isNaN(current)) {return ""}
  switch(operation){
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "*":
      result = prev * current;
      break;
    case "÷":
      result = prev / current;
      break;
    default:
  }

  return result.toString()
}

function App() {
  const [{currentOpereand, prevOpereand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div>
      <div className='grid-container'>
        <div className='output'>
          <div className='prev-operand'>{prevOpereand} {operation}</div>
          <div className='current-operand'>{currentOpereand}</div>
        </div>
        <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>Ac</button>
        <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
        <OperationButton dispatch={dispatch} operation="÷"/>
        <DigitButton dispatch={dispatch} digit="1"/>
        <DigitButton dispatch={dispatch} digit="2"/>
        <DigitButton dispatch={dispatch} digit="3"/>
        <OperationButton dispatch={dispatch} operation="*"/>
        <DigitButton dispatch={dispatch} digit="4"/>
        <DigitButton dispatch={dispatch} digit="5"/>
        <DigitButton dispatch={dispatch} digit="6"/>
        <OperationButton dispatch={dispatch} operation="+"/>
        <DigitButton dispatch={dispatch} digit="7"/>
        <DigitButton dispatch={dispatch} digit="8"/>
        <DigitButton dispatch={dispatch} digit="9"/>
        <OperationButton dispatch={dispatch} operation="-"/>
        <DigitButton dispatch={dispatch} digit="."/>
        <DigitButton dispatch={dispatch} digit="0"/>
        <button className='span-two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
      </div>
    </div>
  )
}


export default App;
   