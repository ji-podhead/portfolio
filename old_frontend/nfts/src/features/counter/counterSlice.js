import { createAsyncThunk, createSlice,configureStore } from '@reduxjs/toolkit';
import { useEffect, useRef } from 'react';
//import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import { exposeStore } from 'redux-in-worker';
import SafeToLocalcStorage from './safeToLocalStorage';
//import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
//import InitMeshes, { InitializeParticles } from '../../3dInstances';

//wird erstmal über json und predownloads gelöst. wird später über bounding box gequeriet, sowie bei dem anderem projekt
//anschließendwird es inder selben hierarchie mit im local storage gesafed
//area:{
//schneider: map(id,tags/properties),
//schlüssel: map(id,tags/properties),
//schuhe: map(id,tags/properties),
//}
export const initialState = {
   
  }

export const counterSlice = createSlice({
  name: 'counter',
  initialState:  {
  auswahl:{index:-1,type:null,object:null},
  currentAreaNodes:{"schneider":[],"schlüssel":[],"schuh":[] },
  mode:"loading",
},
 //tilesInView:  [], ----- BRAUCHE ICH NICHT, WEIL ICH NICHT ÜBER JEDE EINZELNE NODE ITERIERE,
 //                       --> SONDERN ÜBERE DIE TASK-FETCHES DEN BUFFER LEERE
reducers: {
  setSelectedStore:(state,action)=>{
      state.auswahl.index=action.payload.index
        state.auswahl.type=action.payload.type 
        console.log(JSON.stringify(action.payload))
    switch(action.payload.type){
      case("schneider"):{
      state.auswahl.object=state.currentAreaNodes.schneider[action.payload.index]
        break;
      }
      case("schlüssel"):{
        state.auswahl.object=state.currentAreaNodes.schlüssel[action.payload.index]
          break;
        }
        case("schuh"):{
          state.auswahl.object=state.currentAreaNodes.schuh[action.payload.index]
            break;
          }
    }


  },
  setCurrentAreaNodes:(state,action)=>{
      state.currentAreaNodes.schneider=(action.payload.schneider)
      state.currentAreaNodes.schuh=(action.payload.schuh)
      state.currentAreaNodes.schlüssel=(action.payload.schlüssel)
      state.mode="idle"
  console.log(JSON.stringify(state.currentAreaNodes?.schneider))
  }
}});
export const {setSelectedStore,setCurrentAreaNodes} = counterSlice.actions;
export const State =  counterSlice.reducer;
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});
exposeStore(store);

