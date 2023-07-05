import React from 'react'
import Adminlayout from './Adminlayout';
const ProtectedRoutes = ({component:Component,...rest}) => {

    return (
        <Adminlayout>
            <Component  {...rest}/>
        </Adminlayout>
    )
}

export default ProtectedRoutes;
