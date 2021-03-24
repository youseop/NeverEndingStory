/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

export default function (SpecificComponent, adminRoute = null) {
    function Validate(props) {
        const location = useLocation();
        useEffect(() => {
            if (location.state === undefined) {
                props.history.replace('/');
            }
        }, [])
        if(location.state) {
            return (
                <SpecificComponent {...props}/>
            )
        }
        else {
            return <div>잘못된 접근입니다ㅋㅋ</div>
        }
    }
    return Validate
}


