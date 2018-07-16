import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  z-index: 10;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
`

export const CenterText = styled.div`
  width: 300px;
  background: white;
  padding: 4rem 3rem;
  position: relative;
  border-radius: 6px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`
