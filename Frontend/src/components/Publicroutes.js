import React from 'react';
import Userlayout from './Userlayout';

const Publicroutes = ({component:Component,...rest}) => {
  return (
    <div>
      <Userlayout>
      <Component  {...rest}/>
      </Userlayout>
    </div>
  )
}

export default Publicroutes;
