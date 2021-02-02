import React, {useEffect, useState} from 'react';
import axios from "axios";

const GuestPage = ({history}) => {

    const [currentUserData, setCurrentUserData] = useState({});

    useEffect(() => {
        const currentUserRoutePath = history.location.pathname;
        const currentUserMail = currentUserRoutePath.substring(currentUserRoutePath.length, currentUserRoutePath.lastIndexOf('/') + 1);

        axios.get("http://localhost:4000/api/users/" + currentUserMail, { params: { id: currentUserMail }})
            .then(response => setCurrentUserData(response.data) );


    }, [history.location.pathname]);

    return (
        <div>

        </div>
    );
};

export default GuestPage;