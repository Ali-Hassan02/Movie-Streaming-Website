import { createContext, useState } from "react";

export const ActionContext = createContext(null);

const ActionProvider = (props)=>{
    const [action, setAction] = useState(null);

    return(
        <ActionContext.Provider value={{action , setAction}}>
            {props.children}
        </ActionContext.Provider>
    );
}

export default ActionProvider;