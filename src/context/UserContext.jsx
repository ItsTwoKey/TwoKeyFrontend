import { createContext, useState } from 'react'

const userContext = createContext();

export const UserState = (props) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [userTypes, setUserTypes] = useState([]);
    const [activeType, setActiveType] = useState();
    const applyFilter = (s = 'all') => {
        setActiveType(s);
        if (s === "all") {
            setFilteredUsers(users);
            return;
        }
        let x = users.filter((i) => i.role_priv === s);
        setFilteredUsers(x);
    };
    return (
        <userContext.Provider value={{
            users, setUsers,
            filteredUsers,
            setFilteredUsers,
            userTypes,
            setUserTypes,
            activeType,
            applyFilter
        }}>
            {props.children}
        </userContext.Provider>
    );
}

export default userContext;