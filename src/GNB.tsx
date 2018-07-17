import * as React from 'react'
import { Link } from 'react-router-dom'

const GNB = () => (
 <nav>
   <h2>AGM</h2>
   <ul>
     <li>
        <Link to="/parties/new">
          파티만들기
        </Link>
      </li>
     <li>파티찾기</li>
     <li>로그인</li>
   </ul>
 </nav>
)

export default GNB
