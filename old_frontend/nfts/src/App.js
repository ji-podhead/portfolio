import React from 'react';
import './App.css';
import { useState, useEffect } from 'react'
import { useRef } from 'react';
import MainPage from './mainPage';

export default function App() {

const mapRef = useRef(null)
  const controlRef = useRef(null);
  return (
    <div className="App ">
        <MainPage></MainPage>
    </div>
  );
}

